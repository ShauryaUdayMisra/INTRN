import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table updated for Replit Auth
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // Auto-incrementing integer ID to match existing database
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  adminPassword: text("admin_password"), // Plain text password for admin access only
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  
  // Custom platform fields
  role: text("role", { enum: ["student", "company", "admin"] }).default("student"),
  companyName: text("company_name"),
  bio: text("bio"),
  skills: text("skills").array(),
  hobbies: text("hobbies").array(),
  interestedFields: text("interested_fields").array(),
  internshipDuration: text("internship_duration"), // 1-3 months, 3-6 months, 6+ months
  preferredCompanies: text("preferred_companies").array(),
  location: text("location"),
  website: text("website"),
  companyField: text("company_field"), // tech, agriculture, finance, etc.
  internshipType: text("internship_type"), // online, offline, hybrid
  university: text("university"),
  graduationYear: integer("graduation_year"),
  grade: text("grade", { enum: ["9th", "10th", "11th", "12th"] }),
  isApproved: boolean("is_approved").default(false),
  termsAccepted: boolean("terms_accepted").default(false),
  profileComplete: boolean("profile_complete").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const internships = pgTable("internships", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  location: text("location").notNull(),
  type: text("type", { enum: ["remote", "onsite", "hybrid"] }).notNull(),
  duration: text("duration").notNull(),
  skills: text("skills").array(),
  applicationDeadline: timestamp("application_deadline"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  internshipId: integer("internship_id").notNull().references(() => internships.id),
  coverLetter: text("cover_letter"),
  resume: text("resume"),
  status: text("status", { enum: ["pending", "reviewed", "accepted", "rejected"] }).default("pending"),
  appliedAt: timestamp("applied_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  internshipId: integer("internship_id").notNull().references(() => internships.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  slug: text("slug").notNull().unique(),
  category: text("category"),
  tags: text("tags").array(),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const companyRequests = pgTable("company_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  companyField: text("company_field").notNull(),
  internshipType: text("internship_type").notNull(),
  description: text("description").notNull(),
  website: text("website"),
  location: text("location").notNull(),
  termsAccepted: boolean("terms_accepted").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending"),
  adminNotes: text("admin_notes"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  internships: many(internships),
  applications: many(applications),
  favorites: many(favorites),
  blogPosts: many(blogPosts),
}));

export const internshipsRelations = relations(internships, ({ one, many }) => ({
  company: one(users, {
    fields: [internships.companyId],
    references: [users.id],
  }),
  applications: many(applications),
  favorites: many(favorites),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  student: one(users, {
    fields: [applications.studentId],
    references: [users.id],
  }),
  internship: one(internships, {
    fields: [applications.internshipId],
    references: [internships.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  student: one(users, {
    fields: [favorites.studentId],
    references: [users.id],
  }),
  internship: one(internships, {
    fields: [favorites.internshipId],
    references: [internships.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

export const companyRequestsRelations = relations(companyRequests, ({ one }) => ({
  user: one(users, {
    fields: [companyRequests.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [companyRequests.reviewedBy],
    references: [users.id],
  }),
}));

// Insert schemas for Replit Auth
export const upsertUserSchema = createInsertSchema(users, {
  email: z.string().email().optional(),
  role: z.enum(["student", "company", "admin"]).optional(),
}).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email().optional(),
  role: z.enum(["student", "company", "admin"]).optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertInternshipSchema = createInsertSchema(internships, {
  type: z.enum(["remote", "onsite", "hybrid"]),
}).omit({
  id: true,
  companyId: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
  status: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

export const insertCompanyRequestSchema = createInsertSchema(companyRequests).omit({
  id: true,
  userId: true,
  status: true,
  submittedAt: true,
  reviewedAt: true,
  reviewedBy: true,
});

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Internship = typeof internships.$inferSelect;
export type InsertInternship = z.infer<typeof insertInternshipSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type CompanyRequest = typeof companyRequests.$inferSelect;
export type InsertCompanyRequest = z.infer<typeof insertCompanyRequestSchema>;
