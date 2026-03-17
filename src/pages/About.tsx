import { motion } from "framer-motion";
import Header from "@/components/Header";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const exhibitions = [
{
  section: "Solo Exhibitions",
  items: [
  { title: "Imagine Being There Right Now", year: "2012", venue: "TOAST Gallery, Zlin (CZ)" }]

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
  { title: "UTB Graduation Show BcA.", year: "2012", venue: "Factory Gallery, Zlin (CZ)" }]

}];


const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 md:pt-40 pb-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8 }}
            className="mb-20 md:mb-28">
            
            <h1 className="font-serif text-4xl md:text-5xl mb-8">Jan Khür</h1>
            <div className="font-sans text-sm tracking-wide space-y-1 text-muted-foreground">
              <p>
                <a
                  href="https://www.instagram.com/jankhur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors font-serif text-primary text-2xl">
                  
                  @jankhur
                </a>
              </p>
              <p className="font-serif text-primary text-2xl">(+47) 98 642 904</p>
              <p className="text-primary text-2xl">
                <a href="mailto:jankhur@gmail.com" className="hover:text-foreground transition-colors font-serif">
                  jankhur@gmail.com
                </a>
              </p>
              <p className="font-serif text-primary text-2xl">Oslo, Norway</p>
            </div>
          </motion.div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {/* Exhibitions */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}>
              
              <h2 className="font-sans text-xs uppercase tracking-[0.2em] mb-10 text-foreground">
                Exhibitions
              </h2>
              {exhibitions.map((group) =>
              <div key={group.section} className="mb-10">
                  <h3 className="font-sans text-xs uppercase tracking-[0.15em] mb-6 text-muted-foreground">
                    {group.section}
                  </h3>
                  <div className="space-y-5">
                    {group.items.map((item, i) =>
                  <div key={i}>
                        <p className="font-serif text-base leading-relaxed">{item.title}</p>
                        <p className="font-sans text-xs text-muted-foreground mt-1">
                          {item.year} — {item.venue}
                        </p>
                      </div>
                  )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Studio & Agency */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}>
              
              <h2 className="font-sans text-xs uppercase tracking-[0.2em] mb-10 text-foreground">
                Studio
              </h2>
              <div className="mb-14">
                <p className="font-serif text-base leading-relaxed">
                  <a
                    href="https://abrakadabra.studio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:opacity-50 transition-opacity">
                    
                    Abrakadabra
                  </a>{" "}
                  provides photographic services and creative direction. It was founded by Jan Khür
                  and Julie Hrnčířová in Oslo in 2021. With a focus on playfulness, honesty and
                  originality.
                </p>
              </div>

              <h2 className="font-sans text-xs uppercase tracking-[0.2em] mb-10 text-foreground">
                Agency
              </h2>
              <div className="mb-14">
                <p className="font-serif text-base leading-relaxed">
                  <span className="font-semibold">Connected Archives</span> — From 2023 worldwide
                  representation by licensing agency Connected Archives who is working within the
                  realms of portrait, documentary, fashion, and fine-art photography pictures live on
                  the pages of renowned newspapers and magazines.
                </p>
                <p className="font-sans text-xs text-muted-foreground mt-2">2023 — worldwide</p>
              </div>
            </motion.div>

            {/* Memberships */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}>
              
              <h2 className="font-sans text-xs uppercase tracking-[0.2em] mb-10 text-foreground">
                Memberships
              </h2>
              <div className="space-y-10">
                <div>
                  <p className="font-serif text-base leading-relaxed">
                    <span className="font-semibold">Bjørka</span> — Member of Bjørka Foundation,
                    photographic collective and studio for analogue camera based artist
                  </p>
                  <p className="font-sans text-xs text-muted-foreground mt-2">2022 — Oslo (NO)</p>
                </div>
                <div>
                  <p className="font-serif text-base leading-relaxed">
                    <span className="font-semibold">Forbundet Frie Fotografer (FFF)</span> — member
                    of The Norwegian Association for Fine Art Photographers
                  </p>
                  <p className="font-sans text-xs text-muted-foreground mt-2">2019 — Oslo (NO)</p>
                </div>
              </div>
            </motion.div>
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
    </div>);

};

export default About;