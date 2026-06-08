import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { ScrollToTop } from "../components/ScrollToTop";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <ScrollToTop />
      <Footer />
    </>
  );
}
