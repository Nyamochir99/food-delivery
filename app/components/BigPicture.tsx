"use client";

import { useEffect, useState } from "react";
import { BigPictureSkeleton } from "./skeletons";

const IMAGE_SRC = "/icons/bigpic.svg";

export const BigPicture = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setLoaded(true);
    img.src = IMAGE_SRC;
  }, []);

  if (!loaded) {
    return <BigPictureSkeleton />;
  }

  return (
    <div
      className="mt-17 h-142.5 w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${IMAGE_SRC})`,
      }}
    />
  );
};
