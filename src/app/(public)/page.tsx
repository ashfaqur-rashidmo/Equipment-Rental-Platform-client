import { CategoriesSection } from "@/components/home/categories-section";
import { CtaSection } from "@/components/home/cta-section";
import { FeaturedEquipment } from "@/components/home/featured-equipment";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { ReviewsSection } from "@/components/home/reviews-section";
import { TrustedOwners } from "@/components/home/trusted-owners";
import { WhyChooseUs } from "@/components/home/why-choose-us";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedEquipment />
      <CategoriesSection />
      <WhyChooseUs />
      <ReviewsSection />
      <HowItWorks />
      <TrustedOwners />
      <CtaSection />
    </>
  );
}
