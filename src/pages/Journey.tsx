import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import SketchCursor from "@/components/SketchCursor";
import { fetchJourneyProjects } from "@/lib/queries";

type LayoutType = "full" | "center" | "left" | "right";
const layoutSequence: LayoutType[] = ["center", "right", "left", "center", "left", "right"];

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

const Journey = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["journey-projects"],
    queryFn: fetchJourneyProjects,
  });

  if (isLoading) return <div className="min-h-screen bg-background"><Header showName /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Header showName />
      <SketchCursor type="journey" />

      <main className="pt-28 pb-32">
        <div className="flex flex-col gap-12 md:gap-32">
          {(projects || []).map((project, i) => {
            const layout = layoutSequence[i % layoutSequence.length];
            return (
              <motion.div
                key={project.slug}
                variants={fadeInVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className={getLayoutClasses(layout)}
              >
                <Link
                  to={`/journey/${project.slug}`}
                  className="group block"
                >
                  <div className="overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="block h-auto w-auto max-h-[85vh] max-w-[90vw] object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3 font-serif text-sm image-caption">
                    <span className="font-bold text-foreground">{project.title}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Journey;
