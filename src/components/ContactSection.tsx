import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle, Send, Facebook } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ContactSection = () => {
  const { t, fontClass } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN; 
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;


  const messageText = `
🏢 <b>ITSS | NEW CLIENT INQUIRY</b> 🚀
━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Client Name:</b> ${form.name}
📱 <b>Phone Number:</b> <code>${form.phone || "Not provided"}</code>
📧 <b>Email Address:</b> <code>${form.email}</code>

💬 <b>Project Requirements / Message:</b>
<i>${form.message}</i>
━━━━━━━━━━━━━━━━━━━━━━
⚡ <b>Action:</b> Reply within 30-60 minutes.
`;

    try {
      // 3. Send the data to the Telegram API
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: "HTML", // Allows bold text
        }),
      });

      if (response.ok) {
        toast.success(t("សារបានផ្ញើដោយជោគជ័យ!", "Message sent successfully!"));
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(t("មានបញ្ហាក្នុងការផ្ញើសារ!", "Failed to send message."));
      }
    } catch (error) {
      toast.error(t("មានបញ្ហាក្នុងការភ្ជាប់បណ្តាញ!", "Network error occurred."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`section-padding bg-secondary ${fontClass}`} id="contact">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Added font-kantumruy */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-kantumruy">
            {t("ទំនាក់ទំនងមកកាន់យើង", "Contact Us")}
          </h2>
          {/* Added font-kantumruy */}
          <p className="text-muted-foreground max-w-2xl mx-auto font-kantumruy">
            {t(
              "យើងរង់ចាំស្វាគមន៍អ្នកជានិច្ច! សូមបំពេញទម្រង់ខាងក្រោម ឬទាក់ទងមកយើងតាមរយៈបណ្ដាញណាមួយក៏បាន។", 
              "We're ready to help scale your business! Send us a message or reach out through the channels below."
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-card rounded-xl p-8 shadow-card border border-border space-y-5"
          >
            <div>
              <label className="text-sm font-bold text-foreground mb-1.5 block font-kantumruy">{t("ឈ្មោះ", "Name")}</label>
              <Input className="font-kantumruy" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("ឈ្មោះរបស់អ្នក", "Your name")} required disabled={isSubmitting} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-foreground mb-1.5 block font-kantumruy">{t("អ៊ីមែល", "Email")}</label>
                <Input className="font-kantumruy" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" required disabled={isSubmitting} />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground mb-1.5 block font-kantumruy">{t("ទូរស័ព្ទ", "Phone")}</label>
                <Input className="font-kantumruy" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+855 12 345 678" disabled={isSubmitting} />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-foreground mb-1.5 block font-kantumruy">{t("សារ", "Message")}</label>
              <Textarea className="font-kantumruy" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t("សរសេរសាររបស់អ្នកនៅទីនេះ...", "Write your requirements here...")} rows={4} required disabled={isSubmitting} />
            </div>
            <Button type="submit" className="w-full gap-2 font-kantumruy font-bold" disabled={isSubmitting}>
              <Send className="h-4 w-4" />
              {isSubmitting ? t("កំពុងផ្ញើ...", "Sending...") : t("ផ្ញើសារឥឡូវនេះ", "Send Message")}
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-card rounded-xl p-6 shadow-card border border-border space-y-5">
              <h3 className="font-bold text-xl text-foreground font-kantumruy">{t("ព័ត៌មានទំនាក់ទំនង", "Contact Information")}</h3>
              <div className="space-y-4 text-sm font-kantumruy">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-primary" /> 
                  </div>
                  <span className="text-base">096 208 9546 / 097 985 8952</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-primary" /> 
                  </div>
                  <span className="text-base">itsroksrea06@gmail.com</span>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center shrink-0 mt-1">
                    <MapPin className="h-4 w-4 text-primary" /> 
                  </div>
                  <span className="text-base leading-relaxed">{t("ភ្នំពេញ, កម្ពុជា", "Phnom Penh, Cambodia")}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <a href="https://t.me/oudom_dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-light text-primary text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-kantumruy">
                  <MessageCircle className="h-5 w-5" /> Telegram
                </a>
                <a 
                    href="https://web.facebook.com/Thxngboy7" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-light text-primary text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-kantumruy"
                  >
                    <Facebook className="h-5 w-5" /> Facebook Page 
             </a>
              </div>
            </div>

            <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border">
              {/* Optional: Update this link to your actual Google Maps embed link */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125065.55675402035!2d104.8126284698889!3d11.5796669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513dc76a6be3%3A0x9c668bf82f08c4!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1713160000000!5m2!1sen!2skh"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ITSS Location"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;