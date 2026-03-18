export interface EditorialProject {
  slug: string;
  title: string;
  subtitle?: string;
  thumbnail: string;
  year?: string;
}

export const editorialProjects: EditorialProject[] = [
  {
    slug: "arild",
    title: "Arild Eriksen",
    subtitle: "Obos",
    thumbnail: "https://images.xhbtr.com/v2/uploads/images/456933/xhbtr_af2e9f01-2f4b-4992-88e1-573a4dee36a8_w1200.jpg",
    year: "2024",
  },
];
