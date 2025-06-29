import { storage } from "./storage";

export async function seedSampleData() {
  try {
    console.log("🌱 Seeding sample data...");

    // Create admin users (already exist from auth setup)
    const adminUsers = [
      { username: "admin1", email: "admin1@intrn.xyz", password: "$2a$10$8K1p5c1dUz8k0kYH5M9KYOGx7UJC3k8F5O1N1P1Q1R1S1T1U1V1W1X", role: "admin" as const },
      { username: "admin2", email: "admin2@intrn.xyz", password: "$2a$10$8K1p5c1dUz8k0kYH5M9KYOGx7UJC3k8F5O1N1P1Q1R1S1T1U1V1W1X", role: "admin" as const },
      { username: "admin3", email: "admin3@intrn.xyz", password: "$2a$10$8K1p5c1dUz8k0kYH5M9KYOGx7UJC3k8F5O1N1P1Q1R1S1T1U1V1W1X", role: "admin" as const }
    ];

    // Create sample companies
    const sampleCompanies = [
      {
        username: "tcs_recruiter",
        email: "careers@tcs.com",
        password: "$2a$10$8K1p5c1dUz8k0kYH5M9KYOGx7UJC3k8F5O1N1P1Q1R1S1T1U1V1W1X", // password: "company123"
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
        password: "$2a$10$8K1p5c1dUz8k0kYH5M9KYOGx7UJC3k8F5O1N1P1Q1R1S1T1U1V1W1X",
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
        password: "$2a$10$8K1p5c1dUz8k0kYH5M9KYOGx7UJC3k8F5O1N1P1Q1R1S1T1U1V1W1X",
        role: "company" as const,
        companyName: "Flipkart",
        firstName: "Amit",
        lastName: "Patel", 
        location: "Bangalore, India",
        bio: "India's leading e-commerce marketplace"
      }
    ];

    // Create sample students
    const sampleStudents = [
      {
        username: "rahul_dev",
        email: "rahul.sharma@student.com",
        password: "$2a$10$8K1p5c1dUz8k0kYH5M9KYOGx7UJC3k8F5O1N1P1Q1R1S1T1U1V1W1X", // password: "student123"
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
        password: "$2a$10$8K1p5c1dUz8k0kYH5M9KYOGx7UJC3k8F5O1N1P1Q1R1S1T1U1V1W1X",
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
        password: "$2a$10$8K1p5c1dUz8k0kYH5M9KYOGx7UJC3k8F5O1N1P1Q1R1S1T1U1V1W1X",
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

    // Get all companies for internship creation
    const allCompanies = await storage.getCompaniesList();
    
    if (allCompanies.length > 0) {
      // Create sample internships
      const sampleInternships = [
        {
          title: "Software Development Intern",
          description: "Join our development team to build scalable web applications using modern technologies. You'll work on real projects that impact millions of users.",
          requirements: "Strong programming skills in JavaScript/TypeScript, experience with React/Node.js, knowledge of databases",
          location: "Mumbai, India",
          type: "hybrid" as const,
          duration: "3 months",
          stipend: "₹25,000/month",
          skills: ["JavaScript", "React", "Node.js", "MongoDB"],
          companyId: allCompanies[0].id
        },
        {
          title: "Data Science Intern", 
          description: "Work with our data science team to analyze large datasets and build machine learning models. Gain hands-on experience with real-world data problems.",
          requirements: "Knowledge of Python, machine learning libraries (scikit-learn, pandas), statistics background",
          location: "Bangalore, India",
          type: "onsite" as const,
          duration: "6 months",
          stipend: "₹30,000/month", 
          skills: ["Python", "Machine Learning", "SQL", "Data Analysis"],
          companyId: allCompanies[1]?.id || allCompanies[0].id
        },
        {
          title: "Mobile App Development Intern",
          description: "Develop mobile applications for Android and iOS platforms. Work on consumer-facing apps used by millions of customers.",
          requirements: "Experience with Java/Kotlin for Android or Swift for iOS, understanding of mobile UI/UX principles",
          location: "Bangalore, India", 
          type: "remote" as const,
          duration: "4 months",
          stipend: "₹28,000/month",
          skills: ["Java", "Kotlin", "Android", "Mobile Development"],
          companyId: allCompanies[2]?.id || allCompanies[0].id
        },
        {
          title: "UI/UX Design Intern",
          description: "Create intuitive and beautiful user interfaces for web and mobile applications. Collaborate with product teams to improve user experience.",
          requirements: "Proficiency in design tools (Figma, Adobe XD), understanding of user-centered design principles",
          location: "Delhi, India",
          type: "hybrid" as const, 
          duration: "3 months",
          stipend: "₹22,000/month",
          skills: ["UI/UX Design", "Figma", "Adobe XD", "Prototyping"],
          companyId: allCompanies[0].id
        },
        {
          title: "Backend Development Intern",
          description: "Build robust APIs and microservices that power our platform. Learn about scalable architecture and cloud technologies.",
          requirements: "Knowledge of backend technologies (Node.js, Python, Java), understanding of databases and APIs",
          location: "Mumbai, India",
          type: "onsite" as const,
          duration: "6 months", 
          stipend: "₹35,000/month",
          skills: ["Node.js", "Python", "AWS", "Microservices"],
          companyId: allCompanies[1]?.id || allCompanies[0].id
        }
      ];

      for (const internship of sampleInternships) {
        try {
          await storage.createInternship(internship);
          console.log(`✓ Created internship: ${internship.title}`);
        } catch (error) {
          console.log(`Internship ${internship.title} might already exist`);
        }
      }
    }

    console.log("✅ Sample data seeding completed!");
    
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}