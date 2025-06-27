import { db } from "./db";
import { blogPosts, users } from "@shared/schema";
import { eq } from "drizzle-orm";

const blogData = [
  {
    title: "How to Make the Most of Your High School Internship",
    content: `Starting an internship as a high school student can feel overwhelming, but it's one of the most valuable experiences you can have. Here's how to maximize your internship experience:

**Before You Start:**
- Research the company thoroughly
- Set clear goals for what you want to learn
- Prepare thoughtful questions about the industry and role
- Understand the company culture and dress code

**During Your Internship:**
- Ask questions and take detailed notes
- Be willing to take on any assigned task, no matter how small
- Build relationships with people at all levels
- Seek feedback regularly from your supervisor
- Maintain professionalism while being yourself

**Key Skills to Focus On:**
- Professional communication
- Time management and organization
- Teamwork and collaboration
- Problem-solving and critical thinking
- Adaptability and learning agility

Remember, internships aren't always about money - they're about gaining work experience, developing team work and communication skills that will help you in earning at some point in your life. People don't just get rich overnight. There is a set of specific skills one needs to learn and master in order to earn.`,
    excerpt: "Learn how to maximize your high school internship experience with practical tips for before, during, and after your internship.",
    slug: "how-to-make-most-of-high-school-internship",
    category: "Career Tips",
    tags: ["internships", "high school", "career development", "professional skills"],
    published: true,
    publishedAt: new Date("2024-12-01")
  },
  {
    title: "Will Internships Distract from My Studies? Managing Balance",
    content: `One of the most common concerns high school students have about internships is whether they'll interfere with their academic performance. Here's the truth about balancing internships with studies:

**The Reality:**
INTRN is designed to enhance students' academic experience, not detract from it. The internships offered through INTRN are part-time and flexible, allowing students to balance their studies with their work.

**Benefits to Academic Performance:**
- Real-world application of classroom concepts
- Enhanced time management skills
- Improved communication and presentation abilities
- Greater motivation and focus in studies
- Better understanding of career goals

**Tips for Maintaining Balance:**
1. **Prioritize Your Education**: Always put your studies first
2. **Choose Flexible Opportunities**: Look for part-time internships that work with your schedule
3. **Communicate Clearly**: Be upfront about your availability and academic commitments
4. **Use Time Management Tools**: Apps and planners can help you stay organized
5. **Ask for Support**: Don't hesitate to communicate with teachers and supervisors

**What Makes INTRN Different:**
The skills and experience gained through internships can actually benefit students in their academic pursuits. INTRN encourages students to prioritize their education and offers internships as a supplement to their learning.

Remember, the goal is to enhance your educational experience, not replace it. With proper planning and communication, you can successfully manage both your studies and internship responsibilities.`,
    excerpt: "Discover how to balance high school internships with your studies and why they can actually enhance your academic performance.",
    slug: "balancing-internships-with-studies",
    category: "Student Success",
    tags: ["balance", "time management", "studies", "academic performance"],
    published: true,
    publishedAt: new Date("2024-11-15")
  },
  {
    title: "How INTRN Works: A Complete Guide for Students",
    content: `Understanding how INTRN works can help you make the most of the platform and find the perfect internship opportunity. Here's your complete guide:

**Step 1: Choose Your Interests**
Students can select which areas they want to work in and how long they want to work. Whether you're interested in technology, marketing, finance, or creative fields, INTRN has opportunities across various industries.

**Step 2: Get Connected**
INTRN will then connect you to companies that offer internships in your areas of interest. Our platform matches you based on your skills, interests, and availability.

**Step 3: Company Selection Process**
After you express interest in a company, they will check your ratings and profile to determine whether to enroll you in their internship program. This ensures a good fit for both parties.

**Step 4: Complete Your Internship**
Work with your assigned company, gain valuable experience, and develop professional skills. Remember to maintain professionalism and make the most of every learning opportunity.

**Step 5: Certification and Rating**
After the internship is over, you'll receive a certificate of completion. Both you and the company will rate each other based on your experience, helping future students and companies make informed decisions.

**Why the Rating System Matters:**
- Helps companies identify reliable and dedicated students
- Allows students to choose reputable companies
- Creates accountability for both parties
- Builds trust within the INTRN community

**What to Expect:**
- Part-time, flexible schedules
- Professional mentorship and guidance
- Real-world work experience
- Networking opportunities
- Certificate of completion

The INTRN platform is designed to be simple, safe, and effective for high school students looking to gain valuable work experience.`,
    excerpt: "Learn how the INTRN platform works, from selecting your interests to completing your internship and earning certification.",
    slug: "how-intrn-works-complete-guide",
    category: "Platform Guide",
    tags: ["INTRN", "platform", "how it works", "student guide"],
    published: true,
    publishedAt: new Date("2024-10-30")
  },
  {
    title: "Company Safety and Professionalism: What INTRN Does to Protect Students",
    content: `Student safety is our top priority at INTRN. We understand that parents and students need assurance that internship opportunities are legitimate and professional. Here's how we ensure a safe experience:

**Company Vetting Process:**
Companies will be interviewed by us and their background and reviews will be checked to ensure professionalism and prevent overworking of students. Our thorough vetting process includes:

- Background checks on company leadership
- Verification of business registration and legitimacy
- Review of past intern experiences and feedback
- Assessment of company culture and work environment
- Evaluation of mentorship and training programs

**Review and Rating System:**
Our website includes a comprehensive review section for students to share their experiences and provide feedback about the companies they interned with. This transparency helps:

- Future students make informed decisions
- Companies maintain high standards
- The INTRN community build trust
- Identify and address any issues quickly

**Professional Standards:**
We require all partner companies to maintain professional standards including:

- Appropriate work assignments for high school students
- Reasonable working hours that don't interfere with studies
- Proper supervision and mentorship
- Safe and respectful work environments
- Clear communication about expectations and responsibilities

**Student Support:**
Throughout your internship, INTRN provides:

- Regular check-ins with students
- Clear channels for reporting concerns
- Support for resolving any issues
- Guidance on professional behavior and expectations

**Red Flags to Watch For:**
While our vetting process is thorough, students should also be aware of warning signs:

- Requests for payment or personal financial information
- Inappropriate or unclear job descriptions
- Lack of proper supervision
- Unreasonable working hours or conditions
- Any behavior that makes you uncomfortable

**What Parents Should Know:**
We encourage parents to be involved in their student's internship journey. We provide regular updates and maintain open communication channels to ensure everyone feels confident about the experience.

Remember, if you ever feel uncomfortable or unsafe during an internship, reach out to INTRN immediately. Your safety and well-being are our primary concerns.`,
    excerpt: "Learn about INTRN's comprehensive safety measures, company vetting process, and how we protect students during internships.",
    slug: "company-safety-professionalism-student-protection",
    category: "Safety & Security",
    tags: ["safety", "company vetting", "student protection", "professionalism"],
    published: true,
    publishedAt: new Date("2024-11-01")
  },
  {
    title: "Building Your Professional Network as a High School Student",
    content: `One of the most valuable aspects of an internship isn't just the work experience – it's the professional network you build. Here's how high school students can effectively network during their internships:

**Why Networking Matters Early:**
Starting your professional network in high school gives you a significant advantage. The relationships you build now can provide mentorship, references, and future opportunities throughout your career.

**Networking Strategies for Interns:**

**1. Be Genuinely Interested in Others**
- Ask thoughtful questions about people's roles and career paths
- Listen actively to their advice and experiences
- Show appreciation for their time and guidance

**2. Maintain Professional Relationships**
- Connect on LinkedIn (create a professional profile first)
- Send thank-you emails after meaningful conversations
- Keep in touch periodically with updates on your progress

**3. Be Helpful When Possible**
- Volunteer for additional projects
- Offer to help with tasks within your capabilities
- Share relevant articles or resources you come across

**4. Attend Company Events**
- Join team lunches or social events when invited
- Participate in company meetings when appropriate
- Attend any networking events or workshops

**Building Your Online Presence:**

**LinkedIn for High School Students:**
- Create a professional email address
- Write a clear, concise summary of your goals and interests
- Include your internship experience and achievements
- Connect with colleagues and mentors from your internship

**Professional Email Communication:**
- Use clear, respectful subject lines
- Keep messages concise and purposeful
- Always proofread before sending
- Respond promptly to communications

**Long-term Network Maintenance:**
- Send periodic updates about your academic and career progress
- Share relevant achievements or milestones
- Ask for advice when making important decisions
- Offer congratulations on their professional achievements

**Leveraging Your INTRN Experience:**
The INTRN platform creates natural networking opportunities:
- Connect with other interns in your cohort
- Build relationships with company supervisors and mentors
- Use the rating system to build your professional reputation
- Participate in INTRN community events and workshops

**Remember:**
Networking isn't about using people – it's about building genuine, mutually beneficial relationships. Focus on how you can add value to others' lives and careers, and the benefits will naturally follow.

The professional relationships you build during your high school internships can become some of the most valuable connections in your career. Start building your network early, and you'll be amazed at how it grows and benefits you throughout your life.`,
    excerpt: "Discover how to build valuable professional relationships during your high school internship and create a network that will benefit your entire career.",
    slug: "building-professional-network-high-school",
    category: "Career Development",
    tags: ["networking", "professional relationships", "career development", "LinkedIn"],
    published: true,
    publishedAt: new Date("2024-10-15")
  }
];

export async function seedBlogPosts() {
  try {
    // Check if we have an admin user, if not create one
    let adminUser = await db.select().from(users).where(eq(users.role, "admin")).limit(1);
    
    if (adminUser.length === 0) {
      console.log("Creating admin user for blog posts...");
      const [newAdmin] = await db.insert(users).values({
        username: "admin",
        email: "admin@intrn.xyz",
        password: "hashed_password", // This would be properly hashed in real implementation
        role: "admin",
        firstName: "INTRN",
        lastName: "Admin"
      }).returning();
      adminUser = [newAdmin];
    }

    const adminUserId = adminUser[0].id;

    // Check if blog posts already exist
    const existingPosts = await db.select().from(blogPosts).limit(1);
    
    if (existingPosts.length > 0) {
      console.log("Blog posts already exist, skipping seed...");
      return;
    }

    console.log("Seeding blog posts...");
    
    for (const post of blogData) {
      await db.insert(blogPosts).values({
        ...post,
        authorId: adminUserId,
        createdAt: post.publishedAt,
        updatedAt: post.publishedAt,
      });
    }

    console.log(`Successfully seeded ${blogData.length} blog posts!`);
  } catch (error) {
    console.error("Error seeding blog posts:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
seedBlogPosts()
  .then(() => {
    console.log("Blog seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Blog seeding failed:", error);
    process.exit(1);
  });