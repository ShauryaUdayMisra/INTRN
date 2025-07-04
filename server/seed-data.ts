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

    // Hash company passwords properly  
    const companyPassword = await hashPassword("company123");

    // Create sample companies
    const sampleCompanies = [
      {
        username: "tcs_recruiter",
        email: "careers@tcs.com",
        password: companyPassword,
        role: "company" as const,
        companyName: "Tata Consultancy Services",
        firstName: "Rajesh",
        lastName: "Kumar",
        location: "Mumbai, India",
        bio: "Leading IT services company in India"
      },
      {
        username: "infosys_hr",
        email: "recruitment@infosys.com", 
        password: companyPassword,
        role: "company" as const,
        companyName: "Infosys Limited",
        firstName: "Priya",
        lastName: "Sharma",
        location: "Bangalore, India",
        bio: "Global leader in consulting and IT services"
      },
      {
        username: "flipkart_talent",
        email: "internships@flipkart.com",
        password: companyPassword,
        role: "company" as const,
        companyName: "Flipkart",
        firstName: "Amit",
        lastName: "Patel", 
        location: "Bangalore, India",
        bio: "India's leading e-commerce marketplace"
      }
    ];

    // Hash student passwords properly
    const studentPassword = await hashPassword("student123");

    // Create sample students
    const sampleStudents = [
      {
        username: "rahul_dev",
        email: "rahul.sharma@student.com",
        password: studentPassword,
        role: "student" as const,
        firstName: "Rahul",
        lastName: "Sharma",
        location: "Delhi, India",
        bio: "Computer Science student passionate about full-stack development",
        skills: ["React", "Node.js", "Python", "MongoDB"],
        university: "Delhi Technological University",
        graduationYear: 2025
      },
      {
        username: "priya_data",
        email: "priya.singh@student.com",
        password: studentPassword,
        role: "student" as const,
        firstName: "Priya",
        lastName: "Singh", 
        location: "Mumbai, India",
        bio: "Data Science enthusiast with strong analytical skills",
        skills: ["Python", "Machine Learning", "SQL", "Tableau"],
        university: "IIT Bombay",
        graduationYear: 2024
      },
      {
        username: "arjun_mobile",
        email: "arjun.kumar@student.com",
        password: studentPassword,
        role: "student" as const,
        firstName: "Arjun",
        lastName: "Kumar",
        location: "Bangalore, India", 
        bio: "Mobile app developer interested in Android and iOS development",
        skills: ["Java", "Kotlin", "Swift", "React Native"],
        university: "Bangalore Institute of Technology",
        graduationYear: 2025
      }
    ];

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

    // Seed users
    const createdCompanies = [];
    const createdStudents = [];

    for (const company of sampleCompanies) {
      try {
        const existingUser = await storage.getUserByEmail(company.email);
        if (!existingUser) {
          const user = await storage.createUser(company);
          createdCompanies.push(user);
          console.log(`✓ Created company: ${company.companyName}`);
        }
      } catch (error) {
        console.log(`Company ${company.companyName} might already exist`);
      }
    }

    for (const student of sampleStudents) {
      try {
        const existingUser = await storage.getUserByEmail(student.email);
        if (!existingUser) {
          const user = await storage.createUser(student);
          createdStudents.push(user);
          console.log(`✓ Created student: ${student.firstName} ${student.lastName}`);
        }
      } catch (error) {
        console.log(`Student ${student.firstName} ${student.lastName} might already exist`);
      }
    }

    // Note: Internship creation removed - only real company signups will create internships

    console.log("✅ Sample data seeding completed!");
    
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}