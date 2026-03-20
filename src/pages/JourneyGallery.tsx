import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import SketchCursor from "@/components/SketchCursor";
import { fetchJourneyImages, fetchJourneyProjects } from "@/lib/queries";

type LayoutType = "wide" | "center" | "left" | "right";
const portraitSequence: LayoutType[] = ["center", "right", "left", "center", "left", "right"];

function assignLayout(aspectRatio: number, portraitIndex: number): LayoutType {
  if (aspectRatio > 1.1) return "wide";
  return portraitSequence[portraitIndex % portraitSequence.length];
}

function getLayoutClasses(layout: LayoutType): string {
  switch (layout) {
    case "wide":
      return "w-full px-6 md:px-[12%] flex flex-col items-center";
    case "center":
      return "w-full flex flex-col items-center px-6 md:px-0 md:max-w-[42%] mx-auto";
    case "left":
      return "w-full px-6 md:pl-[8%] md:pr-0 md:max-w-[50%] flex flex-col items-start";
    case "right":
      return "w-full px-6 md:pr-[8%] md:pl-0 md:max-w-[50%] ml-auto flex flex-col items-end";
    default:
      return "w-full px-6 md:px-10 flex flex-col items-center";
  }
}

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const JourneyGallery = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: projects } = useQuery({
    queryKey: ["journey-projects"],
    queryFn: fetchJourneyProjects,
  });

  const { data: images, isLoading } = useQuery({
    queryKey: ["journey-images", slug],
    queryFn: () => fetchJourneyImages(slug || ""),
    enabled: !!slug,
  });

  const project = projects?.find((p) => p.slug === slug);
  const title = project?.title || slug || "";

  if (!slug || (!isLoading && (!images || images.length === 0))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Header showName />
        <p className="text-foreground">Gallery not found</p>
      </div>
    );
  }

  let portraitIndex = 0;

  return (
    <div className="min-h-screen bg-background">
      <Header showName />
      <SketchCursor type="journey" />

      <main className="pt-24 pb-32">
        <div className="flex flex-col gap-16 md:gap-24">
          {(images || []).map((img, i) => {
            const ar = Number(img.aspect_ratio);
            const layout = assignLayout(ar, portraitIndex);
            if (layout !== "wide") portraitIndex++;

            return (
              <motion.div
                key={img.id}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                className={getLayoutClasses(layout)}
              >
                <img
                  src={img.src}
                  alt={`${title} — ${i + 1}`}
                  className="block h-auto w-full object-contain"
                  style={{ maxHeight: "88vh" }}
                  loading={i < 3 ? "eager" : "lazy"}
                />
              </motion.div>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-12 left-6 md:left-10 z-30 pointer-events-none">
        <span className="font-serif text-sm text-foreground">
          <span className="font-bold">{title}</span>
        </span>
      </div>
    </div>
  );
};

export default JourneyGallery;
