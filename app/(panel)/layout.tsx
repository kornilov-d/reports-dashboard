import Sidebar from "@/components/shell/Sidebar";
import TopBar from "@/components/shell/TopBar";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar eventTitle="The Business of Football – Philippines" />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
