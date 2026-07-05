import Hero from "@/components/home/Hero";
import RoutesSection from "@/components/routes/RoutesSection";
import PromotionsSection from "@/components/promotions/PromotionsSection";
import DriversSection from "@/components/drivers/DriversSection";
import BecomeDriverBanner from "@/components/drivers/BecomeDriverBanner";
import AboutSection from "@/components/about/AboutSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <RoutesSection />
      <PromotionsSection />
      <DriversSection />
      <BecomeDriverBanner />
      <AboutSection />
    </>
  );
}
