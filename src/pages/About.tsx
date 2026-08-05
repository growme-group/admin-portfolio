import Layout from "@/components/Layout";
import AboutSection from "@/components/AboutSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t, fontClass } = useLanguage();
  return (
    <Layout>
      <div className={`gradient-hero py-16 md:py-24 ${fontClass}`}>
        <div className="section-container">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">{t("អំពីយើង", "About Us")}</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">{t("ស្វែងយល់អំពី ITSroksrea Solutions និងចក្ខុវិស័យរបស់យើង។", "Learn about ITSroksrea Solutions and our vision.")}</p>
        </div>
      </div>
      <AboutSection />
      <WhyChooseSection />
    </Layout>
  );
};

export default About;
