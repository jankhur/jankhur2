import Header from "@/components/Header";
import GalleryFeed from "@/components/GalleryFeed";
import { arildImages } from "@/data/editorialData";

const EditorialArild = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header showName />

      <main className="pt-28 pb-32">
        <GalleryFeed
          images={arildImages}
          title="Arild Eriksen"
          subtitle="Obos"
        />
      </main>

      {/* Title — fixed bottom-left */}
      <div className="fixed bottom-8 left-6 md:left-10 z-30 pointer-events-none">
        <span className="font-serif text-sm text-foreground">
          <span className="font-bold">Arild Eriksen</span>
          <span className="font-normal text-muted-foreground">, Obos</span>
        </span>
      </div>
    </div>
  );
};

export default EditorialArild;
