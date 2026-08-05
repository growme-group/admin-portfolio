// import { useLanguage } from "@/contexts/LanguageContext";
// import { Link } from "react-router-dom";
// import { Mail, Phone, MapPin, MessageCircle, ChevronRight, Facebook } from "lucide-react";

// const Footer = () => {
//   const { t, fontClass } = useLanguage();

//   return (
//     <footer className={`bg-foreground text-background ${fontClass}`}>
//       <div className="section-container py-12 md:py-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
//           {/* Column 1: Brand & Description */}
//           <div className="space-y-6">
//             <Link to="/" className="inline-flex items-center gap-3">
//               <div className="bg-white p-1.5 rounded-lg">
//                 <img 
//                   src="image/logoitss.png" 
//                   alt="ITSS Logo"
//                   className="h-10 w-auto object-contain" 
//                 />
//               </div>
//               <span className="font-normal text-2xl font-moul tracking-wide text-background mt-1">
//                 ITSS
//               </span>
//             </Link>
//             <p className="text-background/70 text-sm leading-relaxed font-kantumruy pe-4">
//               {t(
//                 "ដៃគូបច្ចេកវិទ្យាដ៏ជឿទុកចិត្តរបស់អ្នក ឯកទេសខាងបង្កើតប្រព័ន្ធវិបសាយ និងប្រព័ន្ធគ្រប់គ្រងការលក់ (POS) កម្រិតស្តង់ដារ។",
//                 "Your trusted technology partner, specializing in robust Web applications and standard POS systems to drive your business growth."
//               )}
//             </p>
//           </div>

//           {/* Column 2: Quick Links */}
//           <div>
//             <h4 className="font-bold mb-6 text-lg font-kantumruy">{t("តំណភ្ជាប់រហ័ស", "Quick Links")}</h4>
//             <div className="flex flex-col gap-3">
//               {[
//                 { km: "អំពីយើង", en: "About Us", path: "/about" },
//                 { km: "សេវាកម្ម", en: "Services", path: "/services" },
//                 { km: "ដំណោះស្រាយ", en: "Solutions", path: "/solutions" },
//                 { km: "តម្លៃ", en: "Pricing", path: "/pricing" },
//               ].map((item) => (
//                 <Link 
//                   key={item.path} 
//                   to={item.path} 
//                   className="text-background/70 hover:text-primary group flex items-center gap-2 text-sm transition-all duration-300 font-kantumruy"
//                 >
//                   <ChevronRight className="h-4 w-4 text-primary opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
//                   <span className="group-hover:translate-x-1 transition-transform duration-300">
//                     {t(item.km, item.en)}
//                   </span>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Column 3: Contact */}
//           <div>
//             <h4 className="font-bold mb-6 text-lg font-kantumruy">{t("ទំនាក់ទំនង", "Contact Info")}</h4>
//             <div className="flex flex-col gap-4 text-sm text-background/70 font-kantumruy">
//               <div className="flex items-center gap-3 hover:text-background transition-colors cursor-pointer group">
//                 <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
//                   <Phone className="h-4 w-4 group-hover:text-primary-foreground" />
//                 </div>
//                 <span>096 208 9546 / 097 985 8952</span>
//               </div>
//               <div className="flex items-center gap-3 hover:text-background transition-colors cursor-pointer group">
//                 <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
//                   <Mail className="h-4 w-4 group-hover:text-primary-foreground" />
//                 </div>
//                 <span>info@itss.com.kh</span>
//               </div>
//               <div className="flex items-start gap-3 hover:text-background transition-colors cursor-pointer group">
//                 <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary transition-colors">
//                   <MapPin className="h-4 w-4 group-hover:text-primary-foreground" />
//                 </div>
//                 <span className="leading-relaxed pt-1">{t("ភ្នំពេញ, កម្ពុជា", "Phnom Penh, Cambodia")}</span>
//               </div>
//             </div>
//           </div>

//           {/* Column 4: Social Media */}
//           <div>
//             <h4 className="font-bold mb-6 text-lg font-kantumruy">{t("បណ្ដាញសង្គម", "Follow Us")}</h4>
//             <div className="flex gap-3">
//               <a 
//                 href="https://t.me/oudom_dev" 
//                 target="_blank" 
//                 rel="noopener noreferrer" 
//                 className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" 
//                 aria-label="Telegram"
//               >
//                 <MessageCircle className="h-5 w-5" />
//               </a>
//               <a 
//                 href="https://web.facebook.com/Thxngboy7" 
//                 target="_blank" 
//                 rel="noopener noreferrer" 
//                 className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" 
//                 aria-label="Facebook"
//               >
//                 <Facebook className="h-5 w-5" />
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50 font-kantumruy">
//           <p>
//             © {new Date().getFullYear()} ITSroksrea Solutions (ITSS). {t("រក្សាសិទ្ធិគ្រប់យ៉ាង។", "All rights reserved.")}
//           </p>
//           <div className="flex gap-6">
//             <Link to="#" className="hover:text-background transition-colors">{t("គោលការណ៍ឯកជនភាព", "Privacy Policy")}</Link>
//             <Link to="#" className="hover:text-background transition-colors">{t("លក្ខខណ្ឌប្រើប្រាស់", "Terms of Service")}</Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, MessageCircle, ChevronRight, Facebook } from "lucide-react";

const Footer = () => {
  const { t, fontClass } = useLanguage();

  return (
    <footer className={`bg-card border-t border-border text-foreground ${fontClass}`}>
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Description */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg border border-border shadow-sm">
                <img 
                  src="image/logoitss.png" 
                  alt="ITSS Logo"
                  className="h-10 w-auto object-contain" 
                />
              </div>
              <span className="font-normal text-2xl font-moul tracking-wide text-foreground mt-1">
                ITSS
              </span>
            </Link>
            {/* Changed to font-moul */}
            <p className="text-muted-foreground text-sm leading-relaxed font-moul pe-4">
              {t(
                "ដៃគូបច្ចេកវិទ្យាដ៏ជឿទុកចិត្តរបស់អ្នក ឯកទេសខាងបង្កើតប្រព័ន្ធវិបសាយ និងប្រព័ន្ធគ្រប់គ្រងការលក់ (POS) កម្រិតស្តង់ដារ។",
                "Your trusted technology partner, specializing in robust Web applications and standard POS systems to drive your business growth."
              )}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-lg font-moul text-foreground">{t("តំណភ្ជាប់រហ័ស", "Quick Links")}</h4>
            <div className="flex flex-col gap-3">
              {[
                { km: "អំពីយើង", en: "About Us", path: "/about" },
                { km: "សេវាកម្ម", en: "Services", path: "/services" },
                { km: "ដំណោះស្រាយ", en: "Solutions", path: "/solutions" },
                { km: "តម្លៃ", en: "Pricing", path: "/pricing" },
              ].map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  // Changed to font-moul
                  className="text-muted-foreground hover:text-primary group flex items-center gap-2 text-sm transition-all duration-300 font-moul"
                >
                  <ChevronRight className="h-4 w-4 text-primary opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {t(item.km, item.en)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-bold mb-6 text-lg font-moul text-foreground">{t("ទំនាក់ទំនង", "Contact Info")}</h4>
            {/* Changed to font-moul */}
            <div className="flex flex-col gap-4 text-sm text-muted-foreground font-moul">
              <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                  <Phone className="h-4 w-4 text-foreground group-hover:text-primary-foreground" />
                </div>
                <span>096 208 9546 / 097 985 8952</span>
              </div>
              <div className="flex items-center gap-3 hover:text-primary transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                  <Mail className="h-4 w-4 text-foreground group-hover:text-primary-foreground" />
                </div>
                <span>itsroksrea06@gmail.com</span>
              </div>
              <div className="flex items-start gap-3 hover:text-primary transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary transition-colors">
                  <MapPin className="h-4 w-4 text-foreground group-hover:text-primary-foreground" />
                </div>
                <span className="leading-relaxed pt-1">{t("ភ្នំពេញ, កម្ពុជា", "Phnom Penh, Cambodia")}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h4 className="font-bold mb-6 text-lg font-moul text-foreground">{t("បណ្ដាញសង្គម", "Follow Us")}</h4>
            <div className="flex gap-3">
              <a 
                href="https://t.me/oudom_dev" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" 
                aria-label="Telegram"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a 
                href="https://web.facebook.com/Thxngboy7" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" 
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        {/* Changed to font-moul */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-moul">
          <p>
            © {new Date().getFullYear()} ITSroksrea Solutions (ITSS). {t("រក្សាសិទ្ធិគ្រប់យ៉ាង។", "All rights reserved.")}
          </p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-foreground transition-colors">{t("គោលការណ៍ឯកជនភាព", "Privacy Policy")}</Link>
            <Link to="#" className="hover:text-foreground transition-colors">{t("លក្ខខណ្ឌប្រើប្រាស់", "Terms of Service")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;