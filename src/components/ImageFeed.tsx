import { motion } from "framer-motion";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";
import photo4 from "@/assets/photo-4.jpg";
import photo5 from "@/assets/photo-5.jpg";
import photo6 from "@/assets/photo-6.jpg";

interface FeedItem {
  src: string;
  caption: string;
  meta?: string;
  layout: "full" | "center" | "left" | "right" | "duo-left" | "duo-right";
}

const feedItems: FeedItem[] = [
  {
    src: photo1,
    caption: "Lofoten, Norway",
    meta: "Journey",
    layout: "full",
  },
  {
    src: photo2,
    caption: "Studio Portrait",
    meta: "Editorial",
    layout: "center",
  },
  {
    src: photo3,
    caption: "Nordic Forest",
    meta: "Journey",
    layout: "full",
  },
  {
    src: photo4,
    caption: "Still Life — Dried Flowers",
    meta: "Portfolio",
    layout: "right",
  },
  {
    src: photo5,
    caption: "Black Sand Beach, Iceland",
    meta: "Journey",
    layout: "full",
  },
  {
    src: photo6,
    caption: "Concrete Forms",
    meta: "Portfolio",
    layout: "left",
  },
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
            alt={item.caption}
            className="w-full h-auto block"
            loading="lazy"
          />
          <div className="mt-4 px-1">
            <span className="caption-text">{item.caption}</span>
            {item.meta && (
              <span className="caption-meta ml-2">— {item.meta}</span>
            )}
          </div>
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
