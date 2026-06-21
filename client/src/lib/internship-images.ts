import rippleImage from "@assets/download (1)_1753000655307.png";
import kebabSnackImage from "@assets/generated_images/flat_lay_of_colorful_512a.png";
import kebabSocialImage from "@assets/generated_images/young_person_at_a_c315.png";
import chandPearlImage from "@assets/generated_images/elegant_white_and_cream_7a6c.png";
import chandGenZImage from "@assets/generated_images/mood_board_aesthetic_trendy_1748.png";
import preludeImage from "@assets/generated_images/professional_flat_lay_of_56ea.png";
import contentWritingImage from "@assets/generated_images/cozy_editorial_writing_workspace_769a.png";
import platformOpsImage from "@assets/generated_images/modern_marketing_operations_dashboard_3b5c.png";
import birTerracesImage from "@assets/generated_images/scenic_himalayan_mountain_retreat_0d63.png";

export const internshipImages: Record<string, string> = {
  "Research Intern - Social Impact of Sports": rippleImage,
  "Research & Presentation Specialist": preludeImage,
  "Content Writing & Editorial Intern": contentWritingImage,
  "Platform Operations & Marketing Intern": platformOpsImage,
  "Social Media Intern": birTerracesImage,
  "Kids' Snack Market Research Intern": kebabSnackImage,
  "Social Media Content Creator Intern": kebabSocialImage,
  "Pearl Education Content Design Intern": chandPearlImage,
  "Gen Z Jewellery Trend Research Intern": chandGenZImage,
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
