"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Services from "./components/Services";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import { Intro, MaskedLine, Reveal } from "./components/motion";

const Crousel = dynamic(() => import("./components/Crousel"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

const hours = [
  { day: "Monday — Friday", time: "8:00 am – 5:00 pm" },
  { day: "Saturday — Sunday", time: "8:00 am – 5:30 pm" },
];

export default function Home() {


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

      <header className="shell pt-10 pb-16 md:pt-16 md:pb-24">
        <h1 className="display text-[clamp(3.25rem,13vw,11rem)]">
          <MaskedLine>Archi</MaskedLine>
          <MaskedLine delay={0.09} className="italic text-ink-soft">
            Photography
          </MaskedLine>
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-8 border-t border-rule pt-6 md:mt-14 md:grid-cols-12">
          <Intro as="p" delay={0.38} className="measure md:col-span-5 text-base leading-relaxed text-ink-soft md:text-lg">
            An Adelaide studio shooting property, interiors and architecture —
            with 2D and 3D floor plans drawn to match. Rooms photographed the
            way they are lived in.
          </Intro>

          <Intro delay={0.44} className="md:col-span-3 md:col-start-7">
            <p className="kicker">Studio hours</p>
            <p className="mt-2 text-sm">Mon–Fri 8–5 · Sat–Sun 8–5:30</p>
            <p className="mt-1 text-sm text-ink-soft">Adelaide, SA</p>
          </Intro>

          <Intro delay={0.5} className="flex flex-wrap items-center gap-x-6 gap-y-3 md:col-span-3 md:col-start-10 md:justify-end">
            <Link
              href="/form"
              className="inline-flex h-11 items-center border border-ink px-6 text-sm transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-ink hover:text-paper active:scale-[0.97]"
            >
              Book a shoot
            </Link>
            <Link href="#work" className="link-underline text-sm">
              See the work
            </Link>
          </Intro>
        </div>
      </header>

      <div className="shell">
        <Intro delay={0.24} y={24} className="hero-frame relative h-[52vh] overflow-hidden bg-paper-2 md:h-[82vh] [clip-path:inset(0_0_0_0)]">
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=70"
            alt="Sunlit living room with timber floors and large windows"
            fill
            priority
            quality={68}
            sizes="(min-width: 1536px) 1440px, 100vw"
            style={{ objectFit: "cover" }}
          />
        </Intro>
      </div>

      <section id="work" className="pt-20 md:pt-32">
        <div className="shell mb-8 flex items-end justify-between gap-6 border-b border-rule pb-4 md:mb-12">
          <h2 className="display text-3xl md:text-5xl">Selected work</h2>
          <Link href="/portfolio" className="link-underline pb-1 text-sm">
            Every project
          </Link>
        </div>
        <Crousel />
      </section>

      <Services />

      <section id="hours" className="shell pb-20 md:pb-32">
        <h2 className="display border-b border-rule pb-4 text-3xl md:text-5xl">
          Hours
        </h2>
        <dl>
          {hours.map((slot) => (
            <Reveal
              key={slot.day}
              className="flex flex-col gap-1 border-b border-rule py-6 md:flex-row md:items-baseline md:justify-between md:py-8"
            >
              <dt className="text-xl md:text-2xl">{slot.day}</dt>
              <dd className="text-sm text-ink-soft md:text-lg">{slot.time}</dd>
            </Reveal>
          ))}
        </dl>
        <Reveal as="p" className="mt-6 text-sm text-ink-soft">
          For times outside these hours, ask when you get in touch.
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
