import Layout from "@/components/Layout";
import FAQSection from "@/components/FAQSection";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQ = () => {
  const { t, fontClass } = useLanguage();
  return (
    <Layout>
      <div className={`gradient-hero py-16 md:py-24 ${fontClass}`}>
        <div className="section-container">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">{t("សំណួរញឹកញាប់", "FAQ")}</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">{t("ចម្លើយសម្រាប់សំណួរដែលសួរញឹកញាប់បំផុត។", "Answers to the most frequently asked questions.")}</p>
        </div>
      </div>
      <FAQSection />
    </Layout>
  );
};

export default FAQ;
