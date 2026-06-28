import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import ResearchHomePage from "@/components/home/ResearchHomePage";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EDEAE3]">
      <TopBar />
      <Sidebar />

      <main className="lg:ml-[220px] lg:mt-[52px] min-h-screen flex flex-col mt-[52px]">
        <ResearchHomePage />
      </main>
    </div>
  );
}