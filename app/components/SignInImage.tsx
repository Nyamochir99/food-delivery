"use client";

import { useEffect, useState } from "react";
import { SignInImageSkeleton } from "./skeletons";

const IMAGE_SRC = "/icons/bg.svg";

export const SignInImage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setLoaded(true);
    img.src = IMAGE_SRC;
  }, []);

  if (!loaded) {
    return <SignInImageSkeleton />;
  }

  return (
    <div
      className="h-226 w-214 shrink-0 overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${IMAGE_SRC})` }}
    />
  );
};
