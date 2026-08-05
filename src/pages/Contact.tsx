import Layout from "@/components/Layout";
import ContactSection from "@/components/ContactSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { t, fontClass } = useLanguage();
  return (
    <Layout>
      <div className={`gradient-hero py-16 md:py-24 ${fontClass}`}>
        <div className="section-container">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">{t("ទំនាក់ទំនងមកកាន់យើង", "Contact Us")}</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">{t("យើងរង់ចាំជួយអ្នក! ផ្ញើសារមកយើង។", "We're here to help! Send us a message.")}</p>
        </div>
      </div>
      <ContactSection />
    </Layout>
  );
};

export default Contact;
