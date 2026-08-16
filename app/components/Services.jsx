"use client";
import React from "react";
import Link from "next/link";
import { Reveal } from "./motion";

const services = [
  {
    title: "Photography",
    detail:
      "Property, interior and architectural shoots. Natural light where it works, flash where it doesn't, and framing that keeps rooms honest.",
    meta: "Half or full day",
  },
  {
    title: "Floor plan · 2D black & white",
    detail:
      "A clean structural read of the property. Room labels, dimensions and flow, drawn for listings, renovations and management files.",
    meta: "From measure or sketch",
  },
  {
    title: "Floor plan · 2D colour",
    detail:
      "The same precision with tone doing the work — zoning, materials and furniture read at a glance in a listing scroll.",
    meta: "Colour and labelling to suit",
  },
  {
    title: "Floor plan · 3D",
    detail:
      "A dimensional view for spaces that are hard to picture flat. Useful for off-plan sales, renovations and design presentations.",
    meta: "Rendered per level",
  },
];

const Services = () => {
  return (
    <section id="services" className="shell py-20 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
        <h2 className="display text-3xl md:text-5xl">Services</h2>
        <Link href="/form" className="link-underline pb-1 text-sm">
          Request a quote
        </Link>
      </div>

      <dl>
        {services.map((service) => (
          <Reveal
            key={service.title}
            className="grid grid-cols-1 gap-3 border-b border-rule py-8 md:grid-cols-12 md:gap-8 md:py-12"
          >
            <dt className="md:col-span-5">
              <span className="display-sm block text-xl md:text-3xl">
                {service.title}
              </span>
              <span className="mt-2 block text-xs text-ink-soft">
                {service.meta}
              </span>
            </dt>
            <dd className="measure text-sm leading-relaxed text-ink-soft md:col-span-6 md:col-start-7 md:text-base">
              {service.detail}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
};

export default Services;
