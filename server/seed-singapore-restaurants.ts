import { db } from "./db";
import { users, internships } from "@shared/schema";
import { eq } from "drizzle-orm";
import { execSync } from "child_process";

// Neon serverless with poolQueryViaFetch=true silently fails on plain INSERT
// (throws a JS error even though the row is written). We bypass Drizzle for
// inserts and use psql directly, which works reliably.
function psqlExec(sql: string) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL not set");
  execSync(`psql "${dbUrl}" -c ${JSON.stringify(sql)}`, { stdio: "pipe" });
}

export async function seedSingaporeRestaurants() {
  console.log("🌱 Seeding Singapore restaurant internships...");

  try {
    async function ensureCompany(params: {
      username: string;
      email: string;
      adminPassword: string;
      firstName: string;
      lastName: string;
      companyName: string;
      companyField: string;
      location: string;
      website: string;
    }): Promise<number> {
      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, params.username));
      if (existing.length > 0) return existing[0].id;

      const escaped = (s: string) => s.replace(/'/g, "''");
      psqlExec(
        `INSERT INTO users (username, email, password, admin_password, first_name, last_name, role, company_name, company_field, location, website, is_approved, profile_complete)
         VALUES ('${escaped(params.username)}', '${escaped(params.email)}', '$2a$10$dummy.hash.for.company', '${escaped(params.adminPassword)}', '${escaped(params.firstName)}', '${escaped(params.lastName)}', 'company', '${escaped(params.companyName)}', '${escaped(params.companyField)}', '${escaped(params.location)}', '${escaped(params.website)}', true, true)
         ON CONFLICT (username) DO NOTHING;`
      );

      const [created] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, params.username));
      console.log(`✅ Company created: ${params.companyName}`);
      return created.id;
    }

    async function upsertInternship(values: {
      companyId: number;
      title: string;
      description: string;
      requirements: string;
      location: string;
      type: string;
      duration: string;
      skills: string[];
      isActive: boolean;
    }) {
      const existing = await db
        .select({ id: internships.id })
        .from(internships)
        .where(eq(internships.title, values.title));

      if (existing.length === 0) {
        const escaped = (s: string) => s.replace(/'/g, "''");
        const skillsArr =
          "ARRAY[" + values.skills.map((s) => `'${escaped(s)}'`).join(",") + "]";
        psqlExec(
          `INSERT INTO internships (company_id, title, description, requirements, location, type, duration, skills, is_active)
           VALUES (${values.companyId}, '${escaped(values.title)}', '${escaped(values.description)}', '${escaped(values.requirements)}', '${escaped(values.location)}', '${escaped(values.type)}', '${escaped(values.duration)}', ${skillsArr}, ${values.isActive})
           ON CONFLICT DO NOTHING;`
        );
        console.log(`✅ Created internship: ${values.title}`);
      } else {
        await db
          .update(internships)
          .set({
            description: values.description,
            requirements: values.requirements,
            skills: values.skills,
            location: values.location,
            duration: values.duration,
          })
          .where(eq(internships.id, existing[0].id));
        console.log(`🔄 Updated internship: ${values.title}`);
      }
    }

    // ─── L'ANGELUS ────────────────────────────────────────────────────────────
    const langelusId = await ensureCompany({
      username: "langelus",
      email: "contact@langelus.sg",
      adminPassword: "langelus2024",
      firstName: "L",
      lastName: "Angelus",
      companyName: "L'Angélus",
      companyField: "Food & Beverage",
      location: "Singapore",
      website: "https://www.langelus.sg",
    });

    await upsertInternship({
      companyId: langelusId,
      title: "Marketing & Social Strategy Intern for Singapore's Oldest French Restaurant",
      description: `L'Angélus
A French institution on Club Street since 1998
Company based in Singapore

L'Angélus has been serving proper French food on Club Street since 1998, which makes it the oldest single-location French restaurant in Singapore. Escargot in clay pots, duck confit, crêpes suzette flambéed at your table. It is a genuine Singapore institution with a real story to tell, and that story deserves a much bigger audience.

You will dig into how L'Angélus stacks up against every other French restaurant in Singapore. You will map the competition, work out where they win on price and rating, and audit how they show up on Google and Google Maps when someone searches "French restaurant Singapore". Then you will study exactly what is working on Instagram and TikTok for their rivals and turn it into a social media plan they can actually run.

By the end you will have built a full growth and social strategy for a real Singapore landmark, the kind of named, concrete project that stands out on any application. Fully online, three weeks. Perfect if you love food, brands, and working out what makes people choose one place over another.`,
      requirements:
        "No experience needed, we will guide you the whole way. What matters is curiosity about brands and social media, comfort using Google and a simple spreadsheet, and a good eye for what makes content work. Bonus if you already mess around with Instagram, TikTok or Canva.",
      location: "Online",
      type: "online",
      duration: "3 weeks",
      skills: ["Market Research", "Social Media", "SEO", "Competitor Analysis", "Content Strategy", "Canva"],
      isActive: true,
    });

    // ─── LES BOUCHONS ─────────────────────────────────────────────────────────
    const lesbouchonsId = await ensureCompany({
      username: "lesbouchons",
      email: "contact@lesbouchons.sg",
      adminPassword: "lesbouchons2024",
      firstName: "Les",
      lastName: "Bouchons",
      companyName: "Les Bouchons",
      companyField: "Food & Beverage",
      location: "Singapore and Malaysia",
      website: "https://www.lesbouchons.sg",
    });

    await upsertInternship({
      companyId: lesbouchonsId,
      title: "Growth Strategy Intern for a French Steakhouse across Singapore & Malaysia",
      description: `Les Bouchons
The "King of Steak Frites", five outlets across Singapore, Johor Bahru and Kuala Lumpur
Company based in Singapore, with outlets across Malaysia

Les Bouchons is the self-proclaimed King of Steak Frites, and it has earned the title. Since 2002 it has grown from one shophouse on Ann Siang Road in Singapore into five outlets across Singapore, Johor Bahru and Kuala Lumpur, all built on perfectly grilled steak, free-flow homemade fries and hand-picked French wine.

This one is a proper challenge because you will work across two countries. You will map the steakhouse competition in Singapore and in Malaysia separately, work out where Les Bouchons sits on price and rating, and audit all five outlets' Google Maps listings so they show up when someone searches "best steak near me" in any of their cities. You will break down what is winning on socials for the biggest steakhouses and build them one content formula they can run everywhere.

You will finish with a real multi-market growth strategy for a restaurant group, exactly the kind of work most people do not get to touch until university. Fully online, three weeks. Ideal if you are into business, marketing, and food.`,
      requirements:
        "No experience needed, we will train you. You just need to be curious, organised, and happy to poke around Google Maps, spreadsheets and Instagram. Bonus if you enjoy social media or have used Canva before.",
      location: "Online",
      type: "online",
      duration: "3 weeks",
      skills: ["Market Research", "Local SEO", "Social Media", "Competitor Analysis", "Content Strategy", "Google Maps"],
      isActive: true,
    });

    // ─── TAPAS,24 ─────────────────────────────────────────────────────────────
    const tapas24Id = await ensureCompany({
      username: "tapas24sg",
      email: "contact@tapas24.sg",
      adminPassword: "tapas242024",
      firstName: "Tapas",
      lastName: "24",
      companyName: "Tapas,24",
      companyField: "Food & Beverage",
      location: "Singapore",
      website: "https://www.tapas24.sg",
    });

    await upsertInternship({
      companyId: tapas24Id,
      title: "Digital Marketing Intern for a Michelin Chef's Spanish Tapas Bar in Singapore",
      description: `Tapas,24
The first Asian outpost of Carles Abellán's legendary Barcelona tapas bar
Company based in Singapore

Tapas,24 is the first Asian outpost of Carles Abellán's legendary Barcelona tapas bar, dropped right on the Singapore River at Robertson Quay. Think sangria, Spanish street cocktails, a roaring Josper grill and a Michelin-starred pedigree, all in one of the most Instagrammable spots in Singapore.

You will work out how Tapas,24 competes with every other Spanish and tapas spot in Singapore, where it sits on price and rating, and how findable it is on Google and Google Maps for searches like "tapas Singapore" and "best paella Singapore". Then comes the fun part. You will study what is working on Instagram and TikTok for the buzziest restaurants in the city and build a social plan that turns the sangria, the grill and the riverside terrace into scroll-stopping content.

This is the dream brief if you love social media and food, because the raw material here is gold and mostly untapped. You will finish with a complete digital and social strategy for a Michelin-chef restaurant in Singapore. Fully online, three weeks.`,
      requirements:
        "No experience needed, we will show you how. Bring a love of social media, a creative eye, and a willingness to research properly. Bonus if you already make content on Instagram or TikTok, or know your way around Canva.",
      location: "Online",
      type: "online",
      duration: "3 weeks",
      skills: ["Social Media", "Content Creation", "Market Research", "SEO", "Instagram", "TikTok"],
      isActive: true,
    });

    console.log("✅ Singapore restaurant internships seeded!");
  } catch (error) {
    console.error("❌ Error seeding Singapore restaurants:", error);
    throw error;
  }
}
