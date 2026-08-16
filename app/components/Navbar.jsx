"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SECTION_LINKS = [
  { title: "Work", tag: "work" },
  { title: "Services", tag: "services" },
  { title: "Hours", tag: "hours" },
  { title: "Contact", tag: "contact" },
];

const Navbar = ({ variant = "home" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const panelRef = useRef(null);
  const sectionLinks = variant === "home" ? SECTION_LINKS : [];
  const menuItems = [...sectionLinks, { title: "Portfolio", href: "/portfolio" }];

  const scrollToElement = (e, id) => {
    const element = document.getElementById(id);
    if (!element) return;
    e.preventDefault();
    setIsMenuOpen(false);
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && setIsMenuOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  return (

    <nav className="sticky top-0 z-50 border-b border-rule bg-paper [contain:layout_paint]">
      <div className="shell flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="text-sm font-medium tracking-[0.24em] uppercase">
          Archi
        </Link>

        <button
          type="button"
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.94] md:hidden"
          aria-controls="nav-panel"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="relative block h-3 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                isMenuOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                isMenuOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          {sectionLinks.map((item) => (
            <li key={item.tag}>
              <Link
                href={`#${item.tag}`}
                className="link-underline"
                onClick={(e) => scrollToElement(e, item.tag)}
              >
                {item.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/portfolio" className="link-underline">
              Portfolio
            </Link>
          </li>
          <li>
            <Link
              href="/form"
              className="inline-flex h-9 items-center border border-ink px-4 transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-ink hover:text-paper active:scale-[0.97]"
            >
              Book now
            </Link>
          </li>
        </ul>
      </div>

      <div
        id="nav-panel"
        ref={panelRef}
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`grid overflow-hidden border-t border-rule transition-[grid-template-rows,opacity] duration-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden ${
          isMenuOpen
            ? "grid-rows-[1fr] border-rule opacity-100"
            : "grid-rows-[0fr] border-transparent opacity-0"
        }`}
      >
        <ul className="shell flex min-h-0 flex-col py-3 text-lg">
          {menuItems.map((item, i) => (
            <li
              key={item.href ?? item.tag}
              className="border-b border-rule/60 py-3 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? "translateY(0)" : "translateY(-6px)",
                transitionDelay: `${isMenuOpen ? 60 + i * 35 : 0}ms`,
              }}
            >
              <Link
                href={item.href ?? `#${item.tag}`}
                onClick={(e) =>
                  item.tag ? scrollToElement(e, item.tag) : setIsMenuOpen(false)
                }
              >
                {item.title}
              </Link>
            </li>
          ))}
          <li className="py-4">
            <Link
              href="/form"
              onClick={() => setIsMenuOpen(false)}
              className="inline-flex h-11 items-center border border-ink px-5 text-base transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
            >
              Book now
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
