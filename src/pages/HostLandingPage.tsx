import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import PainSection from "@/components/landing/PainSection";
import SolutionSection from "@/components/landing/SolutionSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import RevenueSection from "@/components/landing/RevenueSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import PricingSection from "@/components/landing/PricingSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const HostLandingPage = () => {
  useDocumentTitle("RubikInn — Платформа для мини-отелей и апартаментов");

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <PainSection />
        <SolutionSection />
        <FeaturesSection />
        <RevenueSection />
        <HowItWorksSection />
        <BenefitsSection />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default HostLandingPage;
