import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const clients = [
  { 
    name: "Client Name 1", 
    typeKm: "ភោជនីយដ្ឋាន", 
    typeEn: "Restaurant", 
    // Example path. Rename to match your actual files.
    logo: "image/client-logo-1.png" 
  },
  { 
    name: "Piseth Online", 
    typeKm: "សាលារៀន", 
    typeEn: "Education", 
    logo: "image/sala.png" 
  },
  { 
    name: "ZaRo", 
    typeKm: "ហាងលក់ខោអាវ", 
    typeEn: "Clothing Store", 
    logo: "image/zaro.png" 
  },
  { 
    name: "GPS Express ", 
    typeKm: "ដឹកជញ្ចូន", 
    typeEn: "Express", 
    logo: "image/gps.png" 
  },
  { 
    name: "Petronas", 
    typeKm: "ស្ថានីយ៍ប្រេងឥន្ធនៈ", 
    typeEn: "Gas Sation", 
    logo: "image/petronas.png" 
  },
];

const ClientsSection = () => {
  const { t, fontClass } = useLanguage();

  return (
    <section className={`section-padding bg-background ${fontClass}`} id="clients">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-kantumruy">
            {t("អតិថិជនរបស់យើង", "Trusted By Our Clients")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-kantumruy">
            {t(
              "យើងមានមោទនភាពដែលបានក្លាយជាដៃគូបច្គេកវិទ្យា ជួយជំរុញភាពជោគជ័យដល់អាជីវកម្មទាំងនេះ។",
              "We are proud to be the trusted technology partner driving success for these amazing businesses."
            )}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
          {clients.map((client, i) => (
            <motion.div
              key={i}
              // 2. Updated Animation: Slide Up.
              // initial y: 40 starts it lower down.
              initial={{ opacity: 0, y: 40 }} 
              // whileInView y: 0 brings it to its final position.
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.3 }} // amount ensures it triggers neatly
              transition={{ 
                type: "spring", // spring makes the slide look cool
                stiffness: 100, 
                damping: 20, 
                delay: i * 0.1 // existing stagger delay
              }}
              className="flex flex-col items-center justify-center w-[160px] h-[160px] bg-card rounded-2xl border border-border shadow-sm hover:shadow-elevated hover:border-primary/30 transition-all duration-300 group"
            >
              {/* Circular container for the logo */}
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 p-2 overflow-hidden border border-border">
                
                {/* 3. Render Image instead of Icon */}
                <img 
                  src={client.logo} 
                  alt={`${client.name} Logo`} 
                  // object-contain ensures the full logo fits inside
                  className="w-full h-full object-contain" 
                  // Helpful for debugging if images aren't loading yet:
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-muted-foreground">Logo</span>';
                  }}
                />
              </div>

              <h3 className="font-bold text-foreground text-center text-sm font-kantumruy px-2 leading-tight">
                {client.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-kantumruy">
                {t(client.typeKm, client.typeEn)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;