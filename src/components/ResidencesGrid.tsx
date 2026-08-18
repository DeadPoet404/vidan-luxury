"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BedDouble,
  Check,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import {
  RESIDENCE_AREAS,
  RESIDENCES,
  type Residence,
} from "@/lib/residences";

const filters = [
  "All",
  ...RESIDENCE_AREAS,
] as const;

type ResidenceFilter = (typeof filters)[number];

const residences: Residence[] = RESIDENCES;


const portfolioFacts = [
  {
    value: "10",
    label: "Published short-let options",
  },
  {
    value: "5",
    label: "Accra neighbourhoods",
  },
  {
    value: "24/7",
    label: "Security at residences",
  },
  {
    value: "Direct",
    label: "WhatsApp booking",
  },
];

export default function ResidencesGrid() {
  const [activeFilter, setActiveFilter] =
    useState<ResidenceFilter>("All");

  const visibleResidences =
    activeFilter === "All"
      ? residences
      : residences.filter(
          (home) => home.area === activeFilter,
        );

  return (
    <>
      <div className="mt-14 grid grid-cols-2 border border-white/10 sm:grid-cols-4">
        {portfolioFacts.map((fact, index) => (
          <div
            key={fact.label}
            className={`p-5 sm:p-6 ${
              index > 0
                ? "sm:border-l sm:border-white/10"
                : ""
            } ${
              index % 2 === 1
                ? "border-l border-white/10"
                : ""
            } ${
              index > 1
                ? "border-t border-white/10 sm:border-t-0"
                : ""
            }`}
          >
            <p className="text-2xl font-light text-white sm:text-3xl">
              {fact.value}
            </p>

            <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-white/35">
              {fact.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-5 border-y border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter residences by neighbourhood"
          className="flex gap-2 overflow-x-auto pb-1 sm:pb-0"
        >
          {filters.map((filter) => {
            const selected = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                aria-pressed={selected}
                aria-controls="residences-grid"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 border px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] transition sm:px-5 ${
                  selected
                    ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                    : "border-white/10 text-white/45 hover:border-white/30 hover:text-white"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <p
          aria-live="polite"
          className="text-[9px] uppercase tracking-[0.16em] text-white/35"
        >
          Showing {visibleResidences.length} featured{" "}
          {visibleResidences.length === 1 ? "stay" : "stays"}
        </p>
      </div>

      <div
        id="residences-grid"
        className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        {visibleResidences.map((home) => (
          <article
            key={`${home.location}-${home.name}`}
            className="group flex h-full flex-col overflow-hidden border border-white/10 bg-[var(--surface)] transition hover:border-white/25"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={home.image}
                alt={`${home.name} by Vidan Luxury Apartments in ${home.location}, Accra`}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/20" />

              <div className="absolute left-4 top-4 flex items-center gap-2 bg-black/70 px-3 py-2 text-[9px] uppercase tracking-[0.15em] text-[var(--gold)] backdrop-blur-sm">
                <MapPin size={11} />
                {home.location}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-2xl font-light leading-tight text-white">
                  {home.name}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-xs text-white/55">
                  <BedDouble size={14} />
                  {home.type}
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap gap-2">
                {home.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-1.5 border border-white/10 px-2.5 py-2 text-[9px] text-white/45"
                  >
                    <Check
                      size={10}
                      className="text-[var(--gold)]"
                    />
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 border-t border-white/10 pt-5">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.15em] text-white/30">
                    USD / night
                  </p>

                  <p className="mt-1 text-lg text-white">
                    {home.priceUsd}
                  </p>
                </div>

                <div className="border-l border-white/10 pl-4">
                  <p className="text-[8px] uppercase tracking-[0.15em] text-white/30">
                    GHS / night
                  </p>

                  <p className="mt-1 text-lg text-white">
                    {home.priceGhs}
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/233591581142?text=${encodeURIComponent(
                  `Hello Vidan Luxury Apartments, I'd like to check availability for the ${home.name} in ${home.location}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Check availability for ${home.name} on WhatsApp`}
                className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[9px] font-semibold uppercase tracking-[0.17em] text-white/55 transition hover:text-[var(--gold)]"
              >
                Check availability

                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-5 text-right text-[10px] leading-5 text-white/35">
        Published portfolio shown. Currency equivalents are indicative and confirmed at the time of booking.
      </p>
    </>
  );
}
