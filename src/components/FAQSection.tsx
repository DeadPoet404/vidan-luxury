import {
  ArrowUpRight,
  MessageCircle,
  Plus,
} from "lucide-react";

const frequentlyAskedQuestions = [
  {
    question:
      "How do I check whether a residence is available?",
    answer:
      "Complete the availability form with your dates, number of guests and preferred residence. It opens a prepared WhatsApp message so the Vidan team can confirm the best available option directly with you.",
  },
  {
    question:
      "Is sending an enquiry the same as making a reservation?",
    answer:
      "No. An enquiry does not hold or confirm a residence. Your reservation is confirmed only after the Vidan team verifies availability, shares the final rate and provides the required payment and confirmation details.",
  },
  {
    question:
      "Are the USD and GHS prices on the website final?",
    answer:
      "The displayed rates are indicative starting prices. Final pricing can vary by residence, dates, length of stay and peak-season demand. The team will confirm the applicable rate before you make any payment.",
  },
  {
    question:
      "Can I make an enquiry if I am outside Ghana?",
    answer:
      "Yes. International guests can use the same WhatsApp enquiry flow and enter a phone number with their country code. The team can discuss the stay, rate and reservation steps with you before you arrive in Accra.",
  },
  {
    question:
      "When will I receive the exact apartment address?",
    answer:
      "The website shows the neighbourhood rather than a private check-in address. Exact arrival and access details are shared directly after the residence and reservation have been confirmed.",
  },
  {
    question:
      "Do all Vidan residences include the same amenities?",
    answer:
      "Amenities vary by residence. Wi-Fi, fitted kitchens, security, parking, pools, gyms and housekeeping should be confirmed for the specific apartment you want before completing your reservation.",
  },
  {
    question:
      "Can I request a longer or extended stay?",
    answer:
      "Yes. Select extended stay in the enquiry form and include your preferred dates. The team will confirm suitable residences, longer-stay availability and the applicable rate.",
  },
  {
    question:
      "How early should I enquire for December?",
    answer:
      "December is a peak booking period in Accra, so early enquiries receive the widest choice of residences and dates. Submit your preferred dates as soon as your travel plans are reasonably clear.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="relative z-10 scroll-mt-24 border-t border-white/10 bg-[var(--background)]"
    >
      <div className="container-page py-28 sm:py-36">
        <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="eyebrow">
              Guest Information
            </p>

            <h2 className="mt-5 text-4xl font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              Before you
              <br />
              arrive.
            </h2>

            <p className="mt-8 max-w-md text-sm leading-7 text-[var(--muted)]">
              Clear answers about availability, rates
              and the direct-booking process, so you
              know what happens before any payment is
              made.
            </p>

            <div className="mt-10 border border-white/10 bg-[var(--surface)] p-6">
              <span className="flex h-10 w-10 items-center justify-center border border-[var(--gold)]/40 text-[var(--gold)]">
                <MessageCircle size={17} />
              </span>

              <h3 className="mt-5 text-xl font-light">
                Still have a question?
              </h3>

              <p className="mt-3 text-xs leading-6 text-white/40">
                Speak directly with the bookings team
                for questions about a specific
                apartment, date or request.
              </p>

              <a
                href="https://wa.me/233591581142?text=Hello%20Vidan%20Luxury%20Apartments%2C%20I%20have%20a%20question%20about%20a%20stay."
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--gold)]"
              >
                Ask on WhatsApp

                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>

          <div className="border-t border-white/10">
            {frequentlyAskedQuestions.map(
              (item, index) => (
                <details
                  key={item.question}
                  className="group border-b border-white/10"
                >
                  <summary className="grid cursor-pointer list-none grid-cols-[auto_1fr_auto] items-center gap-4 py-6 marker:content-none sm:gap-6 sm:py-7 [&::-webkit-details-marker]:hidden">
                    <span className="text-[8px] tracking-[0.18em] text-[var(--gold)]">
                      {String(index + 1).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <h3 className="text-sm font-light leading-6 text-white/75 transition group-open:text-white sm:text-base">
                      {item.question}
                    </h3>

                    <span className="flex h-8 w-8 items-center justify-center border border-white/10 text-white/35 transition group-open:border-[var(--gold)]/50 group-open:text-[var(--gold)]">
                      <Plus
                        size={14}
                        className="transition-transform duration-300 group-open:rotate-45"
                      />
                    </span>
                  </summary>

                  <div className="grid grid-cols-[auto_1fr] gap-4 pb-7 sm:gap-6">
                    <span
                      className="w-4 sm:w-5"
                      aria-hidden="true"
                    />

                    <p className="max-w-2xl pr-4 text-xs leading-6 text-white/40 sm:text-sm sm:leading-7">
                      {item.answer}
                    </p>
                  </div>
                </details>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
