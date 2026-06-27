import rippleImage from "@assets/generated_images/card-webp/ripple.webp";
import kebabSnackImage from "@assets/generated_images/card-webp/flat_lay_of_colorful_512a.webp";
import kebabSocialImage from "@assets/generated_images/card-webp/young_person_at_a_c315.webp";
import chandPearlImage from "@assets/generated_images/card-webp/elegant_white_and_cream_7a6c.webp";
import chandGenZImage from "@assets/generated_images/card-webp/mood_board_aesthetic_trendy_1748.webp";
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
  "Market Research Intern for a Healthy Frozen-Food Brand": kebabSnackImage,
  "Social Media Content Intern for a Healthy Food Brand": kebabSocialImage,
  "Content Design Intern for a Heritage Jewellery Brand": chandPearlImage,
  "Trend Research Intern for a Luxury Jewellery Brand": chandGenZImage,
};

export function getInternshipImage(title: string): string | undefined {
  return internshipImages[title];
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
