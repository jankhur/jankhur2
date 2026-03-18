import { motion } from "framer-motion";

interface FeedItem {
  src: string;
  aspectRatio: number;
  layout: "full" | "center" | "left" | "right";
  name?: string;
  year?: string;
}

const BASE = "https://images.xhbtr.com/v2/uploads/images";

const feedItems: FeedItem[] = [
  // Portfolio images
  { src: `${BASE}/439792/xhbtr_abf226bb-2939-4158-80fd-07eaa2bc1ad1_w1200.jpg`, aspectRatio: 1.276, layout: "full", name: "Lofoten I", year: "2022" },
  { src: `${BASE}/352746/xhbtr_aaef9b47-2c36-4759-b65f-9e9cf1637598_w1200.jpg`, aspectRatio: 1.242, layout: "full", name: "Lofoten II", year: "2022" },
  { src: `${BASE}/681280/xhbtr_cf1a18ae-f668-433e-ac16-26eb2aa676e7_w1200.jpg`, aspectRatio: 0.811, layout: "center", name: "Lofoten III", year: "2023" },
  { src: `${BASE}/353528/xhbtr_bebeee25-e142-4edc-833a-a79d4a839283_w1200.jpg`, aspectRatio: 0.754, layout: "right", name: "Lofoten IV", year: "2023" },
  { src: `${BASE}/439791/xhbtr_e0e13b4f-9715-45b2-b24c-a07b1278f906_w1200.jpg`, aspectRatio: 0.824, layout: "left", name: "Lofoten V", year: "2023" },
  { src: `${BASE}/236538/xhbtr_11f77d4d-e61f-49c1-81da-40c1bdd12861_w1200.jpg`, aspectRatio: 0.894, layout: "center", name: "Lofoten VI", year: "2022" },
  { src: `${BASE}/681279/xhbtr_edf61716-c289-4c68-9130-fb888ddde03f_w1200.jpg`, aspectRatio: 0.802, layout: "center", name: "Lofoten VII", year: "2024" },
  { src: `${BASE}/439841/xhbtr_5036bd9a-8283-4cb0-8db6-115b37b90691_w1200.jpg`, aspectRatio: 1.237, layout: "full", name: "Lofoten VIII", year: "2022" },
  { src: `${BASE}/263648/xhbtr_91267bec-4de7-408c-955c-45e0906463be_w1200.jpg`, aspectRatio: 0.799, layout: "right", name: "Lofoten IX", year: "2022" },
  { src: `${BASE}/439846/xhbtr_470b9ed6-5160-4e06-9181-60bca52dfc6e_w1200.jpg`, aspectRatio: 0.715, layout: "left", name: "Lofoten X", year: "2022" },
  { src: `${BASE}/439871/xhbtr_d0a931c4-ea26-4ac7-b280-11c9338fa707_w1200.jpg`, aspectRatio: 0.800, layout: "right", name: "Lofoten XI", year: "2021" },
  { src: `${BASE}/439847/xhbtr_5388e9f9-d4aa-4cb0-9814-5e1406743f45_w1200.jpg`, aspectRatio: 0.794, layout: "left", name: "Lofoten XII", year: "2021" },
  { src: `${BASE}/681260/xhbtr_422eec6f-aff1-495d-8007-9a6dcad71155_w1200.jpg`, aspectRatio: 0.749, layout: "center", name: "Lofoten XIII", year: "2022" },
  { src: `${BASE}/439848/xhbtr_5da6f741-1b9a-42ac-9a36-7d072884d433_w1200.jpg`, aspectRatio: 0.751, layout: "right", name: "Lofoten XIV", year: "2022" },
  { src: `${BASE}/439872/xhbtr_7edc8fec-8255-4198-bf46-e19de1c9c685_w1200.jpg`, aspectRatio: 0.831, layout: "left", name: "Lofoten XV", year: "2022" },
  { src: `${BASE}/439879/xhbtr_52b92802-4b53-42f9-9b7b-aa42e55887c8_w1200.jpg`, aspectRatio: 1.233, layout: "full", name: "Lofoten XVI", year: "2021" },
  { src: `${BASE}/439873/xhbtr_1399097b-3f88-4ab5-ba60-0eb018c6ea3c_w1200.jpg`, aspectRatio: 0.802, layout: "right", name: "Lofoten XVII", year: "2021" },
  { src: `${BASE}/681270/xhbtr_30a95fd9-b1b6-4138-a0df-04f97bbac869_w1200.jpg`, aspectRatio: 0.749, layout: "center", name: "Lofoten XVIII", year: "2021" },
  { src: `${BASE}/439874/xhbtr_d9058ab1-f453-497b-add9-29d065b839f5_w1200.jpg`, aspectRatio: 0.799, layout: "left", name: "Lofoten XIX", year: "2021" },
  { src: `${BASE}/681269/xhbtr_55899505-552d-4b52-89c4-9c09956abe18_w1200.jpg`, aspectRatio: 0.750, layout: "right", name: "Lofoten XX", year: "2020" },
  { src: `${BASE}/681259/xhbtr_1e477fe5-d128-4fdd-8705-cf4424bda302_w1200.jpg`, aspectRatio: 1.517, layout: "full", name: "Lofoten XXI", year: "2020" },
  { src: `${BASE}/681261/xhbtr_11fe1e7b-f7c2-4e4f-af8e-d68e8b15dcff_w1200.jpg`, aspectRatio: 0.866, layout: "center", name: "Lofoten XXII", year: "2020" },
  { src: `${BASE}/681265/xhbtr_aacaf916-3626-4a7b-8e36-91c2caf5ab7c_w1200.jpg`, aspectRatio: 0.671, layout: "left", name: "Lofoten XXIII", year: "2021" },
  { src: `${BASE}/681263/xhbtr_6f6191c4-c329-4c8e-a06e-65884cd80d4e_w1200.jpg`, aspectRatio: 1.251, layout: "full", name: "Lofoten XXIV", year: "2020" },
  { src: `${BASE}/681268/xhbtr_86f3e615-3216-4597-a5c9-dc9b0a2ce052_w1200.jpg`, aspectRatio: 0.749, layout: "right", name: "Lofoten XXV", year: "2020" },
  { src: `${BASE}/681267/xhbtr_2e3ec29b-88d4-4ff7-acce-51a93fdb20f1_w1200.jpg`, aspectRatio: 0.749, layout: "left", name: "Lofoten XXVI", year: "2020" },
  { src: `${BASE}/681273/xhbtr_770e4ce8-7f07-4e9a-9d44-16f6aef90eac_w1200.jpg`, aspectRatio: 0.667, layout: "center", name: "Lofoten XXVII", year: "2020" },
  { src: `${BASE}/681266/xhbtr_36edc2ad-395d-4666-8706-2850b6435446_w1200.jpg`, aspectRatio: 0.731, layout: "right", name: "Lofoten XXVIII", year: "2019" },
  { src: `${BASE}/681264/xhbtr_55664e6b-c253-4d92-afd7-d6678e3cc047_w1200.jpg`, aspectRatio: 0.794, layout: "left", name: "Lofoten XXIX", year: "2019" },
  { src: `${BASE}/681262/xhbtr_37cf73a7-3ce0-4dfe-bf0c-413bf7b7a158_w1200.jpg`, aspectRatio: 0.667, layout: "center", name: "Lofoten XXX", year: "2019" },
  { src: `${BASE}/681271/xhbtr_17d3d038-0e51-40ae-a500-354fbdf45d92_w1200.jpg`, aspectRatio: 0.800, layout: "right", name: "Lofoten XXXI", year: "2019" },
  { src: `${BASE}/681272/xhbtr_bfe53293-1edf-49cb-b95a-cacbacadaf7a_w1200.jpg`, aspectRatio: 0.667, layout: "left", name: "Lofoten XXXII", year: "2019" },
  { src: `${BASE}/681274/xhbtr_b09ff8fa-c175-4425-8bef-77be251cb408_w1200.jpg`, aspectRatio: 0.667, layout: "center", name: "Lofoten XXXIII", year: "2019" },
  { src: `${BASE}/681278/xhbtr_d5db8a13-bbd5-4678-9bdf-f8d59e099dcf_w1200.jpg`, aspectRatio: 0.807, layout: "right", name: "Lofoten XXXIV", year: "2020" },
  { src: `${BASE}/681281/xhbtr_8a7e5946-cd04-4948-ae16-45c3a36498c8_w1200.jpg`, aspectRatio: 0.803, layout: "left", name: "Lofoten XXXV", year: "2020" },
  { src: `${BASE}/681283/xhbtr_f6a28ffc-ae84-4ce3-87b6-60b1cb40e805_w1200.jpg`, aspectRatio: 0.821, layout: "center", name: "Lofoten XXXVI", year: "2020" },
  { src: `${BASE}/681282/xhbtr_e55eac5a-83de-4472-b03c-bc0f595ef5e6_w1200.jpg`, aspectRatio: 1.238, layout: "full", name: "Lofoten XXXVII", year: "2020" },
  { src: `${BASE}/681275/xhbtr_e954b3db-3fc5-4c3c-8559-e3985bd85720_w1200.jpg`, aspectRatio: 1.232, layout: "full", name: "Lofoten XXXVIII", year: "2019" },
  { src: `${BASE}/681276/xhbtr_b9cc0d23-49e5-4b17-aed0-bd89c1b62fee_w1200.jpg`, aspectRatio: 0.809, layout: "left", name: "Lofoten XXXIX", year: "2019" },
  { src: `${BASE}/681277/xhbtr_04f43a33-f39d-4d59-ae15-f7aafba7bea8_w1200.jpg`, aspectRatio: 0.802, layout: "right", name: "Lofoten XL", year: "2019" },
  { src: `${BASE}/681285/xhbtr_c2d5bb54-eacf-4636-aa48-ca04bcbee9f5_w1200.jpg`, aspectRatio: 1.247, layout: "full", name: "Lofoten XLI", year: "2019" },
  { src: `${BASE}/681284/xhbtr_c471b9e2-532b-49db-9011-ca48a049cd0b_w1200.jpg`, aspectRatio: 1.235, layout: "full", name: "Lofoten XLII", year: "2019" },
  { src: `${BASE}/681286/xhbtr_a3720df0-bdee-4724-9253-7ce0c32ac24f_w1200.jpg`, aspectRatio: 0.792, layout: "center", name: "Lofoten XLIII", year: "2019" },
  // Editorial
  { src: `${BASE}/682750/xhbtr_d939e4cc-6dcb-48d1-a1c5-638ca4668300_w1200.jpg`, aspectRatio: 0.746, layout: "center", name: "Aril Eriksen / Obos", year: "2024" },
  // Journey
  { src: `${BASE}/356974/xhbtr_8c47b949-7fd6-415f-a798-99968d475692_w1200.jpg`, aspectRatio: 0.726, layout: "left", name: "Japan", year: "2022" },
  { src: `${BASE}/352643/xhbtr_db9ac87f-0e1f-4cc8-beda-477265cdfb11_w1200.jpg`, aspectRatio: 0.698, layout: "right", name: "South Africa", year: "2022" },
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ImageFeed = () => {
  return (
    <div className="flex flex-col gap-3 md:gap-20">
      {feedItems.map((item, index) => {
        const captionId = `feed-caption-${index + 1}`;
        const titleId = `${captionId}-title`;
        const yearId = `${captionId}-year`;

        return (
          <motion.div
            key={item.src}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className={getLayoutClasses(item.layout)}
            data-feed-item={captionId}
          >
            <img
              src={item.src}
              alt={`Jan Khür photography ${index + 1}`}
              className="block h-auto w-auto max-h-[85vh] max-w-[90vw] object-contain"
              loading="lazy"
            />
            {item.name && (
              <p
                className="mt-3 font-serif text-sm leading-relaxed"
                data-caption-id={captionId}
                aria-labelledby={item.year ? `${titleId} ${yearId}` : titleId}
              >
                <span id={titleId} className="font-bold text-foreground">{item.name}</span>
                {item.year && (
                  <span id={yearId} className="font-normal text-muted-foreground">, {item.year}</span>
                )}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

function getLayoutClasses(layout: FeedItem["layout"]): string {
  switch (layout) {
    case "full":
      return "w-full px-6 md:px-10 flex flex-col items-center";
    case "center":
      return "w-full flex flex-col items-center px-6 md:px-0 md:max-w-[45%] mx-auto";
    case "left":
      return "w-full px-6 md:pl-10 md:pr-0 md:max-w-[55%] flex flex-col items-center md:items-start";
    case "right":
      return "w-full px-6 md:pr-10 md:pl-0 md:max-w-[55%] ml-auto flex flex-col items-center md:items-end";
    default:
      return "w-full px-6 md:px-10 flex flex-col items-center";
  }
}

export default ImageFeed;
