import { BigPicture } from "../components/BigPicture";
import { MenuContainer } from "../components/MenuContainer";

export default function Home() {
  return (
    <div className="bg-[#404040]">
      <BigPicture />
      <MenuContainer />
    </div>
  );
}
