import { BigPicture } from "../components/BigPicture";
import { MenuSkeleton } from "../components/skeletons";

export default function Loading() {
  return (
    <div className="bg-[#404040]">
      <BigPicture />
      <MenuSkeleton />
    </div>
  );
}
