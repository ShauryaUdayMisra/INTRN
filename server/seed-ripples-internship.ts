import { db } from "./db";
import { users, internships } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedRipplesInternship() {
  console.log("🌱 Seeding Ripples of Hope internship...");

  try {
    // First check if we already have a Ripples of Hope internship
    const existingInternship = await db
      .select()
      .from(internships)
      .where(eq(internships.title, "Research Intern - Social Impact of Sports"));

    if (existingInternship.length > 0) {
      // Update existing internship with correct data
      await db
        .update(internships)
        .set({
          duration: "7-28 days",
          location: "UP, Bihar, Uttarakhand, MP (also available online)",
        })
        .where(eq(internships.title, "Research Intern - Social Impact of Sports"));
      
      // Also update the company website
      await db
        .update(users)
        .set({
          website: "https://ripplesofhope.in/",
        })
        .where(eq(users.companyName, "Ripples of Hope"));
      
      console.log("✅ Ripples of Hope internship updated successfully!");
      return;
    }

    // Create or find admin user to be the company for this internship
    let adminUser = await db
      .select()
      .from(users)
      .where(eq(users.email, "admin1@gmail.com"));

    if (adminUser.length === 0) {
      // Create admin user if doesn't exist
      const [newAdmin] = await db
        .insert(users)
        .values({
          username: "ripplesofhope",
          email: "admin1@gmail.com",
          password: "$2a$10$dummy.hash.for.admin",
          adminPassword: "admin",
          firstName: "Ripples",
          lastName: "of Hope",
          role: "company",
          companyName: "Ripples of Hope",
          companyField: "Social Impact",
          location: "UP, Bihar, Uttarakhand, MP",
          website: "https://ripplesofhope.in/",
          isApproved: true,
          profileComplete: true,
        })
        .returning();
      adminUser = [newAdmin];
    }

    // Create the Ripples of Hope internship
    await db.insert(internships).values({
      companyId: adminUser[0].id,
      title: "Research Intern - Social Impact of Sports",
      description: "To understand the impact of sports on marriage choices of adolescent girls in underprivileged and marginalised communities in rural North India. While it can be done online, it would be better if the person can also travel for 6-7 days to our locations in the states mentioned. You'll work directly with field researchers and analyze socio-cultural data to understand how sports participation influences life choices in these communities.",
      requirements: "Excel proficiency required. More importantly, understanding of the socio-cultural fabric of the poor in rural India. Research experience preferred but not required. Willingness to travel to rural locations is a plus.",
      location: "UP, Bihar, Uttarakhand, MP (also available online)",
      type: "hybrid",
      duration: "7-28 days",
      skills: ["Excel", "Research", "Cultural Understanding", "Data Analysis", "Field Work"],
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      endDate: new Date(Date.now() + 135 * 24 * 60 * 60 * 1000), // 135 days from now (3 months)
      isActive: true,
    });

    console.log("✅ Ripples of Hope internship created successfully!");

  } catch (error) {
    console.error("❌ Error seeding Ripples of Hope internship:", error);
    throw error;
  }
}