"use client";

import {
  ArrowUpRight,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  useEffect,
  useRef,
  useState,
} from "react";

const navigationItems = [
  {
    number: "01",
    label: "Residences",
    href: "#apartments",
  },
  {
    number: "02",
    label: "Experience",
    href: "#experience",
  },
  {
    number: "03",
    label: "Locations",
    href: "#location",
  },
  {
    number: "04",
    label: "December 2026",
    href: "#december",
  },
  {
    number: "05",
    label: "Book direct",
    href: "#book",
  },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen(true)}
        className="flex h-11 w-11 items-center justify-center border border-white/15 text-white transition hover:border-[var(--gold)] hover:text-[var(--gold)] md:hidden"
      >
        <Menu size={18} />
      </button>

      {isOpen
        ? createPortal(
            <div
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed inset-0 z-[100] overflow-y-auto bg-[var(--background)] text-white md:hidden"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 top-28 select-none text-[8rem] font-semibold leading-none tracking-[-0.08em] text-white/[0.025]"
              >
                V
              </div>

              <div className="container-page relative flex min-h-full flex-col py-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <Link
                    href="/"
                    onClick={closeMenu}
                  >
                    <p className="text-base font-semibold tracking-[0.18em]">
                      VIDAN
                    </p>

                    <p className="mt-1 text-[8px] uppercase tracking-[0.28em] text-white/35">
                      Luxury Apartments
                    </p>
                  </Link>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={closeMenu}
                    className="flex h-11 w-11 items-center justify-center border border-white/15 text-white transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav
                  aria-label="Mobile navigation"
                  className="py-10"
                >
                  <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                    Navigate
                  </p>

                  <div className="divide-y divide-white/10 border-y border-white/10">
                    {navigationItems.map(
                      (item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5"
                        >
                          <span className="text-[8px] tracking-[0.18em] text-[var(--gold)]">
                            {item.number}
                          </span>

                          <span className="text-2xl font-light tracking-[-0.03em] text-white/80 transition group-hover:text-white">
                            {item.label}
                          </span>

                          <ArrowUpRight
                            size={17}
                            className="text-white/20 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--gold)]"
                          />
                        </a>
                      ),
                    )}
                  </div>
                </nav>

                <div className="mt-auto border-t border-white/10 pt-7">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">
                    Direct booking support
                  </p>

                  <a
                    href="https://wa.me/233591581142"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="mt-4 flex items-center justify-between bg-[var(--gold)] p-5 text-black"
                  >
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.17em]">
                        WhatsApp Vidan
                      </p>

                      <p className="mt-1 text-xs text-black/55">
                        +233 59 158 1142
                      </p>
                    </div>

                    <MessageCircle size={19} />
                  </a>

                  <div className="mt-5 flex items-center justify-between pb-2 text-[8px] uppercase tracking-[0.16em] text-white/25">
                    <span>East Legon</span>
                    <span>Cantonments</span>
                    <span>Spintex</span>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
