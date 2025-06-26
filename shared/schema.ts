import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["student", "company", "admin"] }).notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  companyName: text("company_name"),
  bio: text("bio"),
  skills: text("skills").array(),
  location: text("location"),
  website: text("website"),
  profileComplete: boolean("profile_complete").default(false),
  createdAt: timestamp("created_at").defaultNow(),
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
  salary: text("salary"),
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

// Insert schemas
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  role: z.enum(["student", "company", "admin"]),
}).pick({
  username: true,
  email: true,
  password: true,
  role: true,
  firstName: true,
  lastName: true,
  companyName: true,
  bio: true,
  skills: true,
  location: true,
  website: true,
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

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Internship = typeof internships.$inferSelect;
export type InsertInternship = z.infer<typeof insertInternshipSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
