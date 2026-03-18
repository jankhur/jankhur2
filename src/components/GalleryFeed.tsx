import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LayoutType = "full" | "center" | "left" | "right";

export interface GalleryImage {
  id: string;
  src: string;
  srcLarge: string;
  aspectRatio: number;
  layout?: LayoutType;
}

interface GalleryFeedProps {
  images: GalleryImage[];
  title: string;
  subtitle?: string;
}

const layoutSequence: LayoutType[] = ["center", "right", "left", "center", "left", "right"];

function assignLayout(img: GalleryImage, index: number): LayoutType {
  if (img.layout) return img.layout;
  if (img.aspectRatio > 1.1) return "full";
  return layoutSequence[index % layoutSequence.length];
}

function getLayoutClasses(layout: LayoutType): string {
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

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const GalleryFeed = ({ images, title, subtitle }: GalleryFeedProps) => {
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  return (
    <>
      <div className="flex flex-col gap-24 md:gap-32">
        {images.map((img, index) => {
          const layout = assignLayout(img, index);
          return (
            <motion.div
              key={img.id}
              variants={fadeInVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className={getLayoutClasses(layout)}
            >
              <img
                src={img.src}
                alt={`${title} — ${index + 1}`}
                className="block h-auto w-auto max-h-[85vh] max-w-[90vw] object-contain cursor-pointer"
                loading={index < 3 ? "eager" : "lazy"}
                onClick={() => setLightboxImage(img)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center cursor-pointer"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage.srcLarge}
                alt={title}
                className="max-h-[80vh] max-w-[90vw] w-auto h-auto object-contain"
              />
              {(title || subtitle) && (
                <p className="mt-4 font-serif text-sm text-foreground">
                  <span className="font-bold">{title}</span>
                  {subtitle && <span className="text-muted-foreground">, {subtitle}</span>}
                </p>
              )}
            </motion.div>

            <button
              onClick={() => setLightboxImage(null)}
              className="fixed top-6 right-6 md:right-10 z-50 nav-link"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryFeed;
