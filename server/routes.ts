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
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
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
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to update application status" });
    }
  });

  // Admin routes for internships management
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

  const httpServer = createServer(app);
  return httpServer;
}
