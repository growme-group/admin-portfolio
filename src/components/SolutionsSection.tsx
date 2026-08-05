// import { useLanguage } from "@/contexts/LanguageContext";
// import { motion } from "framer-motion";
// import {
//   Globe, GraduationCap, Home, UtensilsCrossed, ShoppingCart, HardHat,
//   Wine, Store, ShoppingBag, Fuel, Truck, Landmark
// } from "lucide-react";

// const solutions = [
//   { icon: Globe, km: "គេហទំព័រផលិតផលឌីជីថល", en: "Digital Portfolio Websites" },
//   { icon: GraduationCap, km: "ប្រព័ន្ធគ្រប់គ្រងសាលា", en: "School Management Systems" },
//   { icon: Home, km: "ប្រព័ន្ធគ្រប់គ្រងការជួលបន្ទប់", en: "Room Rental Management" },
//   { icon: UtensilsCrossed, km: "POS ភោជនីយដ្ឋាន និងកាហ្វេ", en: "Restaurant & Cafe POS" },
//   { icon: ShoppingCart, km: "POS រាយ និងស្តុក", en: "Retail POS & Inventory" },
//   { icon: HardHat, km: "គ្រប់គ្រងស្តុកសម្ភារៈសំណង់", en: "Construction Materials Stock" },
//   { icon: Wine, km: "គ្រប់គ្រងភេសជ្ជៈ/លក់ដុំ", en: "Beverage / Wholesale Mgmt" },
//   { icon: Store, km: "ប្រព័ន្ធផ្សារ/មីនីម៉ាត", en: "Mart / Mini-mart Systems" },
//   { icon: ShoppingBag, km: "គេហទំព័រពាណិជ្ជកម្មអេឡិចត្រូនិក", en: "E-commerce Websites" },
//   { icon: Fuel, km: "POS ស្ថានីយ៍ប្រេង", en: "Fuel Station POS" },
//   { icon: Truck, km: "នាំចូល/នាំចេញ និងដឹកជញ្ជូន", en: "Import/Export & Logistics" },
//   { icon: Landmark, km: "ប្រព័ន្ធគ្រប់គ្រងកម្ចី", en: "Loan Management Systems" },
// ];

// const SolutionsSection = () => {
//   const { t, fontClass } = useLanguage();

//   return (
//     <section className={`section-padding bg-background ${fontClass}`} id="solutions">
//       <div className="section-container">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-12"
//         >
//           <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//             {t("ដំណោះស្រាយតាមវិស័យ", "Industry Solutions")}
//           </h2>
//           <p className="text-muted-foreground max-w-2xl mx-auto">
//             {t("ដំណោះស្រាយដែលរចនាសម្រាប់វិស័យជាច្រើន។", "Solutions designed for various industries.")}
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//           {solutions.map((s, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, scale: 0.95 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.05 }}
//               className="bg-card rounded-xl p-5 shadow-card border border-border hover:border-primary/30 hover:shadow-elevated transition-all text-center group cursor-default"
//             >
//               <div className="w-12 h-12 rounded-lg bg-primary-light group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center mx-auto mb-3 transition-colors">
//                 <s.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
//               </div>
//               <p className="text-sm font-medium text-foreground">{t(s.km, s.en)}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SolutionsSection;



import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Globe, GraduationCap, Home, UtensilsCrossed, ShoppingCart, HardHat,
  Wine, Store, ShoppingBag, Fuel, Truck, Landmark
} from "lucide-react";

const solutions = [
  { icon: Globe, km: "គេហទំព័រផលិតផលឌីជីថល", en: "Digital Portfolio Websites" },
  { icon: GraduationCap, km: "ប្រព័ន្ធគ្រប់គ្រងសាលា", en: "School Management Systems" },
  { icon: Home, km: "ប្រព័ន្ធគ្រប់គ្រងការជួលបន្ទប់", en: "Room Rental Management" },
  { icon: UtensilsCrossed, km: "POS ភោជនីយដ្ឋាន និងកាហ្វេ", en: "Restaurant & Cafe POS" },
  { icon: ShoppingCart, km: "POS រាយ និងស្តុក", en: "Retail POS & Inventory" },
  { icon: HardHat, km: "គ្រប់គ្រងស្តុកសម្ភារៈសំណង់", en: "Construction Materials Stock" },
  { icon: Wine, km: "គ្រប់គ្រងភេសជ្ជៈ/លក់ដុំ", en: "Beverage / Wholesale Mgmt" },
  { icon: Store, km: "ប្រព័ន្ធផ្សារ/មីនីម៉ាត", en: "Mart / Mini-mart Systems" },
  { icon: ShoppingBag, km: "គេហទំព័រពាណិជ្ជកម្មអេឡិចត្រូនិក", en: "E-commerce Websites" },
  { icon: Fuel, km: "POS ស្ថានីយ៍ប្រេង", en: "Fuel Station POS" },
  { icon: Truck, km: "នាំចូល/នាំចេញ និងដឹកជញ្ជូន", en: "Import/Export & Logistics" },
  { icon: Landmark, km: "ប្រព័ន្ធគ្រប់គ្រងកម្ចី", en: "Loan Management Systems" },
];

const SolutionsSection = () => {
  const { t, fontClass } = useLanguage();

  return (
    <section className={`section-padding bg-background ${fontClass}`} id="solutions">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Added font-kantumruy */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-kantumruy">
            {t("ដំណោះស្រាយតាមវិស័យ", "Industry Solutions")}
          </h2>
          
          {/* Upgraded text to highlight Web & POS and added font-kantumruy */}
          <p className="text-muted-foreground max-w-2xl mx-auto font-kantumruy">
            {t(
              "ប្រព័ន្ធវិបសាយ និង POS ដែលរៀបចំឡើងយ៉ាងពិសេស ដើម្បីឆ្លើយតបទៅនឹងតម្រូវការនៃវិស័យនីមួយៗ។", 
              "Specialized Web and POS systems perfectly tailored to the unique operational demands of your specific industry."
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {solutions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-5 shadow-card border border-border hover:border-primary/30 hover:shadow-elevated transition-all text-center group cursor-default"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-light group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
                <s.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              {/* Added font-kantumruy to the cards */}
              <p className="text-sm font-bold text-foreground font-kantumruy leading-relaxed">
                {t(s.km, s.en)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;