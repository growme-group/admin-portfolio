import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import SolutionsSection from "@/components/SolutionsSection";
import PricingSection from "@/components/PricingSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import FeaturedProjectsSection from "@/components/FeaturedProjectsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import ClientsSection from "@/components/ClientsSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <SolutionsSection />
      <PricingSection />
      <WhyChooseSection />
      <FeaturedProjectsSection />
      <FAQSection />
      <ClientsSection/>
      <ContactSection/>
    </Layout>
  );
};

export default Index;
