import { BottomNav } from "@/components/layouts/bottom-nav";
import { TopBar } from "@/components/layouts/top-bar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <main className="pt-16 pb-24">{children}</main>
      <BottomNav />
    </>
  );
}
