import { db } from "./db";
import { blogPosts, users } from "@shared/schema";
import { eq } from "drizzle-orm";

const customBlogPosts = [
  {
    title: "Why Internships Matter More Than Ever in 2025",
    slug: "why-internships-matter-2025",
    content: `In a world that's evolving faster than ever, the traditional route of studying hard, getting good grades, and then landing a job is no longer enough. Employers are looking for something more — real-world experience, problem-solving ability, and initiative. That's where internships come in. In 2025, internships have become a critical part of a student's journey, not just a nice-to-have.

## The Academic Gap

While schools provide foundational knowledge, they often lag behind industry expectations. Whether it's AI, biotech, renewable energy, or entrepreneurship, the world outside the classroom moves quickly. Internships bridge this gap by immersing students in the reality of modern workplaces. You don't just learn — you do.

Take, for instance, a student interested in environmental science. They may study the theory in school, but a summer internship with a clean energy startup can teach them how the industry actually works — what real-world constraints exist, how teams collaborate, and how solutions are implemented under budget and time pressure. This kind of learning simply can't be taught in a textbook.

## Building Future-Proof Skills

Internships don't just develop hard skills — they sharpen essential soft skills too. From writing professional emails to managing time, communicating in teams, and adapting to different work cultures, these abilities define successful professionals today. The earlier students start building them, the more confident and capable they become in future academic or job settings.

Additionally, internships expose students to failure — and how to recover from it. Whether it's making a mistake in a data report or struggling with a group project, internships offer low-stakes opportunities to learn resilience, a skill that's vital in the real world.

## Gaining Clarity and Confidence

One of the biggest advantages of interning in high school or early college is clarity. So many students spend years unsure of what they want to do. Internships let you "try on" different careers. Maybe you thought you loved finance until you interned at a bank and realized you prefer creative problem-solving in a tech startup. Or maybe your internship at a lab made you fall in love with molecular biology. That clarity is priceless — and it can save years of wasted time.

Internships also build confidence. The first time you sit in on a meeting or present an idea to a mentor, it feels big. And it is. Each experience builds your ability to handle professional situations, so by the time you graduate, you're not entering the job market blind — you've already had a taste.

## A New Generation of Interns

At INTRN, we believe the earlier students are exposed to the working world, the better prepared they'll be. That's why we're building a platform where internships are not just accessible, but exciting. From research labs to startups to social impact organizations, we match students with real opportunities that matter.

We're not just listing internships. We're building a movement — one where students take charge of their futures, explore what they love, and learn by doing. In 2025 and beyond, those who start early will lead the way.

So whether you're a student, parent, or educator, remember this: an internship isn't just a line on a CV. It's a launchpad.`,
    excerpt: "In a rapidly evolving world, internships have become essential for bridging the gap between academic knowledge and real-world skills.",
    tags: ["career", "education", "future-skills"],
    category: "career-advice",
    published: true,
    featuredImage: null
  },
  {
    title: "How a High School Internship Can Change Your Life",
    slug: "high-school-internship-life-change",
    content: `High school often feels like a blur of exams, sports, and social drama. But what if it could also be a time to start building your future? Internships in high school aren't just about padding your resume — they can genuinely change your life. They open up new worlds, bring clarity about your passions, and connect you with mentors who inspire.

Imagine being 16 and working at a research lab, startup, or NGO. Suddenly, the concepts from your textbooks come to life. You're not just studying biology; you're extracting DNA. You're not just reading about business; you're helping market a real product.

One student who interned with a molecular biology team at JNU described it as a "turning point" in his life. It wasn't just the science that fascinated him — it was the energy, the teamwork, the sense of being part of something that mattered.

Internships also teach responsibility and independence. You learn how to send professional emails, show up on time, take initiative, and ask questions. These are life skills, not just career skills.

At INTRN, we want students to have these moments. Because the earlier you start exploring, the sooner you'll find what makes you come alive.`,
    excerpt: "High school internships open new worlds, bring clarity about passions, and teach essential life skills beyond the classroom.",
    tags: ["high-school", "personal-growth", "career-exploration"],
    category: "student-stories",
    published: true,
    featuredImage: null
  },
  {
    title: "The Problem with Internships in South Asia (and How We Fix It)",
    slug: "internships-south-asia-problem-solution",
    content: `In South Asia, internships are still seen as something for college students — and often only for those with the right connections. Opportunities are scattered, unlisted, or given out informally. This creates a major accessibility issue, especially for bright students who don't know where to start.

Many school students want to explore careers early, but the lack of structure, transparency, and mentorship holds them back. This problem is especially visible in India, where millions of high schoolers are eager to learn beyond textbooks but have no platform to help them.

That's where INTRN comes in.

INTRN aims to level the playing field by making internships easy to find, fair to access, and worthwhile to experience. Whether you're in Delhi or Dhanbad, you should have access to the same quality of opportunities. We partner with companies, labs, startups, and NGOs to offer short-term, guided internships that students can explore even during a school break.

Our goal is to shift the mindset in South Asia — from internships being an afterthought to being a critical part of education.`,
    excerpt: "Addressing the accessibility and transparency issues in South Asian internship opportunities through structured platforms.",
    tags: ["south-asia", "accessibility", "education-reform"],
    category: "industry-insights",
    published: true,
    featuredImage: null
  },
  {
    title: "How INTRN Helps Students Discover Their Passion",
    slug: "intrn-student-passion-discovery",
    content: `Many students finish school or even college unsure about what they want to do. Why? Because they never had a chance to explore. School teaches you what to learn, but rarely why you're learning it. That's where internships come in — especially with a platform like INTRN that's built for early discovery.

When students try real work — writing code, designing websites, observing surgeries, or organizing fundraisers — they begin to understand themselves better. What energizes them? What drains them? What do they want more of?

At INTRN, we encourage students to intern across different fields before narrowing down. Maybe you love storytelling but don't enjoy marketing. Maybe working in a social impact setting gives you more purpose than a corporate one. You'll never know unless you try.

We've designed INTRN to be about more than just work experience. It's about curiosity, discovery, and self-awareness — the foundations of any fulfilling career.`,
    excerpt: "Helping students discover their true passions through hands-on exploration across diverse fields and industries.",
    tags: ["self-discovery", "career-exploration", "student-guidance"],
    category: "career-advice",
    published: true,
    featuredImage: null
  },
  {
    title: "Internships vs. Shadowing: What's the Difference?",
    slug: "internships-vs-shadowing-difference",
    content: `A lot of students (and parents) confuse shadowing with internships. Both are valuable — but they serve different purposes.

Shadowing is more observational. You follow a professional around and see what their day looks like. It's great for short-term exposure, especially in fields like medicine or law. But it's passive.

Internships, on the other hand, are hands-on. You actually work on tasks, contribute to projects, and interact with a team. It's immersive — and you learn far more.

At INTRN, we focus on internships because we believe students learn best by doing. Even if you're just helping with social media posts, market research, or organizing files, you're learning real skills and building confidence.

But don't dismiss shadowing. It's a great place to start — and for some industries, it's the only option due to privacy or safety.

We recommend students try both. Think of shadowing as dipping your toes in — and internships as jumping into the pool.`,
    excerpt: "Understanding the key differences between shadowing and internships, and when each approach is most beneficial.",
    tags: ["shadowing", "internships", "comparison", "guidance"],
    category: "guides",
    published: true,
    featuredImage: null
  },
  {
    title: "Why Every Teen Should Try at Least One Startup Internship",
    slug: "teen-startup-internship-benefits",
    content: `Startups are intense. Fast-paced. Sometimes chaotic. But they're also incredible places to learn.

For students, interning at a startup means wearing multiple hats. You might be doing social media one day, sales outreach the next, and product brainstorming after that. There's no rigid hierarchy, and your ideas are actually heard.

This environment teaches you how to adapt, how to be resourceful, and how to take initiative. These are qualities that school rarely tests — but the real world demands them.

At INTRN, we've partnered with many early-stage startups that love having student interns. They're not looking for perfect resumes — they're looking for energy, curiosity, and fresh ideas.

And for the student? It's a crash course in entrepreneurship — one that could inspire you to start something of your own one day.`,
    excerpt: "The unique benefits of startup internships for teenagers, from adaptability to entrepreneurial thinking.",
    tags: ["startups", "entrepreneurship", "adaptability", "teens"],
    category: "career-advice",
    published: true,
    featuredImage: null
  },
  {
    title: "What Makes a Great Intern? (It's Not What You Think)",
    slug: "what-makes-great-intern",
    content: `Think you need to be the smartest person in the room to be a great intern? Think again.

Great interns aren't the ones with straight A's or perfect coding skills. They're the ones who are curious, reliable, and willing to learn. They ask questions. They show up on time. They take feedback well. And they take ownership of small tasks like they're big ones.

At INTRN, we remind students: no one expects you to know everything. You're here to learn. But how you show up — with humility, initiative, and respect — can leave a lasting impression.

The best interns understand that they're not just doing tasks. They're building trust. And often, that leads to future opportunities — letters of recommendation, referrals, or even full-time jobs later on.`,
    excerpt: "The real qualities that make exceptional interns - curiosity, reliability, and willingness to learn matter more than grades.",
    tags: ["intern-qualities", "professional-skills", "success-tips"],
    category: "guides",
    published: true,
    featuredImage: null
  },
  {
    title: "How Parents Can Support Their Child's Internship Journey",
    slug: "parents-support-internship-journey",
    content: `Parents play a big role in shaping a student's attitude toward internships. Instead of pushing only for grades or traditional careers, parents can help by encouraging exploration.

Support your child in finding internships through platforms like INTRN. Talk to them about what they learned — not just what they did. Celebrate small wins, like sending their first email or getting positive feedback from a mentor.

Also, understand that not all internships are glamorous. Some might involve boring tasks — but they still build discipline and grit.

By showing genuine interest and keeping an open mind, parents can help turn a short internship into a long-term lesson in responsibility, independence, and purpose.`,
    excerpt: "Practical ways parents can encourage and support their children's internship experiences and career exploration.",
    tags: ["parents", "support", "family", "encouragement"],
    category: "guides",
    published: true,
    featuredImage: null
  },
  {
    title: "INTRN Success Story: From Curiosity to Career Clarity",
    slug: "intrn-success-story-ananya",
    content: `Ananya, a 17-year-old from Pune, had no idea what she wanted to do after school. She was good at science but didn't feel passionate about it. Through INTRN, she landed a 2-week internship with a marketing team at a sustainability startup.

At first, she felt out of place. But by the end of her internship, she was designing posters, writing captions, and helping with outreach campaigns. More importantly, she loved it.

That experience changed her trajectory. She started exploring communications, branding, and even design. Today, she plans to pursue media and sustainability at university.

That's what INTRN is about — giving students experiences that unlock new paths.`,
    excerpt: "How a 2-week internship helped Ananya discover her passion for marketing and sustainability communications.",
    tags: ["success-story", "career-change", "student-story", "marketing"],
    category: "student-stories",
    published: true,
    featuredImage: null
  },
  {
    title: "The Future of Internships Is Here: What INTRN Is Building Next",
    slug: "future-internships-intrn-building",
    content: `INTRN isn't just a listings platform — it's a growing ecosystem. In the coming months, we're rolling out guided programs, mentor networks, and even certifications to help students track their growth.

Our mission is simple: to make internships accessible, exciting, and transformative for every student — whether they're in metro cities or rural towns.

We believe the future of education is experiential. Students need to do in order to understand. And internships are the bridge between learning and living.

So join us — whether you're a student, parent, teacher, or company. Because the future is being built by students who start early.`,
    excerpt: "Exploring INTRN's vision for the future of internships with guided programs, mentorship, and accessible opportunities.",
    tags: ["future", "vision", "education", "experiential-learning"],
    category: "company-updates",
    published: true,
    featuredImage: null
  }
];

export async function seedCustomBlogs() {
  console.log("🌱 Seeding custom blog posts...");
  
  try {
    // Get the first admin user to be the author
    const adminUser = await db.select().from(users).where(eq(users.role, "admin")).limit(1);
    
    if (adminUser.length === 0) {
      console.log("❌ No admin user found. Creating admin users first...");
      return;
    }

    const authorId = adminUser[0].id;

    // Check if any of these blog posts already exist
    for (const post of customBlogPosts) {
      const existingPost = await db.select().from(blogPosts).where(eq(blogPosts.slug, post.slug)).limit(1);
      
      if (existingPost.length === 0) {
        await db.insert(blogPosts).values({
          ...post,
          authorId,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`✅ Created blog post: ${post.title}`);
      } else {
        console.log(`⏭️ Blog post already exists: ${post.title}`);
      }
    }

    console.log("✅ Custom blog posts seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding custom blog posts:", error);
  }
}