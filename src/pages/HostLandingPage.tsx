import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import PainSection from "@/components/landing/PainSection";
import SolutionSection from "@/components/landing/SolutionSection";
import RevenueSection from "@/components/landing/RevenueSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const HostLandingPage = () => {
  useDocumentTitle("ChillStay — Платформа для апартаментов и мини-отелей");

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main>
        <HeroSection />
        <PainSection />
        <RevenueSection />
        <SolutionSection />
        <HowItWorksSection />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default HostLandingPage;
