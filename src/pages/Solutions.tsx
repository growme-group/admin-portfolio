import Layout from "@/components/Layout";
import SolutionsSection from "@/components/SolutionsSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Solutions = () => {
  const { t, fontClass } = useLanguage();
  return (
    <Layout>
      <div className={`gradient-hero py-16 md:py-24 ${fontClass}`}>
        <div className="section-container">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">{t("ដំណោះស្រាយតាមវិស័យ", "Industry Solutions")}</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">{t("ដំណោះស្រាយដែលរចនាសម្រាប់វិស័យជាច្រើន។", "Solutions designed for various industries.")}</p>
        </div>
      </div>
      <SolutionsSection />
    </Layout>
  );
};

export default Solutions;
