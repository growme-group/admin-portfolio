import Layout from "@/components/Layout";
import PricingSection from "@/components/PricingSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Pricing = () => {
  const { t, fontClass } = useLanguage();
  return (
    <Layout>
      <div className={`gradient-hero py-16 md:py-24 ${fontClass}`}>
        <div className="section-container">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">{t("តម្លៃកញ្ចប់", "Pricing Packages")}</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">{t("ជ្រើសរើសកញ្ចប់ដែលសមស្របនឹងអាជីវកម្មរបស់អ្នក។", "Choose the package that fits your business.")}</p>
        </div>
      </div>
      <PricingSection />
    </Layout>
  );
};

export default Pricing;
