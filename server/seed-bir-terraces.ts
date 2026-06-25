import { db } from "./db";
import { users, internships } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedBirTerracesInternship() {
  console.log("🌱 Seeding Bir Terraces internship...");

  try {
    const existingInternship = await db
      .select()
      .from(internships)
      .where(eq(internships.title, "Social Media & Content Intern for a Luxury Mountain Homestay"));

    const existingCompany = await db
      .select()
      .from(users)
      .where(eq(users.companyName, "Bir Terraces"));

    if (existingInternship.length > 0 && existingCompany.length > 0) {
      await db
        .update(internships)
        .set({
          title: "Social Media & Content Intern for a Luxury Mountain Homestay",
          duration: "3 weeks",
          location: "Online",
          type: "online",
          description: "Bir Terraces\nA luxury mountain homestay nestled in the Himalayas\nCompany based in Nainital, Uttarakhand\n\nLooking for a social media intern who can navigate the trends and create reels/posts based on our legacy media base. You will help manage our Instagram presence and create engaging content for our mountain retreat property.\n\nYou'll get hands-on experience running social media for a real hospitality brand — turning a beautiful mountain property into scroll-stopping content. If you love travel, aesthetics, and storytelling through reels, this one's for you.\n\nFully online. Great for anyone interested in social media, content creation, and hospitality marketing.",
          requirements: "Preferably versed with Instagram Ads and ChatGPT. If not, we would love to train you. Creative mindset and understanding of social media trends required.",
          skills: ["Social Media", "Instagram", "Content Creation", "Reels", "ChatGPT", "Instagram Ads"],
        })
        .where(eq(internships.title, "Social Media & Content Intern for a Luxury Mountain Homestay"));
      
      await db
        .update(users)
        .set({
          website: "https://www.birterraces.com",
          location: "Nainital, Uttarakhand",
        })
        .where(eq(users.companyName, "Bir Terraces"));
      
      console.log("✅ Bir Terraces internship updated successfully!");
      return;
    }

    let companyUser = existingCompany;

    if (companyUser.length === 0) {
      const [newCompany] = await db
        .insert(users)
        .values({
          username: "birterraces",
          email: "dushyant2796@gmail.com",
          password: "$2a$10$dummy.hash.for.company",
          adminPassword: "birterraces2024",
          firstName: "Dushyant",
          lastName: "Vashisht",
          role: "company",
          companyName: "Bir Terraces",
          companyField: "Hospitality",
          location: "Nainital, Uttarakhand",
          website: "https://www.birterraces.com",
          isApproved: true,
          profileComplete: true,
        })
        .returning();
      companyUser = [newCompany];
    }

    await db.insert(internships).values({
      companyId: companyUser[0].id,
      title: "Social Media & Content Intern for a Luxury Mountain Homestay",
      description: "Bir Terraces\nA luxury mountain homestay nestled in the Himalayas\nCompany based in Nainital, Uttarakhand\n\nLooking for a social media intern who can navigate the trends and create reels/posts based on our legacy media base. You will help manage our Instagram presence and create engaging content for our mountain retreat property.\n\nYou'll get hands-on experience running social media for a real hospitality brand — turning a beautiful mountain property into scroll-stopping content. If you love travel, aesthetics, and storytelling through reels, this one's for you.\n\nFully online. Great for anyone interested in social media, content creation, and hospitality marketing.",
      requirements: "Preferably versed with Instagram Ads and ChatGPT. If not, we would love to train you. Creative mindset and understanding of social media trends required. Passion for travel and hospitality is a plus.",
      location: "Online",
      type: "online",
      duration: "3 weeks",
      skills: ["Social Media", "Instagram", "Content Creation", "Reels", "ChatGPT", "Instagram Ads"],
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    console.log("✅ Bir Terraces internship created successfully!");

  } catch (error) {
    console.error("❌ Error seeding Bir Terraces internship:", error);
    throw error;
  }
}
