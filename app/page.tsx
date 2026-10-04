import PlantOfHour from "@/app/components/plantOfHour";
import PopularPlants from "@/app/components/popularPlants";
import ExplorePlants from "@/app/components/explorePlants";
import SearchBar from "@/app/components/searchBar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="Banner text-white h-[100vh] flex flex-col justify-center">
        <div className="fae h-[35vh]"></div>
        <Link href="/" aria-label="Faerity home">
          <h1 className="faerity text-[10rem] text-pink text-center leading-15">
            Faerity
          </h1>
        </Link>
        <div className="flex flex-col justify-center w-full">
          <p className="text-4xl font-serif text-center italic mt-10">
            Hey, it&apos;s me, it&apos;s Faerity! I know everything...
          </p>
          <form action="/ask" method="get" className="flex justify-center py-5">
            <SearchBar
              className="h-[7vh] w-[75vw]"
            />
          </form>
          <p className="text-lg font-serif text-center italic pb-10">
            about plants
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 font-serif text-pink sm:px-10">
        <PlantOfHour />
        <PopularPlants />
        <ExplorePlants />
      </main>
      {/* Footer */}
      <footer className="bg-[#4e314f] text-[#85b19b] py-3">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">Disclaimer: Please be wary of trying a new plant due to the potential risks involved.
            Some of these plants can be toxic or cause allergic reactions.</p>
        </div>
      </footer>
    </div>
  );
}
