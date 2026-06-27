import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { setupAuth as setupReplitAuth, isAuthenticated } from "./replitAuth";
import { setupOAuth } from "./oauth";
import { storage } from "./storage";
import { seedSampleData } from "./seed-data";
import { seedBlogPosts } from "./seed-blog";
import { seedCustomBlogs } from "./seed-custom-blogs";
import { insertInternshipSchema, insertApplicationSchema, insertBlogPostSchema } from "@shared/schema";
import { sendApplicationReceivedEmail, sendApplicationAcceptedEmail } from "./email";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  setupAuth(app);
  
  // Simple Replit Auth demo routes (for demonstration purposes)
  app.get("/api/login", (req, res) => {
    // Redirect to a demo auth page that shows the feature is coming soon
    res.redirect("/auth?demo=replit");
  });
  
  // OAuth routes for social login
  await setupOAuth(app);
  
  // Seed admin accounts and sample data
  await seedSampleData();
  await seedCustomBlogs();
  
  // Import and call ripples internship seeding
  const { seedRipplesInternship } = await import("./seed-ripples-internship");
  await seedRipplesInternship();
  
  // Import and call prelude internship seeding
  const { seedPreludeInternship } = await import("./seed-prelude-internship");
  await seedPreludeInternship();
  
  // Import and call Bir Terraces internship seeding
  const { seedBirTerracesInternship } = await import("./seed-bir-terraces");
  await seedBirTerracesInternship();

  // Import and call new company internships seeding (Kebabsmith + Chandrani Pearls)
  const { seedNewCompanyInternships } = await import("./seed-new-companies");
  await seedNewCompanyInternships();
  
  // Replit Auth user route
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching Replit user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Middleware to check admin access for specific users
  const requireSpecialAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    if (!['admin1', 'admin2', 'admin3'].includes(req.user.username)) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    next();
  };

  // Admin backend routes - only accessible by admin1, admin2, admin3
  app.get("/api/admin/users", requireSpecialAdmin, async (req, res) => {
    try {
      // Get all users from database including admin passwords
      const { db } = await import("./db");
      const { users } = await import("@shared/schema");
      
      const allUsers = await db.select().from(users);
      
      // For admin access, provide actual passwords from adminPassword field
      const usersWithDetails = allUsers.map(user => ({
        ...user,
        actualPassword: user.adminPassword || "Not available" // Show actual password for admin viewing
      }));
      
      res.json(usersWithDetails);
    } catch (error) {
      console.error("Admin users fetch error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/companies", requireSpecialAdmin, async (req, res) => {
    try {
      const companies = await storage.getCompaniesList();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.get("/api/admin/students", requireSpecialAdmin, async (req, res) => {
    try {
      const students = await storage.getStudentsList();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.get("/api/admin/pending-signups", requireSpecialAdmin, async (req, res) => {
    try {
      const pendingUsers = await storage.getPendingSignups();
      res.json(pendingUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending signups" });
    }
  });

  // Comprehensive admin routes for user management
  app.patch("/api/admin/users/:id", requireSpecialAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", requireSpecialAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // Note: This is a soft delete - just mark as inactive rather than actual deletion
      const user = await storage.updateUser(id, { termsAccepted: false });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deactivated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Admin routes for applications management
  app.get("/api/admin/applications", requireSpecialAdmin, async (req, res) => {
    try {
      const applications = await storage.getApplicationsWithDetails();
      res.json(applications);
    } catch (error) {
      console.error("Admin applications fetch error:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.patch("/api/admin/applications/:id/status", requireSpecialAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const application = await storage.updateApplicationStatus(id, status);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      
      // If accepted, send acceptance email with confirmation link
      if (status === 'accepted') {
        const student = await storage.getUser(application.studentId);
        const internship = await storage.getInternship(application.internshipId);
        
        if (student && internship) {
          const company = await storage.getUser(internship.companyId);
          const confirmationToken = nanoid(32);
          
          // Save the confirmation token
          await storage.setApplicationConfirmationToken(id, confirmationToken);
          
          // Get the base URL from environment
          const baseUrl = process.env.REPLIT_DEV_DOMAIN 
            ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
            : 'http://localhost:5000';
          
          // Send acceptance email with confirmation link
          sendApplicationAcceptedEmail(
            student.email,
            student.firstName || 'Student',
            internship.title,
            company?.companyName || 'Company',
            confirmationToken,
            baseUrl
          ).catch(err => console.error("Failed to send acceptance email:", err));
        }
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to update application status" });
    }
  });

  // Admin-only organisation status (pending/confirmed/completed) — never shown to students, no emails sent
  app.patch("/api/admin/applications/:id/admin-status", requireSpecialAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { adminStatus } = req.body;
      if (!["pending", "confirmed", "completed"].includes(adminStatus)) {
        return res.status(400).json({ error: "Invalid admin status" });
      }
      const application = await storage.updateApplicationAdminStatus(id, adminStatus);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to update admin status" });
    }
  });

  // Admin routes for internships management
  app.get("/api/admin/internships", requireSpecialAdmin, async (req, res) => {
    try {
      const allInternships = await storage.getAllInternships();
      res.json(allInternships);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch internships" });
    }
  });

  app.patch("/api/admin/internships/:id", requireSpecialAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const internship = await storage.updateInternship(id, updates);
      if (!internship) {
        return res.status(404).json({ error: "Internship not found" });
      }
      res.json(internship);
    } catch (error) {
      res.status(500).json({ error: "Failed to update internship" });
    }
  });

  app.delete("/api/admin/internships/:id", requireSpecialAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteInternship(id);
      if (!success) {
        return res.status(404).json({ error: "Internship not found" });
      }
      res.json({ message: "Internship deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete internship" });
    }
  });

  // Admin routes for blog management
  app.get("/api/admin/blog", requireSpecialAdmin, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.patch("/api/admin/blog/:id", requireSpecialAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const post = await storage.updateBlogPost(id, updates);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", requireSpecialAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Admin routes for company requests management
  app.get("/api/admin/company-requests", requireSpecialAdmin, async (req, res) => {
    try {
      const requests = await storage.getCompanyRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company requests" });
    }
  });

  app.patch("/api/admin/company-requests/:id", requireSpecialAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, adminNotes, reviewedBy } = req.body;
      const request = await storage.updateCompanyRequestStatus(id, status, adminNotes, reviewedBy);
      if (!request) {
        return res.status(404).json({ error: "Company request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to update company request" });
    }
  });

  // Public platform stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

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

      // adminStatus is admin-only organisation metadata — never expose it to students/companies
      const sanitized = applications.map(({ adminStatus, ...rest }: any) => rest);
      res.json(sanitized);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    if (!req.isAuthenticated() || req.user?.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    try {
      const applicationData = {
        studentId: req.user.id,
        internshipId: req.body.internshipId,
        coverLetter: req.body.coverLetter || "Application submitted through INTRN platform",
        resume: req.body.resume || "Available upon request",
      };
      
      const validatedData = insertApplicationSchema.parse(applicationData);
      const application = await storage.createApplication(validatedData);
      
      // Send application received email to student
      const internship = await storage.getInternship(req.body.internshipId);
      if (internship && req.user.email) {
        const company = await storage.getUser(internship.companyId);
        sendApplicationReceivedEmail(
          req.user.email,
          req.user.firstName || 'Student',
          internship.title,
          company?.companyName || 'Company'
        ).catch(err => console.error("Failed to send application email:", err));
      }
      
      res.status(201).json(application);
    } catch (error) {
      console.error("Application creation error:", error);
      res.status(400).json({ message: "Invalid application data", error: (error as Error).message });
    }
  });

  // Confirmation endpoint - when student clicks the link in acceptance email
  app.get("/api/applications/confirm/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const application = await storage.confirmApplication(token);
      
      if (!application) {
        return res.redirect("/?error=invalid-confirmation");
      }
      
      // Redirect to a success page
      res.redirect("/?confirmed=true");
    } catch (error) {
      console.error("Confirmation error:", error);
      res.redirect("/?error=confirmation-failed");
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

  // Get user by ID (public info only)
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Return only public information
      const publicUser = {
        id: user.id,
        companyName: user.companyName,
        companyField: user.companyField,
        location: user.location,
        website: user.website,
      };
      res.json(publicUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
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

  // Student onboarding route
  app.patch("/api/user/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const updates = req.body;
      const updatedUser = await storage.updateUser(req.user.id, { 
        ...updates, 
        profileComplete: true 
      });
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  // Company application route
  app.post("/api/company-application", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "company") {
      return res.status(403).json({ message: "Access denied" });
    }

    try {
      const applicationData = {
        ...req.body,
        userId: req.user.id,
      };
      const request = await storage.createCompanyRequest(applicationData);
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  // Admin routes for company requests
  app.get("/api/admin/company-requests", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    try {
      const requests = await storage.getCompanyRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company requests" });
    }
  });

  app.patch("/api/admin/company-request/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    try {
      const requestId = parseInt(req.params.id);
      const { status, adminNotes } = req.body;
      const request = await storage.updateCompanyRequestStatus(
        requestId, 
        status, 
        adminNotes, 
        req.user.id
      );
      if (request) {
        res.json(request);
      } else {
        res.status(404).json({ message: "Company request not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update company request" });
    }
  });

  // Simple Replit Auth demo endpoint
  app.get("/api/login", (req, res) => {
    // This demonstrates where Replit Auth would be integrated
    // For now, it redirects to the existing auth page
    res.redirect("/auth?demo=replit");
  });

  // Replit Auth user endpoint for demonstration
  app.get("/api/auth/user", (req, res) => {
    // This would integrate with Replit Auth
    // For now, it returns unauthorized to show the demo works
    res.status(401).json({ message: "Replit Auth not fully configured" });
  });

  // Dynamic sitemap.xml
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const [internships, blogPosts] = await Promise.all([
        storage.getInternships({}),
        storage.getBlogPosts(true),
      ]);

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const now = new Date().toISOString().split("T")[0];

      const staticUrls = [
        { loc: "/", priority: "1.0", changefreq: "daily" },
        { loc: "/search", priority: "0.9", changefreq: "daily" },
        { loc: "/blog", priority: "0.8", changefreq: "weekly" },
        { loc: "/company-info", priority: "0.7", changefreq: "monthly" },
        { loc: "/help", priority: "0.5", changefreq: "monthly" },
      ];

      const internshipUrls = internships.map((i) => ({
        loc: `/internship/${i.id}`,
        priority: "0.8",
        changefreq: "weekly",
      }));

      const blogUrls = blogPosts.map((p) => ({
        loc: `/blog/${p.slug}`,
        priority: "0.7",
        changefreq: "monthly",
      }));

      const allUrls = [...staticUrls, ...internshipUrls, ...blogUrls];

      const urlElements = allUrls
        .map(
          (u) => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
        )
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

      res.set("Content-Type", "application/xml").send(xml);
    } catch (error) {
      res.status(500).send("Failed to generate sitemap");
    }
  });

  // Soft-404: validate dynamic public routes before SPA catch-all
  const NOT_FOUND_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Not Found — INTRN</title><meta name="robots" content="noindex"></head><body><h1>404 Not Found</h1><p>The page you requested does not exist.</p><a href="/">Go to homepage</a></body></html>`;

  app.get("/internship/:id", async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(404).send(NOT_FOUND_HTML);
    try {
      const internship = await storage.getInternship(id);
      if (!internship) return res.status(404).send(NOT_FOUND_HTML);
      return next();
    } catch (e) {
      console.error("Internship lookup error:", e);
      return res.status(404).send(NOT_FOUND_HTML);
    }
  });

  app.get("/blog/:slug", async (req, res, next) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.published) return res.status(404).send(NOT_FOUND_HTML);
      return next();
    } catch (e) {
      console.error("Blog lookup error:", e);
      return res.status(404).send(NOT_FOUND_HTML);
    }
  });

  // Unknown SPA paths: return 404 instead of 200 index.html
  // Allow file extensions (robots.txt, llms.txt, etc.) to fall through to static serving
  const KNOWN_SPA_PATHS = new Set([
    "/",
    "/auth",
    "/search",
    "/blog",
    "/company-info",
    "/company-signup",
    "/company-thank-you",
    "/application-success",
    "/help",
    "/status",
    "/oauth-setup",
    "/dashboard",
    "/company-dashboard",
    "/company-status",
    "/company-application-status",
    "/company-application",
    "/profile",
    "/admin",
    "/admin-backend",
  ]);

  app.use((req, res, next) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/auth/")) {
      return next();
    }
    // Allow Vite internal paths (HMR, module resolution, dev tools)
    if (req.path.startsWith("/@") || req.path.startsWith("/__")) {
      return next();
    }
    // Allow static files (anything with an extension like .txt, .xml, .js, .css, etc.)
    if (/\.[a-zA-Z0-9]+$/.test(req.path)) {
      return next();
    }
    const base = req.path.replace(/\/$/, "") || "/";
    if (
      KNOWN_SPA_PATHS.has(base) ||
      /^\/internship\/\d+$/.test(base) ||
      /^\/blog\/[a-z0-9-]+$/.test(base)
    ) {
      return next();
    }
    res.status(404).send(NOT_FOUND_HTML);
  });

  const httpServer = createServer(app);
  return httpServer;
}
