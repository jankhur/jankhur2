import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import GalleryFeed from "@/components/GalleryFeed";
import { japanImages, southAfricaImages, type JourneyImage } from "@/data/journeyData";

const galleryMap: Record<string, { images: JourneyImage[]; title: string }> = {
  japan: { images: japanImages, title: "Japan" },
  "south-africa": { images: southAfricaImages, title: "South Africa" },
};

const JourneyGallery = () => {
  const { slug } = useParams<{ slug: string }>();
  const gallery = galleryMap[slug || ""];

  if (!gallery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Header showName />
        <p className="text-foreground">Gallery not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showName />

      <main className="pt-28 pb-32">
        <GalleryFeed
          images={gallery.images}
          title={gallery.title}
        />
      </main>

      <div className="fixed bottom-8 left-6 md:left-10 z-30 pointer-events-none">
        <span className="font-serif text-sm text-foreground">
          <span className="font-bold">{gallery.title}</span>
        </span>
      </div>
    </div>
  );
};

export default JourneyGallery;
