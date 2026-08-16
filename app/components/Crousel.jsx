"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./motion";
import { Spinner } from "./ui";

const Crousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/carousel");
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        setImages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch carousel images:", err);
        setError("These images didn't load. Refresh the page to try again.");
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" label="Loading photographs" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="shell flex min-h-[24vh] items-center justify-center text-sm text-ink-soft">
        {error}
      </p>
    );
  }

  if (images.length === 0) {
    return (
      <p className="shell flex min-h-[24vh] items-center justify-center text-sm text-ink-soft">
        New photographs are being added — check the portfolio in the meantime.
      </p>
    );
  }

  return (
    <div className="shell grid grid-cols-1 gap-0 md:grid-cols-2">
      {images.map((image, index) => {
        const isFeature = index === images.length - 1 && images.length % 2 !== 0;

        return (
          <Reveal
            as="figure"
            key={image._id}
            className={`frame ${isFeature ? "md:col-span-2" : ""}`}
          >
            <Link
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`photo-tile group relative block overflow-hidden bg-paper-2 ${
                isFeature ? "h-[50vh] md:h-[76vh]" : "h-[42vh] md:h-[56vh]"
              }`}
            >
              <Image
                src={image.url}
                alt={image.info || "Archi photograph"}
                fill
                quality={70}
                loading={index < 2 ? "eager" : "lazy"}
                sizes={
                  isFeature
                    ? "(min-width: 1536px) 1440px, 100vw"
                    : "(min-width: 1536px) 720px, (min-width: 768px) 50vw, 100vw"
                }
                style={{ objectFit: "cover" }}
                className="photo-tile-image"
              />
              <figcaption className="photo-tile-caption">
                <span className="truncate">{image.info}</span>
                <span className="tabular-nums">{image.number}</span>
              </figcaption>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
};

export default Crousel;
