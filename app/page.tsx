import PlantOfDay from "@/app/components/plantOfDay";
import PopularPlants from "@/app/components/popularPlants";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="Banner text-white h-[100vh] flex flex-col justify-center">
        <div className="fae h-[35vh]"></div>
        <h1 className="faerity text-[10rem] text-pink text-center leading-15">
          Faerity
        </h1>
        <div className="flex flex-col justify-center w-full">
          <p className="text-4xl font-serif text-center italic mt-10">
            Hey, it&apos;s me, it&apos;s Faerity! I know everything...
          </p>
          <div className="SearchBar flex justify-center py-5">
            <input
              className="h-[7vh] w-[75vw] font-serif text-dark-green"
              id="searchInput"
              type="text"
              placeholder="I know about a million things..."
            />
          </div>
          <p className="text-lg font-serif text-center italic pb-10">
            about plants
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 font-serif text-pink sm:px-10">
        <PlantOfDay />
        <PopularPlants />
      </main>
      <footer className="bg-[#4e314f] py-3 text-[#85b19b]">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm">
            Disclaimer: Please be wary of trying a new plant due to the
            potential risks involved. Some of these plants can be toxic or
            cause allergic reactions.
          </p>
        </div>
      </footer>
    </div>
  );
}
