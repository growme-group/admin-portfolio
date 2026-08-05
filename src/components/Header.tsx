// import { useLanguage } from "@/contexts/LanguageContext";
// import { Link, useLocation } from "react-router-dom";
// import { useState } from "react";
// import { Menu, X, Globe, Sun, Moon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useTheme } from "@/contexts/ThemeContext";

// const navItems = [
//   { km: "ទំព័រដើម", en: "Home", path: "/" },
//   { km: "អំពីយើង", en: "About", path: "/about" },
//   { km: "សេវាកម្ម", en: "Services", path: "/services" },
//   { km: "ដំណោះស្រាយ", en: "Solutions", path: "/solutions" },
//   { km: "ផលិតផល", en: "Portfolio", path: "/portfolio" },
//   { km: "តម្លៃ", en: "Pricing", path: "/pricing" },
//   { km: "សំណួរញឹកញាប់", en: "FAQ", path: "/faq" },
//   { km: "ទំនាក់ទំនង", en: "Contact", path: "/contact" },
// ];

// const Header = () => {
//   const { t, toggleLang, lang, fontClass } = useLanguage();
//   const { theme, setTheme } = useTheme();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const location = useLocation();

//   return (
//     <header className={`sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border ${fontClass}`}>
//       <div className="section-container flex items-center justify-between h-16 md:h-18">
        
//         {/* --- LOGO SECTION --- */}
//         <Link to="/" className="flex items-center gap-3">
//           <img 
//             src="image/logoitss.png" 
//             alt="ITSS Logo"
//             className="h-12 w-auto object-contain" 
//           />
//           <span className="font-normal text-2xl text-foreground font-moul tracking-wide mt-1">
//             ITSS
//           </span>
//         </Link>

//         {/* --- DESKTOP NAV (Added font-kantumruy here!) --- */}
//         <nav className="hidden lg:flex items-center gap-1 font-kantumruy">
//           {navItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                 location.pathname === item.path
//                   ? "text-primary bg-primary-light"
//                   : "text-muted-foreground hover:text-foreground hover:bg-secondary"
//               }`}
//             >
//               {t(item.km, item.en)}
//             </Link>
//           ))}
//         </nav>

//         <div className="flex items-center gap-2">
//           {/* Added font-kantumruy to the language button */}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//             className="w-9 px-0" // Makes it a nice square shape
//             aria-label="Toggle theme"
//           >
//             {/* The Sun shows in dark mode, the Moon shows in light mode */}
//             <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//             <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={toggleLang}
//             className="gap-1.5 text-xs font-kantumruy font-medium"
//           >
//             <Globe className="h-3.5 w-3.5" />
//             {lang === "km" ? "EN" : "ខ្មែរ"}
//           </Button>

//           <button
//             className="lg:hidden p-2 text-foreground"
//             onClick={() => setMobileOpen(!mobileOpen)}
//           >
//             {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//           </button>
//         </div>
//       </div>

//       {/* --- MOBILE NAV --- */}
//       {mobileOpen && (
//         <div className="lg:hidden border-t border-border bg-card">
//           {/* Added font-kantumruy here! */}
//           <nav className="section-container py-4 flex flex-col gap-1 font-kantumruy">
//             {navItems.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 onClick={() => setMobileOpen(false)}
//                 className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
//                   location.pathname === item.path
//                     ? "text-primary bg-primary-light"
//                     : "text-muted-foreground hover:text-foreground hover:bg-secondary"
//                 }`}
//               >
//                 {t(item.km, item.en)}
//               </Link>
//             ))}
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;


import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Globe, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { km: "ទំព័រដើម", en: "Home", path: "/" },
  { km: "អំពីយើង", en: "About", path: "/about" },
  { km: "សេវាកម្ម", en: "Services", path: "/services" },
  { km: "ដំណោះស្រាយ", en: "Solutions", path: "/solutions" },
  { km: "ផលិតផល", en: "Portfolio", path: "/portfolio" },
  { km: "តម្លៃ", en: "Pricing", path: "/pricing" },
  { km: "សំណួរញឹកញាប់", en: "FAQ", path: "/faq" },
  { km: "ទំនាក់ទំនង", en: "Contact", path: "/Contact" },
];

const Header = () => {
  const { t, toggleLang, lang, fontClass } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className={`sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border ${fontClass}`}>
      <div className="section-container flex items-center justify-between h-16 md:h-18">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="image/logoitss.png" 
            alt="ITSS Logo"
            className="h-12 w-auto object-contain dark:bg-white dark:p-1 dark:rounded-md transition-all" 
          />
          <span className="font-normal text-2xl text-foreground font-moul tracking-wide mt-1">
            ITSS
          </span>
        </Link>

        {/* DESKTOP NAV - Changed to font-moul */}
        <nav className="hidden lg:flex items-center gap-1 font-moul">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "text-primary bg-primary-light"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {t(item.km, item.en)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 px-0"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* LANGUAGE TOGGLE - Changed to font-moul */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLang}
            className="gap-1.5 text-xs font-moul font-medium"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "km" ? "EN" : "ខ្មែរ"}
          </Button>

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV - Changed to font-moul */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="section-container py-4 flex flex-col gap-1 font-moul">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-primary bg-primary-light"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {t(item.km, item.en)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;