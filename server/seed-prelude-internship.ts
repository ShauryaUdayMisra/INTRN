import { db } from "./db";
import { internships, users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedPreludeInternship() {
  console.log("🌱 Seeding Prelude Novel Ventures internship...");

  try {
    // Check if Prelude company exists
    const [existingCompany] = await db
      .select()
      .from(users)
      .where(eq(users.companyName, "Prelude Novel Ventures Pvt Ltd"));

    let companyId: number;

    if (!existingCompany) {
      // Create Prelude company
      const [newCompany] = await db
        .insert(users)
        .values({
          username: "prelude.ventures",
          email: "sr@preludelie.om",
          password: "prelude123",
          adminPassword: "prelude123",
          role: "company",
          companyName: "Prelude Novel Ventures Pvt Ltd",
          website: "www.preludelive.com",
          location: "Bhubaneswar",
          companyField: "Event Management",
          bio: "Innovative event management company creating unique experiences and intellectual properties in the events industry.",
          isApproved: true,
          profileComplete: true
        })
        .returning();
      companyId = newCompany.id;
    } else {
      companyId = existingCompany.id;
    }

    // Check if internship already exists
    const [existingInternship] = await db
      .select()
      .from(internships)
      .where(eq(internships.title, "Research & Presentation Specialist"));

    if (existingInternship) {
      // Update existing internship
      await db
        .update(internships)
        .set({
          companyId,
          title: "Research & Presentation Specialist",
          description: "Join our dynamic team to research emerging event trends, compile comprehensive data insights, and create compelling presentations for innovative event intellectual properties. You'll dive deep into market research, analyze industry developments, and transform raw data into visually engaging presentations that drive our creative event concepts forward.",
          location: "Bhubaneswar",
          type: "hybrid",
          duration: "1-3 Months",
          skills: ["Research Skills", "Data Analysis", "PowerPoint", "Creative Presentation", "Internet Research", "Content Writing"],
          requirements: "Interest in diverse topics with strong browsing skills to collate data from various online sources. Proficiency in presentation software with creative flair for visual storytelling. Curiosity-driven mindset and attention to detail.",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          isActive: true
        })
        .where(eq(internships.id, existingInternship.id));

      console.log("✅ Prelude Novel Ventures internship updated successfully!");
    } else {
      // Create new internship
      await db
        .insert(internships)
        .values({
          companyId,
          title: "Research & Presentation Specialist",
          description: "Join our dynamic team to research emerging event trends, compile comprehensive data insights, and create compelling presentations for innovative event intellectual properties. You'll dive deep into market research, analyze industry developments, and transform raw data into visually engaging presentations that drive our creative event concepts forward.",
          location: "Bhubaneswar",
          type: "hybrid",
          duration: "1-3 Months",
          skills: ["Research Skills", "Data Analysis", "PowerPoint", "Creative Presentation", "Internet Research", "Content Writing"],
          requirements: "Interest in diverse topics with strong browsing skills to collate data from various online sources. Proficiency in presentation software with creative flair for visual storytelling. Curiosity-driven mindset and attention to detail.",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          isActive: true
        });

      console.log("✅ Prelude Novel Ventures internship created successfully!");
    }

  } catch (error) {
    console.error("❌ Error seeding Prelude internship:", error);
  }
}