import AskForm from "./askForm";

type AskPageProps = {
  searchParams: Promise<{ query?: string | string[] }>;
};

export default async function AskPage({ searchParams }: AskPageProps) {
  const { query } = await searchParams;
  const initialQuery = Array.isArray(query) ? query[0] ?? "" : query ?? "";

  return <AskForm initialQuery={initialQuery} />;
}
