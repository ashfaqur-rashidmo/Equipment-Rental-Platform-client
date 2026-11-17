import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
};

const steps = [
  {
    title: "Find your equipment",
    description:
      "Search and filter approved equipment by category, location, price and rental type.",
  },
  {
    title: "Book and pay securely",
    description:
      "Pick your rental dates, confirm the booking and pay safely through Stripe Checkout.",
  },
  {
    title: "Pick up or get it delivered",
    description:
      "Coordinate with the owner for pickup or delivery at your scheduled address.",
  },
];

export default function HowItWorksPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
        How It Works
      </h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-bold text-primary-content">
              {index + 1}
            </span>
            <h2 className="mt-4 text-lg font-semibold text-base-content">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-base-content/70">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
