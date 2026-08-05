// import Layout from "@/components/Layout";
// import ServicesSection from "@/components/ServicesSection";
// import PricingSection from "@/components/PricingSection";
// import { useLanguage } from "@/contexts/LanguageContext";

// const Services = () => {
//   const { t, fontClass } = useLanguage();
//   return (
//     <Layout>
//       <div className={`gradient-hero py-16 md:py-24 ${fontClass}`}>
//         <div className="section-container">
//           <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">{t("សេវាកម្មរបស់យើង", "Our Services")}</h1>
//           <p className="text-primary-foreground/80 text-lg max-w-2xl">{t("ដំណោះស្រាយបច្ចេកវិទ្យាផ្សេងៗ សម្រាប់អាជីវកម្មរបស់អ្នក។", "Various technology solutions for your business.")}</p>
//         </div>
//       </div>
//       <ServicesSection />
//       <PricingSection />
//     </Layout>
//   );
// };

// export default Services;



import Layout from "@/components/Layout";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Services = () => {
  const { t, fontClass } = useLanguage();

  return (
    <Layout>
      <div className={`gradient-hero py-16 md:py-24 ${fontClass}`}>
        <div className="section-container text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t("សេវាកម្មរបស់យើង", "Our Services")}
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            {t(
              "យើងផ្តល់ដំណោះស្រាយ POS និង Software ដើម្បីជួយអាជីវកម្មរបស់អ្នករីកចម្រើន។",
              "We provide POS and software solutions to help your business grow efficiently."
            )}
          </p>

          {/* 🔥 SERVICE BUTTONS */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button className="px-4 py-2 bg-white/20 rounded-lg">
              SaaS
            </button>
            <button className="px-4 py-2 bg-white/20 rounded-lg">
              Custom Build
            </button>
            <button className="px-4 py-2 bg-white/20 rounded-lg">
              POS Package
            </button>
            <button className="px-4 py-2 bg-white/20 rounded-lg">
              Add-ons
            </button>
          </div>
        </div>
      </div>

      <ServicesSection />
      <PricingSection />
    </Layout>
  );
};

export default Services;