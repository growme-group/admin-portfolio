import Layout from "@/components/Layout";
import FeaturedProjectsSection from "@/components/FeaturedProjectsSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Portfolio = () => {
  const { t, fontClass } = useLanguage();
  return (
    <Layout>
      <div className={`gradient-hero py-16 md:py-24 ${fontClass}`}>
        <div className="section-container">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">{t("ផលិតផលរបស់យើង", "Our Portfolio")}</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">{t("មើលគម្រោងដែលយើងបានបង្កើត។", "See projects we've built.")}</p>
        </div>
      </div>
      <FeaturedProjectsSection />
    </Layout>
  );
};

export default Portfolio;
