import { motion } from "framer-motion";
import Header from "@/components/Header";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
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
      <Header showName />

      <div className="pt-28 md:pt-36 pb-24 px-6 md:px-10">
        <div className="max-w-3xl mx-auto">
          {/* Header — Name + Contact stacked */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-20"
          >
            <h1 className="font-serif font-semibold text-4xl md:text-5xl text-foreground tracking-tight mb-6">
              Jan Khür
            </h1>
            <div className="flex flex-col gap-1 font-serif text-base text-foreground">
              <a
                href="https://www.instagram.com/jankhur"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                @jankhur
              </a>
              <span>(+47) 98 642 904</span>
              <a href="mailto:jan@abrakadabra.studio" className="hover:text-foreground transition-colors">
                jan@abrakadabra.studio
              </a>
              <span>Oslo, Norway</span>
            </div>
          </motion.div>

          {/* Studio & Agency — first, side by side */}
          <motion.section
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 md:mb-20"
          >
            <div>
              <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                Studio
              </h2>
              <p className="font-serif text-base leading-relaxed text-foreground">
                <a
                  href="https://abrakadabra.studio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:opacity-50 transition-opacity"
                >
                  Abrakadabra
                </a>{" "}
                provides photographic services and creative direction. Founded by Jan Khür
                and Julie Hrnčířová in Oslo in 2021. With a focus on playfulness, honesty and
                originality.
              </p>
            </div>

            <div>
              <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                Agency
              </h2>
              <p className="font-serif text-base leading-relaxed text-foreground">
                <span className="font-semibold">Connected Archives</span> — From 2023 worldwide
                representation by licensing agency Connected Archives, working within the
                realms of portrait, documentary, fashion, and fine-art photography.
              </p>
              <p className="font-serif text-xs text-muted-foreground mt-2 tracking-wide">
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
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-20"
          >
            <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-foreground mb-4">
              Memberships
            </h2>
            <div>
              {[
                {
                  year: "2022",
                  name: "Bjørka",
                  desc: "Member of Bjørka Foundation, photographic collective and studio for analogue camera based artists",
                  location: "Oslo (NO)",
                },
                {
                  year: "2019",
                  name: "Forbundet Frie Fotografer (FFF)",
                  desc: "Member of The Norwegian Association for Fine Art Photographers",
                  location: "Oslo (NO)",
                },
              ].map((m, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[50px_1fr] gap-x-4 py-2.5 border-b border-border/40 first:border-t"
                >
                   <span className="font-serif text-sm text-muted-foreground tabular-nums">
                    {m.year}
                  </span>
                  <span className="font-serif text-base leading-relaxed text-foreground">
                    <span className="font-semibold">{m.name}</span> — {m.desc}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Exhibitions — constrained width, two-column grid */}
          <motion.section
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {exhibitions.map((group) => (
              <div key={group.section} className="mb-12 last:mb-0">
                <h2 className="font-serif text-xs uppercase tracking-[0.2em] text-foreground mb-4">
                  {group.section}
                </h2>
                <div>
                  {group.items.map((item, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[50px_1fr] gap-x-4 py-2 border-b border-border/40 first:border-t"
                    >
                      <span className="font-serif text-sm text-muted-foreground tabular-nums">
                        {item.year}
                      </span>
                      <div>
                        <span className="font-serif text-base leading-relaxed text-foreground">
                          {item.title}
                        </span>
                        <span className="font-serif text-xs text-muted-foreground ml-2">
                          {item.venue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.section>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="font-serif text-sm text-muted-foreground">© 2025 Jan Khür</span>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/jankhur" target="_blank" rel="noopener noreferrer" className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors">
              Instagram
            </a>
            <a href="mailto:jan@abrakadabra.studio" className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
