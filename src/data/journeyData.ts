const BASE = "https://images.xhbtr.com/v2/uploads/images";

export interface JourneyImage {
  id: string;
  src: string;
  srcLarge: string;
  aspectRatio: number;
}

export interface JourneyProject {
  slug: string;
  title: string;
  thumbnail: string;
}

export const journeyProjects: JourneyProject[] = [
  {
    slug: "japan",
    title: "Japan",
    thumbnail: `${BASE}/356974/xhbtr_8c47b949-7fd6-415f-a798-99968d475692_w800.jpg`,
  },
  {
    slug: "south-africa",
    title: "South Africa",
    thumbnail: `${BASE}/352643/xhbtr_db9ac87f-0e1f-4cc8-beda-477265cdfb11_w800.jpg`,
  },
];

export const japanImages: JourneyImage[] = [
  { id: "356973", src: `${BASE}/356973/xhbtr_ee36f169-c36d-49f4-a63a-0436d4097405_w1200.jpg`, srcLarge: `${BASE}/356973/xhbtr_ee36f169-c36d-49f4-a63a-0436d4097405_w1600.jpg`, aspectRatio: 0.726 },
  { id: "356977", src: `${BASE}/356977/xhbtr_d45e8372-1821-4a23-9a4c-0b659fa69d88_w1200.jpg`, srcLarge: `${BASE}/356977/xhbtr_d45e8372-1821-4a23-9a4c-0b659fa69d88_w1600.jpg`, aspectRatio: 0.6668 },
  { id: "356976", src: `${BASE}/356976/xhbtr_f5bc9fc9-f5c0-411c-b84c-c4d9d1ec5f4d_w1200.jpg`, srcLarge: `${BASE}/356976/xhbtr_f5bc9fc9-f5c0-411c-b84c-c4d9d1ec5f4d_w1600.jpg`, aspectRatio: 0.6668 },
  { id: "356981", src: `${BASE}/356981/xhbtr_53f44682-2ce4-417a-8740-47f077b484fe_w1200.jpg`, srcLarge: `${BASE}/356981/xhbtr_53f44682-2ce4-417a-8740-47f077b484fe_w1600.jpg`, aspectRatio: 0.6668 },
  { id: "356980", src: `${BASE}/356980/xhbtr_274b6706-cdd8-4fac-95e8-20cbd1e100c4_w1200.jpg`, srcLarge: `${BASE}/356980/xhbtr_274b6706-cdd8-4fac-95e8-20cbd1e100c4_w1600.jpg`, aspectRatio: 0.6664 },
  { id: "356978", src: `${BASE}/356978/xhbtr_c31934df-9e13-4e62-a3b1-410925634e49_w1200.jpg`, srcLarge: `${BASE}/356978/xhbtr_c31934df-9e13-4e62-a3b1-410925634e49_w1600.jpg`, aspectRatio: 0.6668 },
  { id: "356979", src: `${BASE}/356979/xhbtr_a54f79cd-1dab-4ad6-8e9d-623d41e5ed63_w1200.jpg`, srcLarge: `${BASE}/356979/xhbtr_a54f79cd-1dab-4ad6-8e9d-623d41e5ed63_w1600.jpg`, aspectRatio: 0.6668 },
  { id: "356982", src: `${BASE}/356982/xhbtr_4845f528-c5f5-4cd2-9bf3-b7d0b1233bf1_w1200.jpg`, srcLarge: `${BASE}/356982/xhbtr_4845f528-c5f5-4cd2-9bf3-b7d0b1233bf1_w1600.jpg`, aspectRatio: 0.6668 },
  { id: "356983", src: `${BASE}/356983/xhbtr_cf7a997f-2e72-4300-ad50-a1e426db4a59_w1200.jpg`, srcLarge: `${BASE}/356983/xhbtr_cf7a997f-2e72-4300-ad50-a1e426db4a59_w1600.jpg`, aspectRatio: 1.5004 },
  { id: "427987", src: `${BASE}/427987/xhbtr_c1d68712-04f5-48d3-a83d-3f8ac4ed6b0d_w1200.jpg`, srcLarge: `${BASE}/427987/xhbtr_c1d68712-04f5-48d3-a83d-3f8ac4ed6b0d_w1600.jpg`, aspectRatio: 0.6666 },
  { id: "428019", src: `${BASE}/428019/xhbtr_3fa2d840-454c-472d-b1c9-abf5d00e08a0_w1200.jpg`, srcLarge: `${BASE}/428019/xhbtr_3fa2d840-454c-472d-b1c9-abf5d00e08a0_w1600.jpg`, aspectRatio: 0.6666 },
];

export const southAfricaImages: JourneyImage[] = [
  { id: "352649", src: `${BASE}/352649/xhbtr_1b358643-403e-4b18-bd32-f300df9e0e80_w1200.jpg`, srcLarge: `${BASE}/352649/xhbtr_1b358643-403e-4b18-bd32-f300df9e0e80_w1600.jpg`, aspectRatio: 0.6976 },
];
