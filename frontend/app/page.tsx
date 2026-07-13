import HomeContent from "@/components/HomeContent";
import { getPapers } from "@/lib/paperApi";

export const revalidate = 60; // ISR instead of edge serverless

export default async function Home() {
  try {
    const initialPapers = await getPapers({ page: 1, sort: "latest", period: "all" });
    return <HomeContent initialPapers={initialPapers} />;
  } catch (error) {
    console.error("Failed to load initial papers:", error);
    return (
      <HomeContent
        initialPapers={null}
        initialError="Failed to load papers. Please try again later."
      />
    );
  }
}
