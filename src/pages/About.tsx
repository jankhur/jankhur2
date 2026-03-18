import { motion } from "framer-motion";
import Header from "@/components/Header";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const exhibitions = [
  {
    section: "Solo Exhibitions",
    items: [
      { title: "Imagine Being There Right Now", year: "2012", venue: "TOAST Gallery, Zlin (CZ)" },
    ],
  },
  {
    section: "Group Exhibitions",
    items: [
      { title: "Polagraph Gallery — group show of represented photographers", year: "2025", venue: "Polagraph Gallery, Praha (CZ)" },
      { title: 'Oslo Negative — "Convergence" — photo festival as part of Bjørka group show', year: "2025", venue: "Nasjonalgalleriet i Oslo (NO)" },
      { title: "Nookart Gallery — Mirror, Mirror — photo exhibition", year: "2024", venue: "Nookart Gallery, Prague (CZ)" },
      { title: "Oslo Negative — photo festival as part of Bjørka group show", year: "2024", venue: "Oslo Negative, Gamle Veterinar Skole (NO)" },
      { title: 'Forbundet Frie Fotografer "50-årsjubileum", Salongutstilling', year: "2024", venue: "Fotogalleriet, Oslo (NO)" },
      { title: "Oslo Open — Bjørka — group show at Bjørka during Oslo Open", year: "2024", venue: "Oslo Open (NO)" },
      { title: "Polagraph Gallery — photo exhibition duo with Julie Hrncirova", year: "2023", venue: "Polagraph Gallery, Praha (CZ)" },
      { title: "Oslo Negative — DEMO — photo festival as part of Bjørka group show", year: "2023", venue: "Oslo Negative (NO)" },
      { title: "Rampen — photo exhibition duo with Julie Hrncirova", year: "2021", venue: "Rampen, Oslo (NO)" },
      { title: "Vinslottet — photo exhibition duo with Julie Hrncirova", year: "2021", venue: "Vinslottet, Oslo (NO)" },
      { title: "Group Hug n.3", year: "2019", venue: "Low Standarts, Oslo (NO)" },
      { title: "Disco — duo exhibition with Marthe Bleu", year: "2017", venue: "CYAN Gallery, Oslo (NO)" },
      { title: "KRYSS TVERS", year: "2017", venue: "Skippergata, Oslo (NO)" },
      { title: "Shuffeling Pixels", year: "2013", venue: "Photogether Gallery, Zlin (CZ)" },
      { title: "Shuffeling Pixels", year: "2013", venue: "Studio Huddle, Toronto (CA)" },
      { title: "TRANSGENDER ME — during Prague Pride 2013", year: "2013", venue: "NTK Gallery, National Library of Technology, Prague (CZ)" },
      { title: "XRXR: Photocopy Philadelphia", year: "2013", venue: "Napoleon Gallery, Philadelphia (USA)" },
      { title: "Czeggs", year: "2013", venue: "Frameless Gallery, London (UK)" },
      { title: "UTB Graduation Show BcA.", year: "2012", venue: "Factory Gallery, Zlin (CZ)" },
    ],
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 md:pt-40 pb-24 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          {/* Header — Name + Contact */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
            className="mb-24 md:mb-32"
          >
            <h1 className="font-serif text-5xl md:text-7xl mb-12 text-foreground">Jan Khür</h1>
            <div className="flex flex-wrap gap-x-8 gap-y-2 font-serif text-base text-muted-foreground">
              <a
                href="https://www.instagram.com/jankhur"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                @jankhur
              </a>
              <span>(+47) 98 642 904</span>
              <a href="mailto:jankhur@gmail.com" className="hover:text-foreground transition-colors">
                jankhur@gmail.com
              </a>
              <span>Oslo, Norway</span>
            </div>
          </motion.div>

          {/* CV Sections — stacked with generous spacing */}
          <div className="space-y-20 md:space-y-28">
            {/* Exhibitions */}
            <motion.section
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {exhibitions.map((group) => (
                <div key={group.section} className="mb-16 last:mb-0">
                  <h2 className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
                    {group.section}
                  </h2>
                  <div className="space-y-0">
                    {group.items.map((item, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[60px_1fr_1fr] md:grid-cols-[80px_1fr_1fr] gap-x-4 py-3 border-b border-border/40 first:border-t"
                      >
                        <span className="font-sans text-xs text-muted-foreground tabular-nums pt-0.5">
                          {item.year}
                        </span>
                        <span className="font-serif text-sm leading-relaxed text-foreground">
                          {item.title}
                        </span>
                        <span className="font-sans text-xs text-muted-foreground pt-0.5 text-right md:text-left">
                          {item.venue}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.section>

            {/* Studio & Agency — side by side */}
            <motion.section
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-16"
            >
              <div>
                <h2 className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
                  Studio
                </h2>
                <p className="font-serif text-sm leading-relaxed text-foreground">
                  <a
                    href="https://abrakadabra.studio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:opacity-50 transition-opacity"
                  >
                    Abrakadabra
                  </a>{" "}
                  provides photographic services and creative direction. It was founded by Jan Khür
                  and Julie Hrnčířová in Oslo in 2021. With a focus on playfulness, honesty and
                  originality.
                </p>
              </div>

              <div>
                <h2 className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
                  Agency
                </h2>
                <p className="font-serif text-sm leading-relaxed text-foreground">
                  <span className="font-semibold">Connected Archives</span> — From 2023 worldwide
                  representation by licensing agency Connected Archives who is working within the
                  realms of portrait, documentary, fashion, and fine-art photography pictures live on
                  the pages of renowned newspapers and magazines.
                </p>
                <p className="font-sans text-[10px] text-muted-foreground mt-3 tracking-wide">
                  2023 — worldwide
                </p>
              </div>
            </motion.section>

            {/* Memberships */}
            <motion.section
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
                Memberships
              </h2>
              <div className="space-y-0">
                <div className="grid grid-cols-[60px_1fr_1fr] md:grid-cols-[80px_1fr_1fr] gap-x-4 py-3 border-b border-border/40 border-t">
                  <span className="font-sans text-xs text-muted-foreground tabular-nums pt-0.5">2022</span>
                  <span className="font-serif text-sm leading-relaxed text-foreground">
                    <span className="font-semibold">Bjørka</span> — Member of Bjørka Foundation,
                    photographic collective and studio for analogue camera based artist
                  </span>
                  <span className="font-sans text-xs text-muted-foreground pt-0.5 text-right md:text-left">
                    Oslo (NO)
                  </span>
                </div>
                <div className="grid grid-cols-[60px_1fr_1fr] md:grid-cols-[80px_1fr_1fr] gap-x-4 py-3 border-b border-border/40">
                  <span className="font-sans text-xs text-muted-foreground tabular-nums pt-0.5">2019</span>
                  <span className="font-serif text-sm leading-relaxed text-foreground">
                    <span className="font-semibold">Forbundet Frie Fotografer (FFF)</span> — member
                    of The Norwegian Association for Fine Art Photographers
                  </span>
                  <span className="font-sans text-xs text-muted-foreground pt-0.5 text-right md:text-left">
                    Oslo (NO)
                  </span>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="nav-link">© 2025 Jan Khür</span>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/jankhur" target="_blank" rel="noopener noreferrer" className="nav-link">
              Instagram
            </a>
            <a href="mailto:jankhur@gmail.com" className="nav-link">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
