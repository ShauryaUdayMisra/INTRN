import { db } from "./db";
import { internships, users } from "@shared/schema";
import { eq } from "drizzle-orm";

// These two internships were created manually (no owning seed script), so they
// need an update-only pass to keep production in sync with the correct
// header-format description, "Online"/"Remote" location, and "3 weeks" duration.
export async function seedFixInternships() {
  console.log("🌱 Fixing manually-created internships (Wisdom Tree, INTRN)...");

  try {
    const fixes: { title: string; description: string; location: string; duration: string }[] = [
      {
        title: "Content Writing & Editorial Intern for a School Brand",
        location: "Online",
        duration: "3 weeks",
        description: `Wisdom Tree School
A progressive school building tomorrow's boldest thinkers
Company based in Bhubaneswar, Odisha

Join Wisdom Tree School's editorial team and gain hands-on experience in educational content creation. You'll write engaging articles for our school newsletter, blog, and social media platforms. This role involves researching educational topics, interviewing students and faculty, crafting compelling stories about school events and achievements, and editing content for clarity and impact. You'll work closely with our communications team to develop your writing skills while learning about educational journalism, digital content strategy, and audience engagement. This is an excellent opportunity for aspiring writers, journalists, or content creators to build a strong portfolio while contributing to a vibrant school community.`,
      },
      {
        title: "Operations & Marketing Intern for a Student Internship Startup",
        location: "Remote",
        duration: "3 weeks",
        description: `INTRN Platform
The internship platform built exclusively for ambitious high school students
Company based in India

Be part of the INTRN team and help shape the future of internship opportunities for high school students! As a Platform Operations & Marketing Intern, you'll get a behind-the-scenes look at how our platform works while contributing to its growth. Your responsibilities will include understanding and documenting platform features, assisting with user experience research, creating marketing content for social media and email campaigns, designing visual assets and graphics for promotional materials, analyzing user engagement data, and supporting customer outreach initiatives. You'll gain valuable experience in tech startup operations, digital marketing, UI/UX design principles, and data-driven decision making. This is a unique meta-internship where you'll learn about internships while helping other students discover opportunities!`,
      },
    ];

    for (const fix of fixes) {
      const existing = await db
        .select()
        .from(internships)
        .where(eq(internships.title, fix.title));

      if (existing.length > 0) {
        await db
          .update(internships)
          .set({
            description: fix.description,
            location: fix.location,
            duration: fix.duration,
          })
          .where(eq(internships.id, existing[0].id));
        console.log(`🔄 Fixed internship: ${fix.title}`);
      }
    }

    // The INTRN Platform company had a fake placeholder website
    // (internhub.com). Clear it so no false link is shown on its listing.
    await db
      .update(users)
      .set({ website: null })
      .where(eq(users.companyName, "INTRN Platform"));
    console.log("🔄 Cleared fake website for INTRN Platform");

    console.log("✅ Manually-created internships fixed!");
  } catch (error) {
    console.error("❌ Error fixing internships:", error);
    throw error;
  }
}
