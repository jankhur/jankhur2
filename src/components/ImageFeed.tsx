import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchLandingImages } from "@/lib/queries";

interface FeedItem {
  src: string;
  aspectRatio: number;
  layout: "full" | "center" | "left" | "right";
  name?: string;
  year?: string;
}

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ImageFeed = () => {
  const { data: dbImages, isLoading } = useQuery({
    queryKey: ["landing-images"],
    queryFn: fetchLandingImages,
  });

  const feedItems: FeedItem[] = (dbImages || []).map((img) => ({
    src: img.src,
    aspectRatio: Number(img.aspect_ratio),
    layout: (img.layout as FeedItem["layout"]) || "center",
    name: img.name || undefined,
    year: img.year || undefined,
  }));

  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-3 md:gap-20">
      {feedItems.map((item, index) => (
        <motion.div
          key={`feed-${index}`}
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
            className="block h-auto w-auto max-h-[85vh] max-w-[90vw] object-contain"
            loading="lazy"
          />
          {item.name && (
            <p className="mt-3 font-serif text-sm leading-relaxed image-caption">
              <span className="font-bold text-foreground">{item.name}</span>
              {item.year && (
                <span className="font-normal text-muted-foreground">
                  , {item.year}
                </span>
              )}
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
