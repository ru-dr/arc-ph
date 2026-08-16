"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Lenis from "lenis";
import Navbar from "../components/Navbar-port";
import Footer from "../components/Footer";
import { Spinner } from "../components/ui";
import { Intro, MaskedLine, Reveal } from "../components/motion";

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error:", err);
        setError("The project list didn't load. Refresh the page to try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const lenis = new Lenis({ lerp: 0.12, syncTouch: false });
    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Navbar />

      <header className="shell pt-12 pb-10 md:pt-20 md:pb-16">
        <h1 className="display text-[clamp(3rem,11vw,9rem)]">
          <MaskedLine>Portfolio</MaskedLine>
        </h1>
        <Intro delay={0.22} className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-rule pt-4">
          <p className="measure text-sm text-ink-soft md:text-base">
            Property, interior and architectural shoots, most recent first.
            Each cover opens the full collection.
          </p>
          <p className="text-sm text-ink-soft tabular-nums">
            {loading ? "Loading" : `${projects.length} projects`}
          </p>
        </Intro>
      </header>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" label="Loading projects" />
        </div>
      ) : error ? (
        <p className="shell flex min-h-[30vh] items-center justify-center text-sm text-ink-soft">
          {error}
        </p>
      ) : projects.length === 0 ? (
        <div className="shell flex min-h-[30vh] flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-ink-soft">
            No projects published yet. New work goes up here first.
          </p>
          <Link
            href="/form"
            className="inline-flex h-11 items-center border border-ink px-6 text-sm transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-ink hover:text-paper active:scale-[0.97]"
          >
            Book a shoot
          </Link>
        </div>
      ) : (
        <div className="shell grid grid-cols-1 gap-0 md:grid-cols-2">
          {projects.map((project, index) => {
            const isFeature =
              project.fullWidth ||
              (index === projects.length - 1 && projects.length % 2 !== 0);

            return (
              <Reveal
                as="figure"
                key={project._id}
                className={`frame ${isFeature ? "md:col-span-2" : ""}`}
              >
                <Link
                  href={project.collectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`photo-tile group relative block overflow-hidden bg-paper-2 ${
                    isFeature ? "h-[50vh] md:h-[76vh]" : "h-[42vh] md:h-[56vh]"
                  }`}
                >
                  <Image
                    src={project.coverImage}
                    alt={project.projectName}
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
                    <span className="truncate">{project.projectName}</span>
                    <span className="whitespace-nowrap">View collection →</span>
                  </figcaption>
                </Link>
              </Reveal>
            );
          })}
        </div>
      )}

      <p className="shell pt-12 pb-4 text-sm text-ink-soft">
        More work is added as shoots wrap.
      </p>

      <Footer />
    </main>
  );
};

export default Portfolio;
