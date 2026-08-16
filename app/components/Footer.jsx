import React from "react";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-rule bg-paper">
      <div className="shell grid grid-cols-1 gap-10 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-6">
          <p className="display text-[clamp(2rem,6vw,4.5rem)]">
            Booking a shoot?
          </p>
          <p className="measure mt-4 text-base text-ink-soft">
            Send through the property address and the dates that suit, and
            we&apos;ll take it from there.
          </p>
          <Link
            href="/form"
            className="mt-8 inline-flex h-12 items-center border border-ink px-7 text-sm transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-ink hover:text-paper active:scale-[0.97]"
          >
            Start a booking
          </Link>
        </div>

        <div className="md:col-span-3 md:col-start-8">
          <p className="kicker">Contact</p>
          <div className="mt-3 flex flex-col gap-2 text-base">
            <Link href="tel:+61404098419" className="link-underline w-fit">
              +61 404 098 419
            </Link>
            <Link
              href="mailto:sales@archiphotography.com"
              className="link-underline w-fit break-all"
            >
              sales@archiphotography.com
            </Link>
          </div>
        </div>

        <div className="md:col-span-2 md:col-start-11">
          <p className="kicker">Studio</p>
          <p className="mt-3 text-base">Adelaide</p>
          <p className="text-base text-ink-soft">South Australia</p>
        </div>
      </div>

      <div className="shell flex flex-col gap-1 border-t border-rule py-6 text-xs text-ink-soft md:flex-row md:justify-between">
        <p>&#169; {year} Archi Photography</p>
        <p>Property, interiors, floor plans</p>
      </div>
    </footer>
  );
};

export default Footer;
