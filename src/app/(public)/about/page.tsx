import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  BadgeCheck,
  Building2,
  CalendarClock,
  DollarSign,
  Forklift,
  Heart,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about EquipRent — the equipment rental marketplace connecting owners with customers through transparent pricing and secure payments.",
};

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Owners",
    description:
      "Every equipment owner is verified so you rent from trusted sources.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description:
      "Clear daily, weekly and monthly rates with no hidden charges.",
  },
  {
    icon: Truck,
    title: "Flexible Rentals",
    description:
      "Rent for a day, a week or longer — on your schedule.",
  },
  {
    icon: Heart,
    title: "Secure Payments",
    description:
      "Pay safely with Stripe, protected by buyer and seller guarantees.",
  },
];

const steps = [
  {
    icon: Forklift,
    title: "List your equipment",
    description:
      "Owners create a listing with photos, pricing and availability in minutes.",
  },
  {
    icon: CalendarClock,
    title: "Browse & book",
    description:
      "Customers search verified listings and book the equipment they need.",
  },
  {
    icon: DollarSign,
    title: "Pay securely",
    description:
      "Pay online with Stripe — funds are held safely until the rental ends.",
  },
  {
    icon: User,
    title: "Pick up or deliver",
    description:
      "Collect the equipment or arrange delivery with the owner.",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          <BadgeCheck className="h-3 w-3" aria-hidden /> Verified marketplace
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-base-content sm:text-5xl mb-4">
          About {siteConfig.name}
        </h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          {siteConfig.description}
        </p>
      </div>

      {/* Intro */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-base-content">
            Built for equipment owners and renters
          </h2>
          <p className="text-base text-base-content/70 leading-relaxed">
            {siteConfig.name} was created to solve a simple problem: equipment
            sits idle most of the year, while people who need it struggle to
            find affordable, trustworthy rentals. We connect the two — so
            owners can earn from their idle gear and customers can rent what
            they need, when they need it.
          </p>
          <p className="text-base text-base-content/70 leading-relaxed">
            From construction machinery and agricultural tools to photography
            gear and event supplies, our goal is to make renting equipment as
            easy as booking a room.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-64 w-full max-w-md rounded-2xl border border-base-300 bg-base-200 p-4 shadow-lg">
            <Forklift className="h-16 w-16 text-primary/20 absolute top-4 right-4" aria-hidden />
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Equipment Listed", value: "10k+" },
                { label: "Active Renters", value: "5k+" },
                { label: "Cities", value: "50+" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-lg border border-base-300 bg-base-100 text-center"
                >
                  <div className="text-2xl font-bold text-base-content">
                    {item.value}
                  </div>
                  <div className="text-xs text-base-content/60 uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-base-content mb-10 text-center">
          Why choose {siteConfig.name}?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card bg-base-100 border border-base-300 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <feature.icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-base-content mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mb-16">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-2xl font-bold text-base-content mb-6">
              How it works
            </h2>
          </div>
          <div className="lg:w-1/2 space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex gap-4"
              >
                <div className="flex shrink-0 items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-content font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-base-content">
                    {step.title}
                  </h3>
                  <p className="text-sm text-base-content/70">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-base-300 bg-primary p-8 text-primary-content text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-primary-content/90 mb-6 max-w-xl mx-auto">
          Join thousands of equipment owners and renters on
          {siteConfig.name}.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/all-equipment"
            className="btn btn-primary btn-lg"
          >
            Browse Equipment
          </a>
          <a
            href="/register"
            className="btn btn-outline btn-lg border-primary text-primary-content hover:bg-primary"
          >
            List Your Equipment
          </a>
        </div>
      </div>
    </section>
  );
}
