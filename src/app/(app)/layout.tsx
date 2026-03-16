import { AuthGuard } from "@/components/common/AuthGuard";
import { Navbar } from "@/components/common/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        {children}
      </main>
    </AuthGuard>
  );
}
