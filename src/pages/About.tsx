import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SketchCursor from "@/components/SketchCursor";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

const nameLetters = [
  { char: "J", line: 0 },
  { char: "A", line: 0 },
  { char: "N", line: 0 },
  { char: "K", line: 1 },
  { char: "H", line: 1 },
  { char: "Ü", line: 1 },
  { char: "R", line: 1 },
];

interface ExhibitionEntry {
  title: string;
  venue: string;
}

interface ExhibitionYear {
  year: string;
  entries: ExhibitionEntry[];
}

const soloExhibitions: ExhibitionYear[] = [
{
  year: "2012",
  entries: [
  { title: "Imagine Being There Right Now", venue: "TOAST Gallery, Zlin (CZ)" }]

}];


const groupExhibitions: ExhibitionYear[] = [
{
  year: "2025",
  entries: [
  { title: "Polagraph Gallery", venue: "group show of represented photographers, Polagraph Gallery, Praha (CZ)" },
  { title: 'Oslo Negative — "Convergence"', venue: "photo festival as part of Bjørka group show, Nasjonalgalleriet i Oslo (NO)" }]

},
{
  year: "2024",
  entries: [
  { title: "Nookart Gallery — Mirror, Mirror", venue: "photo exhibition, Nookart Gallery, Prague (CZ)" },
  { title: "Oslo Negative", venue: "photo festival as part of Bjørka group show, Gamle Veterinar Skole (NO)" },
  { title: 'Forbundet Frie Fotografer "50-årsjubileum"', venue: "Salongutstilling, Fotogalleriet, Oslo (NO)" },
  { title: "Oslo Open — Bjørka", venue: "group show at Bjørka during Oslo Open (NO)" }]

},
{
  year: "2023",
  entries: [
  { title: "Polagraph Gallery", venue: "photo exhibition duo with Julie Hrncirova, Polagraph Gallery, Praha (CZ)" },
  { title: "Oslo Negative — DEMO", venue: "photo festival as part of Bjørka group show, Oslo Negative (NO)" }]

},
{
  year: "2021",
  entries: [
  { title: "Rampen", venue: "photo exhibition duo with Julie Hrncirova, Rampen, Oslo (NO)" },
  { title: "Vinslottet", venue: "photo exhibition duo with Julie Hrncirova, Vinslottet, Oslo (NO)" }]

},
{
  year: "2019",
  entries: [
  { title: "Group Hug n.3", venue: "Low Standarts, Oslo (NO)" }]

},
{
  year: "2017",
  entries: [
  { title: "Disco", venue: "duo exhibition with Marthe Bleu, CYAN Gallery, Oslo (NO)" },
  { title: "KRYSS TVERS", venue: "Skippergata, Oslo (NO)" }]

},
{
  year: "2013",
  entries: [
  { title: "Shuffeling Pixels", venue: "Photogether Gallery, Zlin (CZ)" },
  { title: "Shuffeling Pixels", venue: "Studio Huddle, Toronto (CA)" },
  { title: "TRANSGENDER ME", venue: "during Prague Pride 2013, NTK Gallery, National Library of Technology, Prague (CZ)" },
  { title: "XRXR: Photocopy Philadelphia", venue: "Napoleon Gallery, Philadelphia (USA)" },
  { title: "Czeggs", venue: "Frameless Gallery, London (UK)" }]

},
{
  year: "2012",
  entries: [
  { title: "UTB Graduation Show BcA.", venue: "Factory Gallery, Zlin (CZ)" }]

}];


const memberships: ExhibitionYear[] = [
{
  year: "2022",
  entries: [
  { title: "Bjørka", venue: "Member of Bjørka Foundation, photographic collective and studio for analogue camera based artists, Oslo (NO)" }]

},
{
  year: "2019",
  entries: [
  { title: "Forbundet Frie Fotografer (FFF)", venue: "Member of The Norwegian Association for Fine Art Photographers, Oslo (NO)" }]

}];


function ExhibitionSection({ heading, years }: {heading: string;years: ExhibitionYear[];}) {
  return (
    <motion.section
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mb-16 md:mb-20">
      
      <h2 className="font-serif text-base text-foreground mb-3">{heading}</h2>
      <div className="border-t border-foreground mb-6" />

      <div className="flex flex-col">
        {years.map((yearGroup) =>
        <div key={yearGroup.year} className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] gap-x-4 mb-4">
            <span className="font-serif text-base font-bold text-foreground pt-0.5">
              {yearGroup.year}
            </span>
            <div className="flex flex-col gap-1">
              {yearGroup.entries.map((entry, i) =>
            <p key={i} className="font-serif text-base leading-relaxed text-foreground">
                  <em className="font-semibold">{entry.title}</em>, {entry.venue}
                </p>
            )}
            </div>
          </div>
        )}
      </div>
    </motion.section>);

}

const About = () => {
  const [julieHover, setJulieHover] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header showName />
      <SketchCursor type={julieHover ? "heart" : "about"} />

      <div className="pt-28 md:pt-36 pb-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          {/* Header — Name + Contact */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
            className="mb-16 md:mb-20">
            
            <h1 className="font-serif font-semibold text-4xl text-foreground tracking-tight mb-6 md:text-lg">
              Jan Khür
            </h1>
            <div className="flex flex-col gap-1 font-serif text-base text-foreground">
              <a
                href="https://www.instagram.com/jankhur"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors">
                
                @jankhur
              </a>
              <span>(+47) 98 642 904</span>
              <a href="mailto:jan@abrakadabra.studio" className="hover:text-foreground transition-colors">
                jan@abrakadabra.studio
              </a>
              <span>Oslo, Norway</span>
            </div>
            <p className="font-serif text-base leading-relaxed text-foreground mt-6">
              Oslo-based Czech photographer working across editorial, commercial, and independent art projects. Focused on portraiture, social documentary, and analogue photography.
            </p>
          </motion.div>

          {/* Two-column layout: left half for sections */}
          <div className="md:w-1/2">
            {/* Studio & Agency */}
            <motion.section
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-16 md:mb-20">
              
              <h2 className="font-serif text-base text-foreground mb-3">Studio & Agency</h2>
              <div className="border-t border-foreground mb-6" />

              <div className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] gap-x-4 mb-4">
                <span className="font-serif text-base font-bold text-foreground pt-0.5">Studio</span>
                <p className="font-serif text-base leading-relaxed text-foreground">
                  <a
                    href="https://abrakadabra.studio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-50 transition-opacity">
                    
                    <em className="font-semibold">Abrakadabra</em>
                  </a>{" "}
                  — photographic services and creative direction. Founded by Jan Khür
                  and{" "}
                  <a
                    href="https://juliehrncirova.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-50 transition-opacity"
                    onMouseEnter={() => setJulieHover(true)}
                    onMouseLeave={() => setJulieHover(false)}>
                    
                    Julie Hrnčířová
                  </a>{" "}
                  in Oslo in 2021. Focus on playfulness, honesty and
                  originality.
                </p>
              </div>

              <div className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] gap-x-4">
                <span className="font-serif text-base font-bold text-foreground pt-0.5">Agency</span>
                <p className="font-serif text-base leading-relaxed text-foreground">
                  <em className="font-semibold">Connected Archives</em> — From 2023, worldwide representation by licensing agency,
                  working within the realms of portrait, documentary, fashion,
                  and fine-art photography.
                </p>
              </div>
            </motion.section>

            {/* Memberships */}
            <ExhibitionSection heading="Memberships" years={memberships} />

            {/* Group Exhibitions */}
            <ExhibitionSection heading="Group Exhibitions" years={groupExhibitions} />

            {/* Solo Exhibitions */}
            <ExhibitionSection heading="Solo Exhibitions" years={soloExhibitions} />
          </div>
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
    </div>);

};

export default About;