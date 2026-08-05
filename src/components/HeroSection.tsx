// import { useLanguage } from "@/contexts/LanguageContext";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { ArrowRight, Zap } from "lucide-react";
// import { motion } from "framer-motion";

// const HeroSection = () => {
//   const { t, fontClass } = useLanguage();

//   return (
//     <section className={`gradient-hero relative overflow-hidden ${fontClass}`}>
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
//       <div className="section-container relative z-10 py-20 md:py-32 lg:py-40">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           className="max-w-3xl"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6">
//             <Zap className="h-4 w-4 text-primary-foreground" />
//             {/* Added font-kantumruy here */}
//             <span className="text-primary-foreground/90 text-sm font-medium font-kantumruy">
//               {t("ដំណោះស្រាយអាជីវកម្មឆ្លាតវៃ", "Smart Business Solutions")}
//             </span>
//           </div>

//           {/* Added font-kantumruy here */}
//           <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 font-kantumruy">
//             {t(
//               "ស្ថាបនាប្រព័ន្ធគ្រប់គ្រងអាជីវកម្មឆ្លាតវៃ",
//               "Build Smart Business Management Systems"
//             )}
//           </h1>

//           {/* Added font-kantumruy here */}
//           <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-2xl font-kantumruy">
//             {t(
//               "ជួយអាជីវកម្មរបស់អ្នកឱ្យសាមញ្ញក្នុងប្រតិបត្តិការ សន្សំសំចៃពេលវេលា និងរីកចម្រើនជាមួយបច្ចេកវិទ្យាទំនើប។",
//               "Help your business simplify operations, save time, and grow with modern technology."
//             )}
//           </p>

//           <div className="flex flex-wrap gap-4">
//             {/* Added font-kantumruy here */}
//             <Button asChild size="lg" variant="secondary" className="gap-2 font-semibold text-primary font-kantumruy">
//               <Link to="/contact">
//                 {t("ទំនាក់ទំនងយើង", "Contact Us")}
//                 <ArrowRight className="h-4 w-4" />
//               </Link>
//             </Button>
            
//             {/* Added font-kantumruy here */}
//             <Button asChild size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-kantumruy">
//               <Link to="/services">
//                 {t("មើលសេវាកម្ម", "View Services")}
//               </Link>
//             </Button>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const { t, fontClass } = useLanguage();

  return (
    <section className={`gradient-hero relative overflow-hidden ${fontClass}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
      <div className="section-container relative z-10 py-20 md:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6">
            <Zap className="h-4 w-4 text-primary-foreground" />
            <span className="text-primary-foreground/90 text-sm font-medium font-kantumruy">
              {t("ដំណោះស្រាយអាជីវកម្មឆ្លាតវៃ", "Smart Business Solutions")}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 font-kantumruy">
            {t(
              "ស្ថាបនាប្រព័ន្ធគ្រប់គ្រងអាជីវកម្មឆ្លាតវៃ",
              "Build Smart Business Management Systems"
            )}
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed max-w-2xl font-kantumruy">
            {t(
              "ជួយអាជីវកម្មរបស់អ្នកឱ្យសាមញ្ញក្នុងប្រតិបត្តិការ សន្សំសំចៃពេលវេលា និងរីកចម្រើនជាមួយបច្ចេកវិទ្យាទំនើប។",
              "Help your business simplify operations, save time, and grow with modern technology."
            )}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" variant="secondary" className="gap-2 font-semibold text-primary font-kantumruy">
              <Link to="/contact">
                {t("ទំនាក់ទំនងយើង", "Contact Us")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground font-kantumruy">
              <Link to="/services">
                {t("មើលសេវាកម្ម", "View Services")}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;