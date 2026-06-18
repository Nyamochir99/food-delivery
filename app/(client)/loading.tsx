import { BigPictureSkeleton, MenuSkeleton } from "../components/skeletons";

export default function Loading() {
  return (
    <div className="bg-[#404040]">
      <BigPictureSkeleton />
      <MenuSkeleton />
    </div>
  );
}
