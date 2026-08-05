// import { useLanguage } from "@/contexts/LanguageContext";
// // Updated icons to match the new text meaning
// import { Cloud, LayoutDashboard, Code2 } from "lucide-react"; 
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";

// const services = [
//   {
//     icon: Cloud,
//     km: "ប្រព័ន្ធគ្រប់គ្រងលើ Cloud (SaaS)",
//     en: "Cloud-Based POS & SaaS",
//     descKm: "ជាវប្រចាំខែ ឬឆ្នាំ ទទួលបានការអាប់ដេតជាប្រចាំ ការរក្សាទុកទិន្នន័យសុវត្ថិភាពលើ Cloud និងអាចរៀបចំជាកញ្ចប់ជាមួយឧបករណ៍ (Hardware)។",
//     descEn: "Flexible monthly or yearly subscriptions. Enjoy continuous updates, secure cloud backups, and optional hardware bundles.",
//   },
//   {
//     icon: LayoutDashboard,
//     km: "អាជ្ញាប័ណ្ណកម្មវិធីស្តង់ដារ",
//     en: "Standard Software Licenses",
//     descKm: "ប្រព័ន្ធ Website និង POS system ដែលបានរៀបចំរួចជាស្រេច សម្រាប់អាជីវកម្មខ្នាតតូច មធ្យម និងធំ។ ងាយស្រួលប្រើ និងចំណាយពេលខ្លីក្នុងការដំឡើង។",
//     descEn: "Pre-built, feature-rich web and POS applications tailored for all business sizes. Quick to deploy and incredibly user-friendly.",
//   },
//   {
//     icon: Code2,
//     km: "ប្រព័ន្ធបច្ចេកវិទ្យាតាមតម្រូវការ",
//     en: "Custom Web Solutions",
//     descKm: "សាងសង់ប្រព័ន្ធ Website និង កម្មវិធីគ្រប់គ្រងអាជីវកម្មពីចំណុចសូន្យ ស្របតាមតម្រូវការជាក់ស្តែងរបស់ ម្ចាស់អាជីវកម្មតែម្ដង។",
//     descEn: "Bespoke web applications and enterprise systems built from scratch to match your exact business logic. One-time payment.",
//   },
// ];

// const ServicesSection = () => {
//   const { t, fontClass } = useLanguage();

//   return (
//     <section className={`section-padding bg-secondary ${fontClass}`} id="services">
//       <div className="section-container">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-12"
//         >
//           {/* Added font-kantumruy */}
//           <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-kantumruy">
//             {t("សេវាកម្មរបស់យើង", "Our Services")}
//           </h2>
//           {/* Added font-kantumruy */}
//           <p className="text-muted-foreground max-w-2xl mx-auto font-kantumruy">
//             {t(
//               "យើងផ្តល់ជូននូវជម្រើសបច្ចេកវិទ្យាដ៏សម្បូរបែប ដើម្បីឆ្លើយតបទៅនឹងទំហំ និងតម្រូវការជាក់ស្តែងនៃអាជីវកម្មរបស់អ្នក។", 
//               "We offer versatile technology options designed to perfectly align with your business size and operational needs."
//             )}
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {services.map((s, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.1 }}
//               className="bg-card rounded-xl p-8 shadow-card border border-border hover:shadow-elevated transition-shadow"
//             >
//               <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mb-5">
//                 <s.icon className="h-7 w-7 text-primary" />
//               </div>
//               {/* Added font-kantumruy */}
//               <h3 className="font-bold text-xl mb-3 text-foreground font-kantumruy">
//                 {t(s.km, s.en)}
//               </h3>
//               {/* Added font-kantumruy */}
//               <p className="text-muted-foreground text-sm leading-relaxed mb-5 font-kantumruy">
//                 {t(s.descKm, s.descEn)}
//               </p>
//               <Button asChild variant="outline" size="sm" className="font-kantumruy">
//                 <Link to="/services">
//                   {t("ស្វែងយល់បន្ថែម", "Learn More")}
//                 </Link>
//               </Button>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ServicesSection;



import { useLanguage } from "@/contexts/LanguageContext";
import { Cloud, Code2, Package, Settings } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Cloud,
    km: "ប្រព័ន្ធ POS លើ Cloud (SaaS)",
    en: "SaaS POS System",
    descKm:
      "ចាប់ផ្តើមប្រើប្រាស់បានភ្លាមៗ ជាមួយប្រព័ន្ធ POS លើ Cloud មានការអាប់ដេត និងការការពារទិន្នន័យសុវត្ថិភាព។",
    descEn:
      "Start quickly with our cloud-based POS system. Monthly subscription with updates, backup, and support.",
  },
  {
    icon: Code2,
    km: "ការអភិវឌ្ឍន៍កម្មវិធីតាមតម្រូវការ",
    en: "Custom Software Development",
    descKm:
      "យើងអភិវឌ្ឍប្រព័ន្ធតាមតម្រូវការរបស់អាជីវកម្មអ្នក អាចបង់ម្តង ឬបង់រំលស់បាន។",
    descEn:
      "We build systems based on your exact business requirements. Flexible payment (one-time or installment).",
  },
  {
    icon: Package,
    km: "កញ្ចប់ POS (Hardware + Software)",
    en: "POS Package (Hardware + Software)",
    descKm:
      "ផ្តល់ជូនឧបករណ៍ និងកម្មវិធីពេញលេញ រួមទាំង Tablet, Printer និងការដំឡើងរួចជាស្រេច។",
    descEn:
      "Complete POS setup including tablet, printer, and installation. Ready to use for your business.",
  },
  {
    icon: Settings,
    km: "សេវាកម្មបន្ថែម",
    en: "Add-ons & Extra Services",
    descKm:
      "អាចជាវតែ Software ឬ Hardware និងបន្ថែម KHQR, Telegram bot និងសេវាផ្សេងៗ។",
    descEn:
      "Buy only hardware or software, and integrate KHQR, Telegram bot, and more.",
  },
];

const ServicesSection = () => {
  const { t, fontClass } = useLanguage();

  return (
    <section className={`py-20 bg-secondary ${fontClass}`}>
      <div className="section-container">

        {/* 🔥 TITLE */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-kantumruy">
            {t("សេវាកម្មរបស់យើង", "Our Services")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-kantumruy">
            {t(
              "យើងផ្តល់ដំណោះស្រាយ Software និង POS សម្រាប់អាជីវកម្មគ្រប់ទំហំ។",
              "We provide software and POS solutions for businesses of all sizes."
            )}
          </p>
        </div>

        {/* 🔥 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <s.icon className="w-10 h-10 text-primary mb-4" />

              <h3 className="font-bold text-lg mb-2 font-kantumruy">
                {t(s.km, s.en)}
              </h3>

              <p className="text-sm text-muted-foreground font-kantumruy">
                {t(s.descKm, s.descEn)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;