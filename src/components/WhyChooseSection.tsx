import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
// Updated icons for a more modern feel
import { ShieldCheck, Zap, Headphones, TrendingUp, Sliders, Award } from "lucide-react";

const reasons = [
  { 
    icon: ShieldCheck, 
    km: "សុវត្ថិភាពទិន្នន័យខ្ពស់", 
    en: "Data Security & Reliability", 
    descKm: "ប្រព័ន្ធការពារកម្រិតស្តង់ដារ ដែលធានាថាប្រតិបត្តិការអាជីវកម្មរបស់អ្នកត្រូវបានការពារយ៉ាងរឹងមាំជានិច្ច។", 
    descEn: "Enterprise-grade security protocols ensuring your business data and transactions are always protected." 
  },
  { 
    icon: Zap, 
    km: "ប្រសិទ្ធភាព និងចំណេញពេល", 
    en: "Operational Efficiency", 
    descKm: "ស្វ័យប្រវត្តិកម្មការងារប្រចាំថ្ងៃតាមរយៈប្រព័ន្ធ POS និងវិបសាយ ដើម្បីសន្សំពេលវេលា និងកាត់បន្ថយកំហុស។", 
    descEn: "Automate manual tasks with our POS and web systems to save time and reduce human errors." 
  },
  { 
    icon: Headphones, 
    km: "សេវាកម្មគាំទ្ររហ័សទាន់ចិត្ត", 
    en: "Dedicated Local Support", 
    descKm: "ក្រុមការងារបច្ចេកទេសក្នុងស្រុករបស់យើង រង់ចាំជួយដោះស្រាយបញ្ហា និងផ្តល់ការណែនាំយ៉ាងឆាប់រហ័ស។", 
    descEn: "Our local support team is always ready to assist you with quick troubleshooting and guidance." 
  },
  { 
    icon: TrendingUp, 
    km: "លទ្ធភាពពង្រីកឥតដែនកំណត់", 
    en: "Future-Proof Scalability", 
    descKm: "ប្រព័ន្ធដែលអភិវឌ្ឍឡើងដោយស្ថាបត្យកម្មទំនើប អាចពង្រីកទំហំបានយ៉ាងងាយស្រួលស្របតាមកំណើនអាជីវកម្ម។", 
    descEn: "Systems built on modern architecture that seamlessly grow alongside your business expansion." 
  },
  { 
    icon: Sliders, 
    km: "កែសម្រួលស្របតាមតម្រូវការ", 
    en: "Tailored to Your Needs", 
    descKm: "យើងកែសម្រួលមុខងារ និងដំណើរការប្រព័ន្ធ ឱ្យស្របបេះបិទទៅនឹងគោលដៅជាក់ស្តែងនៃអាជីវកម្មរបស់អ្នក។", 
    descEn: "We customize features and workflows to match your exact business logic, not the other way around." 
  },
  { 
    icon: Award, 
    km: "ជំនាញ និងបទពិសោធន៍ច្បាស់លាស់", 
    en: "Proven Expertise", 
    descKm: "ដឹកនាំដោយក្រុមអ្នកអភិវឌ្ឍន៍ និងអ្នកគ្រប់គ្រងគម្រោង ដែលមានស្នាដៃជោគជ័យជាច្រើនកន្លងមក។", 
    descEn: "A dedicated team of senior developers and project managers with a track record of successful deliveries." 
  },
];

const WhyChooseSection = () => {
  const { t, fontClass } = useLanguage();

  return (
    <section className={`section-padding bg-background ${fontClass}`}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Added font-kantumruy */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-kantumruy">
            {t("ហេតុអ្វីគួរជ្រើសរើស ITSS?", "Why Choose ITSS?")}
          </h2>
          {/* Added a descriptive subtitle to match other sections + font-kantumruy */}
          <p className="text-muted-foreground max-w-2xl mx-auto font-kantumruy">
            {t(
              "យើងមិនត្រឹមតែសរសេរកូដទេ តែយើងផ្តល់ជូននូវដំណោះស្រាយដែលជំរុញឱ្យអាជីវកម្មរបស់អ្នកទទួលបានភាពជោគជ័យពិតប្រាកដ។",
              "We don't just write code; we deliver strategic technology solutions that drive real business success."
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                <r.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <div>
                {/* Added font-kantumruy */}
                <h3 className="font-bold text-lg text-foreground mb-2 font-kantumruy leading-tight">
                  {t(r.km, r.en)}
                </h3>
                {/* Added font-kantumruy */}
                <p className="text-muted-foreground text-sm leading-relaxed font-kantumruy">
                  {t(r.descKm, r.descEn)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;