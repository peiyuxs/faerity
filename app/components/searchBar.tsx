"use client";

type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "I know about a million things...",
  className = "h-12 w-full",
}: SearchBarProps) {
  return (
    <input
      className={`${className} font-serif text-dark-green`}
      id="searchInput"
      name="query"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={
        onChange ? (event) => onChange(event.target.value) : undefined
      }
    />
  );
}
