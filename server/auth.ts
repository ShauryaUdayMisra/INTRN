import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false);
      }
      
      // Special handling for admin1, admin2, admin3 with plain text password
      if (['admin1', 'admin2', 'admin3'].includes(username) && password === 'admin') {
        return done(null, user);
      }
      
      // Regular password comparison for other users
      if (!(await comparePasswords(password, user.password))) {
        return done(null, false);
      }
      
      return done(null, user);
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("Registration request body:", req.body);
      const { email } = req.body;
      
      // Check for existing email
      if (email) {
        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail) {
          return res.status(400).json({ 
            message: "An account with this email already exists. Please sign in instead.",
            redirect: "signin"
          });
        }
      }

      // Remove ID field and clean up array fields
      const { id, ...userData } = req.body;
      
      // Ensure password is provided and hash it
      if (!req.body.password) {
        return res.status(400).json({ message: "Password is required" });
      }
      
      const hashedPassword = await hashPassword(req.body.password);
      
      // Clean up array fields - ensure they are arrays, not strings
      const cleanUserData = {
        ...userData,
        password: hashedPassword,
        skills: Array.isArray(userData.skills) ? userData.skills : [],
        hobbies: Array.isArray(userData.hobbies) ? userData.hobbies : [],
        interestedFields: Array.isArray(userData.interestedFields) ? userData.interestedFields : [],
        preferredCompanies: Array.isArray(userData.preferredCompanies) ? userData.preferredCompanies : [],
      };
      
      const user = await storage.createUser(cleanUserData);

      console.log("User created successfully:", user.id);

      req.login(user, (err) => {
        if (err) {
          console.error("Login error after registration:", err);
          return next(err);
        }
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed: " + (error as Error).message });
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
