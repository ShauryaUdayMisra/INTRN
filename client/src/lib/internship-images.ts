import rippleImage from "@assets/generated_images/card-webp/ripple.webp";
import kebabLogo from "@assets/kebabsmith-logo.png";
import chandraniLogo from "@assets/chandrani-logo.png";
import preludeImage from "@assets/generated_images/card-webp/professional_flat_lay_of_56ea.webp";
import contentWritingImage from "@assets/generated_images/card-webp/cozy_editorial_writing_workspace_769a.webp";
import platformOpsImage from "@assets/generated_images/card-webp/modern_marketing_operations_dashboard_3b5c.webp";
import birTerracesImage from "@assets/generated_images/card-webp/scenic_himalayan_mountain_retreat_0d63.webp";

export const internshipImages: Record<string, string> = {
  "Research Intern for a Rural Sports & Social Impact Nonprofit": rippleImage,
  "Research & Presentation Intern for a Live Events Company": preludeImage,
  "Content Writing & Editorial Intern for a School Brand": contentWritingImage,
  "Operations & Marketing Intern for a Student Internship Startup": platformOpsImage,
  "Social Media & Content Intern for a Luxury Mountain Homestay": birTerracesImage,
  "Market Research Intern for a Healthy Frozen-Food Brand": kebabLogo,
  "Social Media Content Intern for a Healthy Food Brand": kebabLogo,
  "Content Design Intern for a Heritage Jewellery Brand": chandraniLogo,
  "Trend Research Intern for a Luxury Jewellery Brand": chandraniLogo,
};

export function getInternshipImage(title: string): string | undefined {
  return internshipImages[title];
}

const logoTitles = new Set<string>([
  "Market Research Intern for a Healthy Frozen-Food Brand",
  "Social Media Content Intern for a Healthy Food Brand",
  "Content Design Intern for a Heritage Jewellery Brand",
  "Trend Research Intern for a Luxury Jewellery Brand",
]);

export function isLogoImage(title: string): boolean {
  return logoTitles.has(title);
}

const tileGradients = [
  "from-purple-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-violet-500 to-fuchsia-500",
];

export function getTitleGradient(title: string): string {
  let sum = 0;
  for (let i = 0; i < title.length; i++) sum += title.charCodeAt(i);
  return tileGradients[sum % tileGradients.length];
}
