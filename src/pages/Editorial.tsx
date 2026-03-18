import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { editorialProjects } from "@/data/editorialProjects";

const Editorial = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showName />

      <main className="px-6 md:px-10 pt-28 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {editorialProjects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                to={`/editorial/${project.slug}`}
                className="group block"
              >
                <div className="overflow-hidden mb-4">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="font-serif text-sm">
                  <span className="font-bold text-foreground">{project.title}</span>
                  {project.subtitle && (
                    <span className="font-normal text-muted-foreground">, {project.subtitle}</span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Editorial;
