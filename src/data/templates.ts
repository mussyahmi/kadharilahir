export interface Template {
  id: string;
  name: string;
  description: string;
  defaultColor: string;
  style: "comel" | "elegan" | "minimalis" | "seri" | "ai-custom";
}

export const templates: Template[] = [
  {
    id: "comel",
    name: "Comel",
    description: "Rekaan comel dengan warna-warni pastel, sesuai untuk hari lahir kanak-kanak",
    defaultColor: "#EC4899",
    style: "comel",
  },
  {
    id: "elegan",
    name: "Elegan",
    description: "Rekaan mewah dengan sentuhan emas, sesuai untuk majlis istimewa",
    defaultColor: "#B8860B",
    style: "elegan",
  },
  {
    id: "minimalis",
    name: "Minimalis",
    description: "Rekaan bersih dan moden, sesuai untuk semua peringkat umur",
    defaultColor: "#6366F1",
    style: "minimalis",
  },
  {
    id: "seri",
    name: "Seri",
    description: "Rekaan ceria dengan warna terang, sesuai untuk pesta yang meriah",
    defaultColor: "#F97316",
    style: "seri",
  },
  {
    id: "ai-custom",
    name: "Jana AI",
    description: "Jana prompt untuk AI image generator dan tampal gambar hari lahir di atasnya",
    defaultColor: "#EC4899",
    style: "ai-custom",
  },
];

export function getTemplate(id: string): Template {
  return templates.find((t) => t.id === id) ?? templates[0];
}
