import { BigPicture } from "./components/BigPicture";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { MenuContainer } from "./components/MenuContainer";

export default function Home() {
  return (
    <div className="bg-[#404040]">
      <Header user={true} />
      <BigPicture />
      <MenuContainer />
      <Footer />
    </div>
  );
}
