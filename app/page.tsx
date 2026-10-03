import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main className="flex flex-1 w-full flex-col items-center justify-between py-32 px-16">
        {/* Banner */}
        <div className="Banner text-4xL font-bold text-#85b19b background-#4e314f">
          Faerity
        </div>
        {/*popular recipes / recipe per season or something idk chat*/}
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Popular recipes
          </h1>
          {/* carousel of the recipes */}

          {/*DISCLAIMER CUZ WE AINT KILLING NOBODY*/}
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            We are not responsible for any harm caused by the recipes on this website. Please use caution and follow all safety guidelines when preparing and consuming food.
            There could be mistakes within the plants information porvided, please do your own research and use your own discretion when using the information provided.
          </p>
        </div>
        {/* Footer  (mmmm feet~)*/}
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
         meow
          meow
        </div>
      </main>
    </div>
  );
}
