import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "./components/generated/Header";
import { Footer } from "./components/generated/Footer";
import { PageCopyProvider } from "./sanity/PageCopyProvider";

export function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      <main className="flex-1 pt-16 md:pt-[72px]">
        <PageCopyProvider>
          <Outlet />
        </PageCopyProvider>
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
}
