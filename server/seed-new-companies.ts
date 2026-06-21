import { db } from "./db";
import { users, internships } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedNewCompanyInternships() {
  console.log("🌱 Seeding Kebabsmith & Chandrani Pearls internships...");

  try {
    // ─── THE KEBABSMITH ───────────────────────────────────────────────────────
    let kebabCompany = await db.select().from(users).where(eq(users.username, "thekebabsmith"));

    if (kebabCompany.length === 0) {
      const [c] = await db.insert(users).values({
        username: "thekebabsmith",
        email: "hello@thekebabsmith.com",
        password: "$2a$10$dummy.hash.for.company",
        adminPassword: "kebabsmith2024",
        firstName: "The",
        lastName: "Kebabsmith",
        role: "company",
        companyName: "The Kebabsmith",
        companyField: "Food & Beverage",
        location: "Singapore",
        website: "https://thekebabsmith.com",
        isApproved: true,
        profileComplete: true,
      }).returning();
      kebabCompany = [c];
      console.log("✅ The Kebabsmith company created");
    }

    const kebabId = kebabCompany[0].id;

    // Project A: Kids' Snack Trend Research
    const existingA = await db.select().from(internships)
      .where(eq(internships.title, "Kids' Snack Market Research Intern"));

    if (existingA.length === 0) {
      await db.insert(internships).values({
        companyId: kebabId,
        title: "Kids' Snack Market Research Intern",
        description: `Ever walked down a supermarket aisle and wondered why some products fly off the shelves while others collect dust? Now you can find out — and get real experience doing it.

The Kebabsmith is a Singapore-based frozen kebab and wraps brand built around healthy ingredients and family-friendly meals. We're on a mission to make wholesome food fun — and we need a sharp, curious researcher to help us understand what parents and kids actually want.

As our Market Research Intern, you'll dig into 20 competing snack products, build a comparison spreadsheet tracking pricing, protein content, packaging, and marketing messages, and surface the top 10 trends shaping the category. Your findings will feed directly into our product strategy — this isn't busy work, it's real insight that shapes what we build next.

You'll deliver a polished Google Sheet, a 5-slide presentation, and a one-page recommendation summary. By the end, you'll have done the kind of work junior analysts at consumer brands get paid to do — and you'll have a tangible portfolio piece to prove it.

Time commitment: 8–10 hours. Fully online. Perfect for anyone who's curious about business, food, or how brands compete.`,
        requirements: `No prior experience needed — just curiosity and attention to detail. You should be comfortable using Google Sheets (or Excel), able to browse Singapore supermarket websites/apps for research, and enjoy analyzing patterns. A genuine interest in food, health, or consumer brands is a big plus. You'll also need to be comfortable writing a short, clear recommendation in English.`,
        location: "Singapore (Online)",
        type: "online",
        duration: "8–10 hours",
        skills: ["Market Research", "Google Sheets", "Data Analysis", "Consumer Insight", "Presentation Design"],
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true,
      });
      console.log("✅ Kebabsmith Project A internship created");
    }

    // Project B: Social Media Content Bank
    const existingB = await db.select().from(internships)
      .where(eq(internships.title, "Social Media Content Creator Intern"));

    if (existingB.length === 0) {
      await db.insert(internships).values({
        companyId: kebabId,
        title: "Social Media Content Creator Intern",
        description: `If you spend more time analyzing why a Reel went viral than actually watching it — this internship was made for you.

The Kebabsmith is a Singapore-based frozen kebab brand and we need a creative brain to help us build a full month of social media content from scratch. You'll develop 15 Instagram post ideas, 10 Reels concepts, and 10 customer poll questions that actually get people talking. Then you'll design 5 Canva templates and write the captions to go with them.

The deliverables are real and ready to publish: a Canva folder, a content calendar, and a caption document. You'll own the creative direction — no micromanaging. If you have opinions about fonts, filters, and what makes food look good on a feed, we want to hear them.

This is the kind of project that makes your portfolio actually stand out — not "I helped post content" but "I built a complete social strategy for a food brand." 

Time commitment: 10–12 hours. Fully online. Ideal for anyone who lives on Instagram, loves Canva, or wants to break into digital marketing.`,
        requirements: `You should know your way around Canva (or be willing to learn fast — it's free and intuitive). A good eye for what looks great on Instagram is essential. Writing clean, punchy captions in English is a must. No formal marketing experience needed — strong opinions about content and trends are more valuable than a degree here.`,
        location: "Singapore (Online)",
        type: "online",
        duration: "10–12 hours",
        skills: ["Canva", "Content Marketing", "Copywriting", "Instagram", "Social Media Strategy"],
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true,
      });
      console.log("✅ Kebabsmith Project B internship created");
    }

    // ─── CHANDRANI PEARLS ─────────────────────────────────────────────────────
    let chandrani = await db.select().from(users).where(eq(users.username, "chandranipearls"));

    if (chandrani.length === 0) {
      const [c] = await db.insert(users).values({
        username: "chandranipearls",
        email: "contact@chandranipearls.com",
        password: "$2a$10$dummy.hash.for.company",
        adminPassword: "chandrani2024",
        firstName: "Chandrani",
        lastName: "Pearls",
        role: "company",
        companyName: "Chandrani Pearls",
        companyField: "Luxury Jewellery",
        location: "Kolkata, India",
        website: "https://chandranipearls.com",
        isApproved: true,
        profileComplete: true,
      }).returning();
      chandrani = [c];
      console.log("✅ Chandrani Pearls company created");
    }

    const chandId = chandrani[0].id;

    // Project C: Pearl Education Content Series
    const existingC = await db.select().from(internships)
      .where(eq(internships.title, "Pearl Education Content Design Intern"));

    if (existingC.length === 0) {
      await db.insert(internships).values({
        companyId: chandId,
        title: "Pearl Education Content Design Intern",
        description: `Did you know there are over a dozen types of pearls — and most people can't tell the difference? That's exactly the problem you'd help solve.

Chandrani Pearls is one of India's most iconic jewellery brands, founded in Kolkata in 1985 with dozens of stores across the country. They've been dressing women in pearls for four decades — and now they want to connect with a younger audience who barely knows where pearls come from.

As the Pearl Education Content Design Intern, you'll create a visual content series designed to make pearls feel relevant, cool, and approachable to people your age. You'll design two infographics ("What is a Pearl?" and "Types of Pearls"), a styling guide, a "Pearls for Teens" mood board, and 10 Instagram carousel concepts — all in Canva, all yours to design.

The deliverables go into Chandrani's real content library. Your work will reach an audience of thousands. If you have a good eye, enjoy visual storytelling, and want experience working with a heritage luxury brand, this one's for you.

Time commitment: 8–12 hours. Fully online. Great for anyone interested in design, fashion, or brand communication.`,
        requirements: `Comfort with Canva is essential (you'll be designing throughout). A strong visual sense and the ability to make complex ideas look simple and beautiful matters more than any specific qualification. Interest in fashion, jewellery, or luxury brands is a bonus. You should be able to write short social media captions in English that feel natural and engaging.`,
        location: "Kolkata, India (Online)",
        type: "online",
        duration: "8–12 hours",
        skills: ["Canva", "Visual Communication", "Infographic Design", "Social Media Content", "Brand Storytelling"],
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true,
      });
      console.log("✅ Chandrani Project C internship created");
    }

    // Project D: Gen Z Jewellery Trend Report
    const existingD = await db.select().from(internships)
      .where(eq(internships.title, "Gen Z Jewellery Trend Research Intern"));

    if (existingD.length === 0) {
      await db.insert(internships).values({
        companyId: chandId,
        title: "Gen Z Jewellery Trend Research Intern",
        description: `You already know what's trending before it trends. Now imagine getting paid (well, in experience) to prove it.

Chandrani Pearls — a legacy jewellery brand with 40 years of history — wants to understand what your generation actually wants from jewellery. Not what focus groups say. Not what agencies guess. What you and your peers are actually pinning, liking, and buying.

As the Gen Z Trend Research Intern, you'll analyze 50 jewellery posts across Instagram and Pinterest, identifying patterns in colour, style, influencer behaviour, and price positioning. Then you'll build a 10-slide trend report, a visual mood board, and a "Top 15 Insights" document that gives the brand a real window into what younger shoppers want.

This is forecasting work — the kind of thing trend agencies charge thousands of dollars for. You'll be doing it as a high schooler, with your name on the output and a real brief from a real brand.

Time commitment: 10–15 hours. Fully online. Ideal for anyone into fashion, trends, social media analytics, or brand strategy.`,
        requirements: `You should be active on Instagram and/or Pinterest and have a genuine sense of what looks good and what's gaining traction. Strong observation skills and the ability to articulate *why* something is trending (not just that it is) is key. Comfort putting together a polished presentation (Google Slides or Canva) is required. No prior experience in research or fashion is needed — taste and curiosity are enough.`,
        location: "Kolkata, India (Online)",
        type: "online",
        duration: "10–15 hours",
        skills: ["Trend Forecasting", "Instagram Research", "Pinterest", "Presentation Design", "Consumer Insights"],
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        isActive: true,
      });
      console.log("✅ Chandrani Project D internship created");
    }

    console.log("✅ All new company internships seeded!");

  } catch (error) {
    console.error("❌ Error seeding new company internships:", error);
    throw error;
  }
}
