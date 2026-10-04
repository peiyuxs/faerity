import SearchBar from "@/app/components/searchBar";
import Link from "next/link";

type SearchHeaderProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function SearchHeader({
  value,
  onChange,
  onSubmit,
}: SearchHeaderProps) {
  return (
    <header className="Banner flex h-30 items-center gap-8 pl-6 pr-10 text-white">
      <div className="flex h-full w-auto shrink-0 flex-row items-center gap-2">
        <Link href="/" aria-label="Faerity home" className="flex h-full items-center gap-2">
          <div className="fae h-full w-28 shrink-0" />
          <span className="faerity shrink-0 text-4xl text-pink sm:text-5xl">
            Faerity
          </span>
        </Link>
      </div>
      <form
        onSubmit={onSubmit}
        className="SearchBar min-w-0 flex-1"
      >
        <SearchBar
          value={value}
          onChange={onChange}
          placeholder="I know everything..."
        />
      </form>
    </header>
  );
}
