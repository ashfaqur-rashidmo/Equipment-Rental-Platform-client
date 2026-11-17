import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
        About Us
      </h1>
      <p className="mt-6 text-base leading-7 text-base-content/70">
        {siteConfig.name} is a rental marketplace that connects equipment
        owners with customers who need reliable equipment for a specific
        period. Owners list their equipment with transparent pricing and
        rental terms, while customers browse verified listings, book online
        and pay securely.
      </p>
      <p className="mt-4 text-base leading-7 text-base-content/70">
        From construction machinery and agricultural equipment to photography
        gear and event supplies — our goal is to make renting equipment as
        easy as booking a room: affordable rates, flexible rental periods and
        secure payments for everyone involved.
      </p>
    </section>
  );
}
