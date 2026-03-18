import { motion } from "framer-motion";
import Header from "@/components/Header";

const BASE = "https://images.xhbtr.com/v2/uploads/images";

const editorialImages = [
  { src: `${BASE}/682750/xhbtr_d939e4cc-6dcb-48d1-a1c5-638ca4668300_w1200.jpg`, aspectRatio: 0.746, name: "Aril Eriksen / Obos", year: "2024" },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Editorial = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showName />

      <div className="pt-28 pb-20 md:pt-36 md:pb-32 px-6 md:px-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-sans font-bold text-foreground text-[10vw] md:text-[6vw] leading-[1.1] tracking-tight uppercase"
        >
          Editorial
        </motion.h1>
      </div>

      <main className="pb-32 flex flex-col gap-24 md:gap-32">
        {editorialImages.map((item, index) => (
          <motion.div
            key={index}
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full flex flex-col items-center px-6 md:px-0 md:max-w-[55%] mx-auto"
          >
            <img
              src={item.src}
              alt={item.name}
              className="w-full h-auto block"
              loading="lazy"
            />
            <p className="mt-3 font-serif text-sm leading-relaxed">
              <span className="font-bold text-foreground">{item.name}</span>
              {item.year && <span className="font-normal text-muted-foreground">, {item.year}</span>}
            </p>
          </motion.div>
        ))}
      </main>

      <footer className="px-6 md:px-10 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="nav-link">© 2025 Jan Khür</span>
          <div className="flex gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="nav-link">Instagram</a>
            <a href="mailto:hello@jankhur.com" className="nav-link">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Editorial;
