import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Upgraded FAQs tailored for a professional Web & POS agency
const faqs = [
  {
    qKm: "តើ ITSS ជំនាញខាងបង្កើតប្រព័ន្ធអ្វីខ្លះ?",
    qEn: "What type of systems does ITSS specialize in?",
    aKm: "យើងជំនាញយ៉ាងច្បាស់លាស់លើការបង្កើតប្រព័ន្ធវិបសាយ (Web Applications) គេហទំព័រលក់ទំនិញ (E-commerce) និងប្រព័ន្ធគ្រប់គ្រងការលក់ (POS) សម្រាប់ហាងលក់រាយ ភោជនីយដ្ឋាន និងក្រុមហ៊ុនទូទៅ។",
    aEn: "We specialize in building robust Web Applications, E-commerce Websites, and Smart POS (Point of Sale) systems tailored for retail, F&B, and enterprise management.",
  },
  {
    qKm: "តើត្រូវចំណាយពេលប៉ុន្មានដើម្បីដំឡើងប្រព័ន្ធ POS ឬវិបសាយ?",
    qEn: "How long does it take to set up a POS system or website?",
    aKm: "សម្រាប់ប្រព័ន្ធ POS ស្តង់ដារ យើងអាចរៀបចំរួចរាល់ក្នុងរយៈពេលត្រឹមតែប៉ុន្មានថ្ងៃ។ ចំណែកឯប្រព័ន្ធវិបសាយតាមតម្រូវការ អាចចំណាយពេលពី ២ ទៅ ៦សប្តាហ៍ អាស្រ័យលើទំហំ និងភាពស្មុគស្មាញនៃការងារ។",
    aEn: "Standard POS systems can be deployed within a few days. Custom web applications typically take 2 to 6 weeks, depending on the complexity of your requirements.",
  },
  {
    qKm: "តើក្រុមហ៊ុនមានលក់ឧបករណ៍ POS ភ្ជាប់ជាមួយ Software ដែរឬទេ?",
    qEn: "Do you supply POS hardware along with the software?",
    aKm: "បាទ/ចាស យើងមានផ្តល់ជូនជាកញ្ចប់ពេញលេញ។ លោកអ្នកអាចជ្រើសរើសយកតែ Software ឬយកជាកញ្ចប់ដែលមានរួមបញ្ចូលទាំងម៉ាស៊ីនព្រីនវិក្កយបត្រ ម៉ាស៊ីនស្កេនកូដ និងថតដាក់ប្រាក់ (Cash Drawer)។",
    aEn: "Yes, we offer complete package solutions. You can subscribe to our software only, or get a full hardware bundle including receipt printers, barcode scanners, and cash drawers.",
  },
  {
    qKm: "តើមានសេវាកម្មថែទាំ និងជំនួយបច្ចេកទេសក្រោយពេលទិញដែរឬទេ?",
    qEn: "Do you provide ongoing maintenance and technical support?",
    aKm: "ពិតប្រាកដណាស់! យើងមានសេវាកម្មថែទាំប្រព័ន្ធ ធ្វើបច្ចុប្បន្នភាពជាប្រចាំ និងមានក្រុមបច្ចេកទេសក្នុងស្រុករង់ចាំជួយដោះស្រាយរាល់បញ្ហារបស់អ្នកជានិច្ច ដើម្បីធានាថាអាជីវកម្មអ្នកដំណើរការដោយរលូន។",
    aEn: "Absolutely! We provide ongoing maintenance, regular software updates, and dedicated local technical support to ensure your business runs smoothly without interruptions.",
  },
  {
    qKm: "តើខ្ញុំអាចបន្ថែមមុខងារថ្មីៗនៅពេលអាជីវកម្មខ្ញុំរីកធំជាងមុនបានទេ?",
    qEn: "Can I add new features to the system as my business grows?",
    aKm: "បានយ៉ាងងាយស្រួល! ប្រព័ន្ធរបស់យើងត្រូវបានរចនាឡើងប្រកបដោយភាពបត់បែន។ ទោះជាអ្នកបើកសាខាថ្មី ឬចង់ភ្ជាប់ប្រព័ន្ធផ្សេងៗ (API) យើងអាចពង្រីកប្រព័ន្ធតាមតម្រូវការរបស់អ្នកបានជានិច្ច។",
    aEn: "Yes. Our systems are highly scalable. Whether you are opening a new branch or need a custom API integration later on, we can easily upgrade your system to match your growth.",
  },
];

const FAQSection = () => {
  const { t, fontClass } = useLanguage();

  return (
    <section className={`section-padding bg-background ${fontClass}`} id="faq">
      <div className="section-container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Added font-kantumruy */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-kantumruy">
            {t("សំណួរដែលសួរញឹកញាប់", "Frequently Asked Questions")}
          </h2>
          {/* Added a nice subtitle to match the rest of the site */}
          <p className="text-muted-foreground max-w-2xl mx-auto font-kantumruy">
            {t(
              "ស្វែងរកចម្លើយចំពោះសំណួរទូទៅទាក់ទងនឹងសេវាកម្ម និងប្រព័ន្ធរបស់យើង។",
              "Find answers to common questions about our services and systems."
            )}
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-card rounded-xl border border-border px-6 shadow-card hover:border-primary/30 transition-colors duration-300"
            >
              {/* Added font-kantumruy and made the text slightly larger */}
              <AccordionTrigger className="text-left font-bold text-foreground hover:no-underline text-base md:text-lg font-kantumruy py-5">
                {t(faq.qKm, faq.qEn)}
              </AccordionTrigger>
              {/* Added font-kantumruy, improved line height, and added padding bottom */}
              <AccordionContent className="text-muted-foreground font-kantumruy leading-relaxed text-sm md:text-base pb-6">
                {t(faq.aKm, faq.aEn)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;