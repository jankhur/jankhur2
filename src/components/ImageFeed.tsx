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
  { src: `${BASE}/439792/xhbtr_abf226bb-2939-4158-80fd-07eaa2bc1ad1_w1200.jpg`, aspectRatio: 1.276, layout: "full", name: "Name Surname", year: "2022" },
  { src: `${BASE}/352746/xhbtr_aaef9b47-2c36-4759-b65f-9e9cf1637598_w1200.jpg`, aspectRatio: 1.242, layout: "full", name: "Name Surname", year: "2022" },
  { src: `${BASE}/681280/xhbtr_cf1a18ae-f668-433e-ac16-26eb2aa676e7_w1200.jpg`, aspectRatio: 0.811, layout: "center", name: "Name Surname", year: "2023" },
  { src: `${BASE}/353528/xhbtr_bebeee25-e142-4edc-833a-a79d4a839283_w1200.jpg`, aspectRatio: 0.754, layout: "right", name: "Name Surname", year: "2023" },
  { src: `${BASE}/439791/xhbtr_e0e13b4f-9715-45b2-b24c-a07b1278f906_w1200.jpg`, aspectRatio: 0.824, layout: "left", name: "Name Surname", year: "2023" },
  { src: `${BASE}/681279/xhbtr_edf61716-c289-4c68-9130-fb888ddde03f_w1200.jpg`, aspectRatio: 0.802, layout: "center", name: "Name Surname", year: "2024" },
  { src: `${BASE}/439841/xhbtr_5036bd9a-8283-4cb0-8db6-115b37b90691_w1200.jpg`, aspectRatio: 1.237, layout: "full", name: "Name Surname", year: "2022" },
  { src: `${BASE}/263648/xhbtr_91267bec-4de7-408c-955c-45e0906463be_w1200.jpg`, aspectRatio: 0.799, layout: "right", name: "Name Surname", year: "2022" },
  { src: `${BASE}/439871/xhbtr_d0a931c4-ea26-4ac7-b280-11c9338fa707_w1200.jpg`, aspectRatio: 0.800, layout: "left", name: "Name Surname", year: "2021" },
  { src: `${BASE}/681260/xhbtr_422eec6f-aff1-495d-8007-9a6dcad71155_w1200.jpg`, aspectRatio: 0.749, layout: "center", name: "Name Surname", year: "2022" },
  { src: `${BASE}/439879/xhbtr_52b92802-4b53-42f9-9b7b-aa42e55887c8_w1200.jpg`, aspectRatio: 1.233, layout: "full", name: "Name Surname", year: "2021" },
  { src: `${BASE}/439873/xhbtr_1399097b-3f88-4ab5-ba60-0eb018c6ea3c_w1200.jpg`, aspectRatio: 0.802, layout: "right", name: "Name Surname", year: "2021" },
  { src: `${BASE}/681259/xhbtr_1e477fe5-d128-4fdd-8705-cf4424bda302_w1200.jpg`, aspectRatio: 1.517, layout: "full", name: "Name Surname", year: "2020" },
  { src: `${BASE}/681265/xhbtr_aacaf916-3626-4a7b-8e36-91c2caf5ab7c_w1200.jpg`, aspectRatio: 0.671, layout: "left", name: "Name Surname", year: "2021" },
  { src: `${BASE}/681263/xhbtr_6f6191c4-c329-4c8e-a06e-65884cd80d4e_w1200.jpg`, aspectRatio: 1.251, layout: "full", name: "Name Surname", year: "2020" },
  { src: `${BASE}/681273/xhbtr_770e4ce8-7f07-4e9a-9d44-16f6aef90eac_w1200.jpg`, aspectRatio: 0.667, layout: "center", name: "Name Surname", year: "2020" },
  { src: `${BASE}/681262/xhbtr_37cf73a7-3ce0-4dfe-bf0c-413bf7b7a158_w1200.jpg`, aspectRatio: 0.667, layout: "right", name: "Name Surname", year: "2019" },
  { src: `${BASE}/681282/xhbtr_e55eac5a-83de-4472-b03c-bc0f595ef5e6_w1200.jpg`, aspectRatio: 1.238, layout: "full", name: "Name Surname", year: "2020" },
  { src: `${BASE}/681275/xhbtr_e954b3db-3fc5-4c3c-8559-e3985bd85720_w1200.jpg`, aspectRatio: 1.232, layout: "full", name: "Name Surname", year: "2019" },
  { src: `${BASE}/681277/xhbtr_04f43a33-f39d-4d59-ae15-f7aafba7bea8_w1200.jpg`, aspectRatio: 0.802, layout: "left", name: "Name Surname", year: "2019" },
];

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ImageFeed = () => {
  return (
    <div className="flex flex-col gap-24 md:gap-32">
      {feedItems.map((item, index) => (
        <motion.div
          key={index}
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className={getLayoutClasses(item.layout)}
        >
          <img
            src={item.src}
            alt={`Jan Khür photography ${index + 1}`}
            className="w-full h-auto block"
            loading="lazy"
          />
          {item.captionName && (
            <p className="mt-3 font-serif text-sm text-muted-foreground leading-relaxed">
              {item.captionPrefix && <span>{item.captionPrefix} </span>}
              <span className="font-bold text-foreground">{item.captionName}</span>
              {item.captionSuffix && <span> {item.captionSuffix}</span>}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

function getLayoutClasses(layout: FeedItem["layout"]): string {
  switch (layout) {
    case "full":
      return "w-full px-6 md:px-10";
    case "center":
      return "w-full flex flex-col items-center px-6 md:px-0 md:max-w-[45%] mx-auto";
    case "left":
      return "w-full px-6 md:pl-10 md:pr-0 md:max-w-[55%]";
    case "right":
      return "w-full px-6 md:pr-10 md:pl-0 md:max-w-[55%] ml-auto";
    default:
      return "w-full px-6 md:px-10";
  }
}

export default ImageFeed;
