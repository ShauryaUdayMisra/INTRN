import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertInternshipSchema, insertApplicationSchema, insertBlogPostSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Authentication routes
  setupAuth(app);

  // Internship routes
  app.get("/api/internships", async (req, res) => {
    try {
      const { location, skills, type } = req.query;
      const filters: any = {};
      
      if (location) filters.location = location as string;
      if (type) filters.type = type as string;
      if (skills) filters.skills = Array.isArray(skills) ? skills : [skills];
      
      const internships = await storage.getInternships(filters);
      res.json(internships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch internships" });
    }
  });

  app.get("/api/internships/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const internship = await storage.getInternship(id);
      if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
      }
      res.json(internship);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch internship" });
    }
  });

  app.post("/api/internships", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "company") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    try {
      const validatedData = insertInternshipSchema.parse(req.body);
      const internship = await storage.createInternship({
        ...validatedData,
        companyId: req.user.id,
      });
      res.status(201).json(internship);
    } catch (error) {
      res.status(400).json({ message: "Invalid internship data" });
    }
  });

  app.get("/api/my-internships", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "company") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    try {
      const internships = await storage.getInternshipsByCompany(req.user.id);
      res.json(internships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch internships" });
    }
  });

  // Application routes
  app.get("/api/applications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const { internshipId } = req.query;
      let applications;
      
      if (req.user.role === "student") {
        applications = await storage.getApplications(undefined, req.user.id);
      } else if (req.user.role === "company" && internshipId) {
        applications = await storage.getApplications(parseInt(internshipId as string));
      } else {
        return res.status(400).json({ message: "Invalid request" });
      }
      
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication({
        ...validatedData,
        studentId: req.user.id,
      });
      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ message: "Invalid application data" });
    }
  });

  // Favorites routes
  app.get("/api/favorites", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    try {
      const favorites = await storage.getFavorites(req.user.id);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    try {
      const { internshipId } = req.body;
      const favorite = await storage.addFavorite(req.user.id, internshipId);
      res.status(201).json(favorite);
    } catch (error) {
      res.status(400).json({ message: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:internshipId", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    try {
      const internshipId = parseInt(req.params.internshipId);
      const removed = await storage.removeFavorite(req.user.id, internshipId);
      if (removed) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(true);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", async (req, res) => {
    if (!req.isAuthenticated() || !["admin", "company"].includes(req.user?.role || "")) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost({
        ...validatedData,
        authorId: req.user.id,
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });

  // Profile routes
  app.get("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    res.json(req.user);
  });

  app.put("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const updates = req.body;
      delete updates.id;
      delete updates.password;
      delete updates.username;
      delete updates.email;
      
      const updatedUser = await storage.updateUser(req.user.id, updates);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
