import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

// 1. Added 'image' property to each project. 
// You need to put your actual images in the public/image/ folder!
const projects = [
  { 
    km: "ប្រព័ន្ធគ្រប់គ្រងសាលារៀនអនឡាញ", 
    en: "Online School Web Platform", 
    tagKm: "ការអប់រំ", 
    tagEn: "Education",
    image: "/image/project-school.jpg" 
  },
  { 
    km: "ប្រព័ន្ធ POS ស្ថានីយ៍ប្រេង", 
    en: "Gas Station POS System", 
    tagKm: "ប្រព័ន្ធ POS", 
    tagEn: "POS System",
    image: "/image/project-gas.jpg" 
  },
  { 
    km: "ប្រព័ន្ធកុម្ម៉ង់កាហ្វេ (SaaS)", 
    en: "Cafe Ordering System (SaaS)", 
    tagKm: "ភោជនីយដ្ឋាន", 
    tagEn: "F&B SaaS",
    image: "/image/project-cafe.jpg" 
  },
  { 
    km: "គេហទំព័រលក់សម្លៀកបំពាក់អនឡាញ", 
    en: "Clothing E-commerce Website", 
    tagKm: "ពាណិជ្ជកម្ម", 
    tagEn: "E-commerce",
    image: "/image/project-ecommerce.jpg" 
  },
  { 
    km: "ប្រព័ន្ធគ្រប់គ្រងកម្ចីប្រាក់", 
    en: "Loan Management System", 
    tagKm: "ហិរញ្ញវត្ថុ", 
    tagEn: "Finance",
    image: "/image/project-loan.jpg" 
  },
];

const FeaturedProjectsSection = () => {
  const { t, fontClass } = useLanguage();

  return (
    <section className={`section-padding bg-secondary ${fontClass}`}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-kantumruy">
            {t("គម្រោងលេចធ្លោរបស់យើង", "Our Featured Projects")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-kantumruy">
            {t(
              "ស្នាដៃប្រព័ន្ធវិបសាយ និង POS មួយចំនួនដែលយើងបានអភិវឌ្ឍដោយជោគជ័យសម្រាប់អតិថិជន។",
              "A selection of successful Web and POS systems we have proudly delivered for our clients."
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              // Added cursor-pointer so the whole card feels clickable
              className="bg-card rounded-xl overflow-hidden shadow-card border border-border group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="aspect-video bg-muted relative overflow-hidden flex items-center justify-center">
                
                {/* 2. THE IMAGE BLOCK */}
                <img 
                  src={p.image} 
                  alt={p.en} 
                  // group-hover:scale-105 creates a smooth zoom effect when hovered
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  // Fallback just in case the image path is broken
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-sm text-muted-foreground">Image Coming Soon</span>';
                  }}
                />

                {/* Overlay that appears on hover with the External Link icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <ExternalLink className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <span className="text-xs font-bold text-primary bg-primary-light px-3 py-1.5 rounded-full font-kantumruy tracking-wide">
                  {t(p.tagKm, p.tagEn)}
                </span>
                <h3 className="font-bold text-foreground mt-4 text-base font-kantumruy leading-relaxed group-hover:text-primary transition-colors">
                  {t(p.km, p.en)}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;