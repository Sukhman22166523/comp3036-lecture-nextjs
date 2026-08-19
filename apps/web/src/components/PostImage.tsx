"use client";

import { useEffect, useState } from "react";

type PostImageProps = {
  imageUrl?: string;
  alt: string;
  width?: number;
  height?: number;
};

export default function PostImage({
  imageUrl,
  alt,
  width = 300,
  height = 200,
}: PostImageProps) {
  const [src, setSrc] = useState(
    imageUrl || "/placeholder.webp",
  );

  useEffect(() => {
    if (imageUrl) {
      setSrc(imageUrl);
      return;
    }

    let cancelled = false;

    async function getRandomDog() {
      try {
        const response = await fetch(
          "https://dog.ceo/api/breeds/image/random",
        );

        if (!response.ok) {
          throw new Error("Could not fetch random dog image");
        }

        const data = (await response.json()) as {
          message: string;
          status: string;
        };

        if (!cancelled && data.message) {
          setSrc(data.message);
        }
      } catch {
        if (!cancelled) {
          setSrc("/placeholder.webp");
        }
      }
    }

    void getRandomDog();

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  );
}
