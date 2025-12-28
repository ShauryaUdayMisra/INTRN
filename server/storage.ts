import { users, internships, applications, favorites, blogPosts, companyRequests, type User, type UpsertUser, type InsertUser, type Internship, type InsertInternship, type Application, type InsertApplication, type Favorite, type BlogPost, type InsertBlogPost, type CompanyRequest, type InsertCompanyRequest } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, ilike, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Internship methods
  getInternships(filters?: { location?: string; skills?: string[]; type?: string }): Promise<Internship[]>;
  getInternship(id: number): Promise<Internship | undefined>;
  getInternshipsByCompany(companyId: number): Promise<Internship[]>;
  createInternship(internship: InsertInternship & { companyId: number }): Promise<Internship>;
  updateInternship(id: number, updates: Partial<InsertInternship>): Promise<Internship | undefined>;
  deleteInternship(id: number): Promise<boolean>;
  
  // Application methods
  getApplications(internshipId?: number, studentId?: number): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;
  setApplicationConfirmationToken(id: number, token: string): Promise<Application | undefined>;
  confirmApplication(token: string): Promise<Application | undefined>;
  getApplicationByToken(token: string): Promise<Application | undefined>;
  
  // Favorites methods
  getFavorites(studentId: number): Promise<Favorite[]>;
  addFavorite(studentId: number, internshipId: number): Promise<Favorite>;
  removeFavorite(studentId: number, internshipId: number): Promise<boolean>;
  
  // Blog methods
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost & { authorId: number }): Promise<BlogPost>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Admin-specific methods
  getApplicationsWithDetails(): Promise<any[]>;
  getCompaniesList(): Promise<User[]>;
  getStudentsList(): Promise<User[]>;
  getPendingSignups(): Promise<User[]>;
  
  // Company request methods
  getCompanyRequests(): Promise<CompanyRequest[]>;
  createCompanyRequest(request: InsertCompanyRequest & { userId: number }): Promise<CompanyRequest>;
  updateCompanyRequestStatus(id: number, status: string, adminNotes?: string, reviewedBy?: number): Promise<CompanyRequest | undefined>;
  
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }



  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Internship methods
  async getInternships(filters?: { location?: string; skills?: string[]; type?: string }): Promise<Internship[]> {
    let query = db.select().from(internships).where(eq(internships.isActive, true));
    
    if (filters?.location) {
      query = query.where(ilike(internships.location, `%${filters.location}%`));
    }
    
    if (filters?.type) {
      query = query.where(eq(internships.type, filters.type));
    }
    
    return await query.orderBy(desc(internships.createdAt));
  }

  async getInternship(id: number): Promise<Internship | undefined> {
    const [internship] = await db.select().from(internships).where(eq(internships.id, id));
    return internship || undefined;
  }

  async getInternshipsByCompany(companyId: number): Promise<Internship[]> {
    return await db
      .select()
      .from(internships)
      .where(eq(internships.companyId, companyId))
      .orderBy(desc(internships.createdAt));
  }

  async createInternship(internship: InsertInternship & { companyId: number }): Promise<Internship> {
    const [newInternship] = await db
      .insert(internships)
      .values(internship)
      .returning();
    return newInternship;
  }

  async updateInternship(id: number, updates: Partial<InsertInternship>): Promise<Internship | undefined> {
    const [internship] = await db
      .update(internships)
      .set(updates)
      .where(eq(internships.id, id))
      .returning();
    return internship || undefined;
  }

  async deleteInternship(id: number): Promise<boolean> {
    const result = await db.delete(internships).where(eq(internships.id, id));
    return result.rowCount > 0;
  }

  // Application methods
  async getApplications(internshipId?: number, studentId?: number): Promise<Application[]> {
    let query = db.select().from(applications);
    
    if (internshipId && studentId) {
      query = query.where(and(eq(applications.internshipId, internshipId), eq(applications.studentId, studentId)));
    } else if (internshipId) {
      query = query.where(eq(applications.internshipId, internshipId));
    } else if (studentId) {
      query = query.where(eq(applications.studentId, studentId));
    }
    
    return await query.orderBy(desc(applications.appliedAt));
  }

  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db
      .insert(applications)
      .values(application)
      .returning();
    return newApplication;
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    const [application] = await db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();
    return application || undefined;
  }

  async setApplicationConfirmationToken(id: number, token: string): Promise<Application | undefined> {
    const [application] = await db
      .update(applications)
      .set({ confirmationToken: token })
      .where(eq(applications.id, id))
      .returning();
    return application || undefined;
  }

  async getApplicationByToken(token: string): Promise<Application | undefined> {
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.confirmationToken, token));
    return application || undefined;
  }

  async confirmApplication(token: string): Promise<Application | undefined> {
    const [application] = await db
      .update(applications)
      .set({ 
        confirmed: true, 
        confirmedAt: new Date() 
      })
      .where(eq(applications.confirmationToken, token))
      .returning();
    return application || undefined;
  }

  // Favorites methods
  async getFavorites(studentId: number): Promise<Favorite[]> {
    return await db
      .select()
      .from(favorites)
      .where(eq(favorites.studentId, studentId))
      .orderBy(desc(favorites.createdAt));
  }

  async addFavorite(studentId: number, internshipId: number): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values({ studentId, internshipId })
      .returning();
    return favorite;
  }

  async removeFavorite(studentId: number, internshipId: number): Promise<boolean> {
    const result = await db
      .delete(favorites)
      .where(and(eq(favorites.studentId, studentId), eq(favorites.internshipId, internshipId)));
    return result.rowCount > 0;
  }

  // Blog methods
  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    if (published !== undefined) {
      query = query.where(eq(blogPosts.published, published));
    }
    
    return await query.orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost & { authorId: number }): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db
      .update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return post || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }

  // Admin-specific methods
  async getApplicationsWithDetails(): Promise<any[]> {
    const result = await db
      .select({
        id: applications.id,
        status: applications.status,
        appliedAt: applications.appliedAt,
        coverLetter: applications.coverLetter,
        resume: applications.resume,
        studentId: applications.studentId,
        internshipId: applications.internshipId,
        // Student details
        studentFirstName: users.firstName,
        studentLastName: users.lastName,
        studentEmail: users.email,
        studentLocation: users.location,
        studentSkills: users.skills,
        studentBio: users.bio,
        studentGrade: users.grade,
        studentSchoolName: users.schoolName,
        studentUniversity: users.university,
        studentGraduationYear: users.graduationYear,
        // Internship details
        internshipTitle: internships.title,
        internshipDescription: internships.description,
        internshipLocation: internships.location,
        internshipType: internships.type,
        internshipDuration: internships.duration,
        // Company details
        companyId: internships.companyId,
      })
      .from(applications)
      .innerJoin(users, eq(applications.studentId, users.id))
      .innerJoin(internships, eq(applications.internshipId, internships.id))
      .orderBy(desc(applications.appliedAt));

    // Get company details separately to avoid table alias conflicts
    const applicationsWithCompanies = await Promise.all(
      result.map(async (app) => {
        const [company] = await db
          .select({
            companyName: users.companyName,
            companyEmail: users.email,
            companyWebsite: users.website,
            companyLocation: users.location,
            companyField: users.companyField,
          })
          .from(users)
          .where(eq(users.id, app.companyId));

        return {
          ...app,
          company,
        };
      })
    );

    return applicationsWithCompanies;
  }

  async getCompaniesList(): Promise<User[]> {
    const companies = await db.select().from(users).where(eq(users.role, "company"));
    return companies;
  }

  async getStudentsList(): Promise<User[]> {
    const students = await db.select().from(users).where(eq(users.role, "student"));
    return students;
  }

  async getPendingSignups(): Promise<User[]> {
    // For now, return all recently created users (within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const pendingUsers = await db.select()
      .from(users)
      .where(
        and(
          or(eq(users.role, "student"), eq(users.role, "company")),
          eq(users.profileComplete, false)
        )
      );
    return pendingUsers;
  }

  // Company request methods
  async getCompanyRequests(): Promise<CompanyRequest[]> {
    return await db.select().from(companyRequests).orderBy(desc(companyRequests.submittedAt));
  }

  async createCompanyRequest(request: InsertCompanyRequest & { userId: number }): Promise<CompanyRequest> {
    const [newRequest] = await db
      .insert(companyRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async updateCompanyRequestStatus(
    id: number, 
    status: string, 
    adminNotes?: string, 
    reviewedBy?: number
  ): Promise<CompanyRequest | undefined> {
    const [updatedRequest] = await db
      .update(companyRequests)
      .set({
        status: status as any,
        adminNotes,
        reviewedBy,
        reviewedAt: new Date(),
      })
      .where(eq(companyRequests.id, id))
      .returning();
    return updatedRequest;
  }
}

export const storage = new DatabaseStorage();
