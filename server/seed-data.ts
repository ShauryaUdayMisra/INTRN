import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedSampleData() {
  try {
    console.log("🌱 Seeding sample data...");

    // Hash admin passwords properly
    const adminPassword = await hashPassword("admin");

    // Create admin users
    const adminUsers = [
      { username: "admin1", email: "admin1@intrn.xyz", password: adminPassword, role: "admin" as const },
      { username: "admin2", email: "admin2@intrn.xyz", password: adminPassword, role: "admin" as const },
      { username: "admin3", email: "admin3@intrn.xyz", password: adminPassword, role: "admin" as const }
    ];

    // No fake companies - users will register themselves

    // No fake students - users will register themselves

    // Seed admin users first
    console.log("Creating admin accounts...");
    for (const admin of adminUsers) {
      try {
        const existingUser = await storage.getUserByEmail(admin.email);
        if (!existingUser) {
          const user = await storage.createUser(admin);
          console.log(`✓ Created admin: ${admin.username}`);
        } else {
          console.log(`✓ Admin ${admin.username} already exists`);
        }
      } catch (error) {
        console.log(`Admin ${admin.username} creation failed:`, error);
      }
    }

    // No fake user creation - only real registrations

    // Only admin accounts are created automatically

    console.log("✅ Sample data seeding completed!");
    
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}