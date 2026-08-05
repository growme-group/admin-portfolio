
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type ProductType = "pos" | "website";
type PricingType = "saas" | "package" | "software";

const PricingSection = () => {
  const { t, fontClass } = useLanguage();

  const [product, setProduct] = useState<ProductType>("pos");
  const [type, setType] = useState<PricingType>("saas");
  const [yearly, setYearly] = useState(false);

  // 🔥 DATA
  const pricingData = {
    
    
    pos: {

      saas: [
  {
    km: "កញ្ចប់តូច",
    en: "Small Plan",
    monthly: 20,
    yearly: 200,
    setup: "$80–120",
    features: [
      { km: "គ្រប់គ្រងការបញ្ជាទិញ", en: "POS Order Management" },
      { km: "បង្កើត order និង modifier", en: "Create order + modifier + note" },
      { km: "គណនាតម្លៃស្វ័យប្រវត្តិ", en: "Auto calculate total" },
      { km: "ទូទាត់ប្រាក់ USD/KHR", en: "Cash payment (USD/KHR)" },
      { km: "បង្ហាញប្រាក់អាប់", en: "Show change to customer" },
      { km: "បោះពុម្ពវិក័យប័ត្រ", en: "Receipt printing + reprint" },
      { km: "គ្រប់គ្រងវេន", en: "Shift management (open/close/X-report)" },
      { km: "គ្រប់គ្រងម៉ឺនុយ", en: "Product & menu management" },
      { km: "របាយការណ៍ប្រចាំថ្ងៃ", en: "Daily sales report" },
      { km: "ស្តុកមូលដ្ឋាន", en: "Basic inventory (manual adjust)" },
    ],
  },

  {
    km: "កញ្ចប់មធ្យម",
    en: "Medium Plan",
    monthly: 39,
    yearly: 390,
    featured: true,
    setup: "$120–180",
    features: [
      { km: "មានទាំង Small", en: "Everything in Small Plan" },
      { km: "QR Ordering", en: "QR ordering system" },
      { km: "ម៉ឺនុយ Web", en: "Customer web menu" },
      { km: "KHQR Payment", en: "KHQR payment" },
      { km: "អេក្រង់ផ្ទះបាយ", en: "Kitchen Display System (KDS)" },
      { km: "ស្ថានភាព order", en: "Order status flow (Pending → Ready)" },
      { km: "Inventory Recipe", en: "Inventory with recipe auto deduct" },
      { km: "CRM", en: "Customer + loyalty system" },
      { km: "Telegram Notification", en: "Telegram notification" },
      { km: "របាយការណ៍កម្រិតខ្ពស់", en: "Advanced reporting" },
    ],
  },

  {
    km: "កញ្ចប់ធំ",
    en: "Enterprise Plan",
    monthly: 79,
    yearly: 790,
    setup: "$250–500",
    features: [
      { km: "មានទាំង Medium", en: "Everything in Medium Plan" },
      { km: "គ្រប់គ្រងសាខាច្រើន", en: "Multi-branch management" },
      { km: "Inventory Advanced", en: "Advanced inventory (FIFO, expiry)" },
      { km: "Procurement", en: "Supplier & purchase system" },
      { km: "Stock Transfer", en: "Stock transfer between branches" },
      { km: "CRM Advanced", en: "Advanced CRM & promotions" },
      { km: "Analytics", en: "Full reporting & analytics" },
      { km: "Staff Permission", en: "Staff & permission control" },
      { km: "Approval Workflow", en: "Approval workflow system" },
      { km: "Audit & Security", en: "Audit log & security system" },
    ],
  },
],
      package: [
        {
          km: "Basic Package",
          en: "Basic Package",
          price: "$800",
          features: [{ km: "Tablet + Printer", en: "Tablet + Printer" }],
        },
        {
          km: "Standard",
          en: "Standard",
          price: "$1200",
          featured: true,
          features: [{ km: "Full POS", en: "Full POS System" }],
        },
      ],

      software: [
        {
          km: "Software Basic",
          en: "Software Basic",
          price: "$400",
          features: [{ km: "POS only", en: "POS only" }],
        },
        {
          km: "Software Pro",
          en: "Software Pro",
          price: "$800",
          featured: true,
          features: [{ km: "POS + Stock", en: "POS + Inventory" }],
        },
      ],
      
    },

    // website: {
    //   saas: [
    //     {
    //       km: "Website Basic",
    //       en: "Website Basic",
    //       monthly: 10,
    //       yearly: 100,
    //       features: [{ km: "Hosting", en: "Hosting" }],
    //     },
    //     {
    //       km: "Website Pro",
    //       en: "Website Pro",
    //       monthly: 25,
    //       yearly: 250,
    //       featured: true,
    //       features: [{ km: "CMS", en: "CMS System" }],
    //     },
    //   ],

    //   package: [
    //     {
    //       km: "Landing Page",
    //       en: "Landing Page",
    //       price: "$300",
    //       features: [{ km: "1 page", en: "1 page website" }],
    //     },
    //     {
    //       km: "Business Website",
    //       en: "Business Website",
    //       price: "$800",
    //       featured: true,
    //       features: [{ km: "Multi page", en: "Multi-page website" }],
    //     },
    //   ],

    //   software: [
    //     {
    //       km: "Custom Website",
    //       en: "Custom Website",
    //       price: "$1000+",
    //       features: [{ km: "Custom system", en: "Custom system" }],
    //     },
    //   ],
    // },

  };

  const plans = pricingData[product][type];

  return (
    <section className={`py-20 bg-secondary ${fontClass}`}>
      <div className="section-container">

        {/* 🔥 PRODUCT SELECT */}
        <div className="flex justify-center gap-4 mb-4">
          {["pos", "website"].map((p) => (
            <button
              key={p}
              onClick={() => setProduct(p as ProductType)}
              className={`px-6 py-2 rounded-full ${
                product === p ? "bg-black text-white" : "bg-white border"
              }`}
            >
              {t(
                p === "pos" ? "POS System" : "Website",
                p === "pos" ? "POS System" : "Website"
              )}
            </button>
          ))}
        </div>

        {/* 🔥 TYPE SELECT */}
        <div className="flex justify-center gap-4 mb-4">
          {["saas", "package", "software"].map((tKey) => (
            <button
              key={tKey}
              onClick={() => setType(tKey as PricingType)}
              className={`px-4 py-2 rounded-full ${
                type === tKey
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              {tKey.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 🔥 MONTHLY / YEARLY */}
        {type === "saas" && (
          <div className="flex justify-center gap-3 mb-10">
            <span>{t("ប្រចាំខែ", "Monthly")}</span>
            <button
              onClick={() => setYearly(!yearly)}
              className="w-12 h-6 bg-gray-300 rounded-full relative"
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${
                  yearly ? "left-6" : "left-1"
                }`}
              />
            </button>
            <span>{t("ប្រចាំឆ្នាំ", "Yearly")}</span>
          </div>
        )}

        {/* 🔥 CARDS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={product + type + yearly}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {plans.map((p: any, i) => {
              const price =
                type === "saas"
                  ? yearly
                    ? `$${p.yearly}/year`
                    : `$${p.monthly}/month`
                  : p.price;

              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -8 }}
                  className={`p-6 rounded-2xl border ${
                    p.featured
                      ? "bg-gradient-to-br from-blue-600 to-blue-800 text-white scale-105"
                      : "bg-white"
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2">
                    {t(p.km, p.en)}
                  </h3>

                  <p className="text-3xl font-bold mb-4">{price}</p>

                  {p.setup && (
                    <p className="text-sm mb-4">
                      Setup: {p.setup}
                    </p>
                  )}

                  <ul className="space-y-2 mb-6">
                    {p.features.map((f: any, j: number) => (
                      <li key={j} className="flex gap-2 text-sm">
                        <Check className="w-4 h-4" />
                        {t(f.km, f.en)}
                      </li>
                    ))}
                  </ul>

                  <Button asChild className="w-full">
                    <Link to="/contact">
                      {t("ទំនាក់ទំនង", "Contact")}
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PricingSection;