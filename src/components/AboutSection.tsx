import { useLanguage } from "@/contexts/LanguageContext";
// I changed the icons to match the stronger text meanings!
import { Rocket, Handshake, ShieldCheck } from "lucide-react"; 
import { motion } from "framer-motion";

const AboutSection = () => {
  const { t, fontClass } = useLanguage();

  const stats = [
    { 
      icon: Rocket, 
      km: "ជំរុញភាពជោគជ័យ", 
      en: "Empowering ", 
      descKm: "ផ្តល់ជូនដំណោះស្រាយបច្ចេកវិទ្យាប្រកបដោយនវានុវត្តន៍ ដែលជួយដោះស្រាយបញ្ហាអាជីវកម្មជាក់ស្តែង និងជំរុញប្រាក់ចំណេញ។", 
      descEn: "Delivering innovative, value-driven technology solutions that solve real business challenges and drive profitability." 
    },
    { 
      icon: Handshake, 
      km: "ភាពជាដៃគូដ៏រឹងមាំ", 
      en: "Trusted Partnership", 
      descKm: "យើងមិនត្រឹមតែបង្កើតប្រព័ន្ធទេ តែយើងកសាងទំនាក់ទំនងយូរអង្វែង ដើម្បីភាពជោគជ័យជាបន្តបន្ទាប់របស់អ្នក។", 
      descEn: "We don't just build software; we build long-term relationships focused on your continuous success." 
    },
    { 
      icon: ShieldCheck, 
      km: "ឧត្តមភាពផ្នែកបច្ចេកទេស", 
      en: "Engineering Excellence", 
      descKm: "បង្កើតប្រព័ន្ធ Website និង POS ដែលមានសុវត្ថិភាពខ្ពស់ និងដំណើរការលឿនរហ័សដោយប្រើបច្ចេកវិទ្យាចុងក្រោយ។", 
      descEn: "Crafting secure, high-performance web and POS systems using cutting-edge technologies." 
    },
  ];

  return (
    <section className={`section-padding bg-background ${fontClass}`} id="about">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Added font-kantumruy here */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-kantumruy">
            {t("អំពី ITSS", "About ITSS")}
          </h2>
          
          {/* Added font-kantumruy here and upgraded the main description */}
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed font-kantumruy">
            {t(
              "ITSroksrea Solutions (ITSS) គឺជាដៃគូបច្ចេកវិទ្យាដ៏គួរឱ្យទុកចិត្តរបស់អ្នក។ យើងផ្តោតលើការបង្កើតប្រព័ន្ធ Website និង ប្រព័ន្ធគ្រប់គ្រងការលក់ (POS) POS system កម្រិតស្តង់ដារ ដែលជួយសម្រួលដល់ប្រតិបត្តិការ និងជំរុញកំណើនអាជីវកម្មរបស់អ្នកយ៉ាងរលូន។",
              "ITSroksrea Solutions (ITSS) is your dedicated technology partner. We specialize in building robust web applications and seamless POS systems designed to streamline your operations and accelerate your business growth."
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card border border-border text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-5">
                <s.icon className="h-7 w-7 text-primary" />
              </div>
              {/* Added font-kantumruy here */}
              <h3 className="font-bold text-xl mb-3 text-foreground font-kantumruy">
                {t(s.km, s.en)}
              </h3>
              {/* Added font-kantumruy here */}
              <p className="text-muted-foreground text-sm leading-loose font-kantumruy">
                {t(s.descKm, s.descEn)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;