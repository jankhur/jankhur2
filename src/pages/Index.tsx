import { motion } from "framer-motion";
import Header from "@/components/Header";
import ImageFeed from "@/components/ImageFeed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero: Large name like LundLund */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="pt-28 pb-20 md:pt-36 md:pb-32 px-6 md:px-10"
      >
        <h1 className="font-sans font-bold text-foreground text-[15vw] md:text-[12vw] leading-[1.1] tracking-tight uppercase">
          JAN
          <br />
          KHÜR
        </h1>
      </motion.div>

      {/* Image Feed */}
      <main className="pb-32">
        <ImageFeed />
      </main>

      {/* Minimal Footer */}
      <footer className="px-6 md:px-10 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="nav-link">© 2025 Jan Khür</span>
          <div className="flex gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="nav-link">
              Instagram
            </a>
            <a href="mailto:hello@jankhur.com" className="nav-link">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
