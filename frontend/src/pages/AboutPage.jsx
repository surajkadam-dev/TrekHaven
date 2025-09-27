"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Utensils, Home, Trees, Compass } from "lucide-react";

export default function AboutPage() {
  const [activeLanguage, setActiveLanguage] = useState("en");

  const content = {
    en: {
      title: "About Karapewadi Homestay",
      intro:
        "Our village lies on the historic Panhala to Pawankhind trekking route. For generations, trekkers have passed through, looking for rest, food, and shelter. This gave us the idea to open our family homestay – a place where travelers can pause, recharge, and experience true rural Maharashtrian hospitality.",
      sections: [
        {
          title: "Our Story",
          text: "We began this homestay with a simple thought: trekkers walking long distances deserve a warm welcome. Many used to pass our village tired, hungry, and in need of water or food. Today, our home offers exactly that – comfort, care, and authentic Maharashtrian meals cooked with love.",
          icon: Home,
          img: "/About_1_img (1).png",
        },
        {
          title: "Why Trekkers Choose Us",
          text: "Located right on the Panhala to Pawankhind trek route, our homestay is the perfect stopover. Guests can rest, freshen up, and continue their journey with renewed energy. No detours, no hassle – just natural hospitality along the way.",
          icon: Compass,
          img: "/About_2_img (1).png",
        },
        {
          title: "Our Mission",
          text: "We want every guest to feel the warmth of village life. Our mission is to preserve simplicity while offering clean, comfortable stays and home-style food that feels like family care.",
          icon: Users,
          img: "/About_3_img (1).png",
        },
        {
          title: "Experience Village Life",
          text: "Beyond rest, we invite you to experience rural Maharashtra – waking up to birdsong, enjoying farm-fresh meals, and learning about our traditions. For many trekkers, this becomes the highlight of their journey.",
          icon: Trees,
          img: "/village.jpg",
        },
        {
          title: "Supporting the Community",
          text: "Our homestay is not just for travelers – it also supports local farmers, cooks, and villagers. Every stay helps sustain our community while promoting eco-friendly and cultural tourism.",
          icon: Utensils,
          img: "/About_5_img (1).png",
        },
      ],
    },

    mr: {
      title: "करपेवाडी होमस्टे बद्दल",
      intro:
        "आमचं गाव ऐतिहासिक पन्हाळा ते पावनखिंड ट्रेक मार्गावर आहे. पिढ्यानपिढ्या गिर्यारोहक इथून जात होते, त्यांना विश्रांती, जेवण आणि आसऱ्याची गरज होती. त्यातूनच आमच्या कुटुंबीय होमस्टेची कल्पना सुरू झाली – जिथे प्रवासी थांबू शकतात, ऊर्जा मिळवू शकतात आणि खऱ्या ग्रामीण आतिथ्याचा अनुभव घेऊ शकतात.",
      sections: [
        {
          title: "आमची कहाणी",
          text: "आम्ही होमस्टे एका साध्या विचाराने सुरू केला: लांब चाललेला प्रत्येक ट्रेकर उबदार स्वागतास पात्र आहे. आधी लोक दमलेले, भुकेले आणि पाण्यासाठी थांबायचे. आता आमच्या घरी त्यांना घरगुती जेवण, विश्रांती आणि आपुलकी मिळते.",
          icon: Home,
          img: "/About_1_img (1).png",
        },
        {
          title: "ट्रेकर्स आमच्याकडे का थांबतात?",
          text: "आमचं होमस्टे पन्हाळा ते पावनखिंड ट्रेक मार्गावरच असल्यामुळे हे आदर्श ठिकाण आहे. पाहुणे आराम करू शकतात, ताजेतवाने होतात आणि पुढील प्रवासासाठी तयार होतात. कुठलाही वळसा नाही – फक्त गावचं आपुलकीचं स्वागत.",
          icon: Compass,
          img: "/About_2_img (1).png",
        },
        {
          title: "आमचं ध्येय",
          text: "प्रत्येक पाहुण्याला गावाच्या साधेपणाचा अनुभव द्यायचा. स्वच्छ, आरामदायी राहण्याची सोय आणि घरगुती जेवण – जे कुटुंबाच्या मायेप्रमाणे वाटेल – हेच आमचं ध्येय आहे.",
          icon: Users,
          img: "/About_3_img (1).png",
        },
        {
          title: "ग्रामीण जीवनाचा अनुभव",
          text: "फक्त विश्रांती नाही, तर ग्रामीण महाराष्ट्र अनुभवण्याची संधी आहे – पक्षांच्या आवाजात उठणं, शेतमालावर आधारित जेवण आणि आमच्या परंपरा जाणून घेणं. हा अनुभव अनेक ट्रेकर्ससाठी खास आठवण बनतो.",
          icon: Trees,
          img: "/village.jpg",
        },
        {
          title: "गावाच्या मदतीसाठी",
          text: "आमचं होमस्टे केवळ प्रवाशांसाठी नाही – तर स्थानिक शेतकरी, स्वयंपाकी आणि गावकऱ्यांनाही आधार देते. प्रत्येक मुक्काम आमच्या समुदायाला बळकट करतो आणि पर्यावरणपूरक पर्यटनाला प्रोत्साहन देतो.",
          icon: Utensils,
          img: "/About_5_img (1).png",
        },
      ],
    },
  };

  const t = content[activeLanguage] || content.en;

  return (
    <div className="min-h-screen bg-beige-50 font-sans text-brown-900">
      {/* Hero Section */}
      <section className="relative bg-green-50 py-20 px-6 text-center">
        {/* Language Toggle */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setActiveLanguage("en")}
            className={`px-3 py-1 rounded-full font-semibold transition-colors ${
              activeLanguage === "en"
                ? "bg-green-700 text-beige-50 shadow"
                : "bg-beige-200 text-brown-700 hover:bg-green-200"
            }`}
            type="button"
          >
            EN
          </button>
          <button
            onClick={() => setActiveLanguage("mr")}
            className={`px-3 py-1 rounded-full font-semibold transition-colors ${
              activeLanguage === "mr"
                ? "bg-green-700 text-beige-50 shadow"
                : "bg-beige-200 text-brown-700 hover:bg-green-200"
            }`}
            type="button"
          >
            MR
          </button>
        </div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 ">
            {t.title}
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-brown-800 text-justify">
            {t.intro}
          </p>
        </motion.div>
      </section>

      {/* Sections with Images + Animation */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid gap-16">
        {t.sections.map(({ title, text, icon: Icon, img }, i) => (
          <motion.div
            key={i}
            className="bg-beige-100 rounded-xl p-6 shadow-md grid md:grid-cols-2 gap-6 items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <div>
              <div className="flex items-center mb-4 space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Icon className="w-8 h-8 text-green-700" />
                </div>
                <h3 className="text-2xl font-semibold">{title}</h3>
              </div>
              <p className="text-brown-700 leading-relaxed">{text}</p>
            </div>
            <motion.img
              src={img}
              alt={title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </section>
    </div>
  );
}
