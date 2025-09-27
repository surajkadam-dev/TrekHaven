"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors } from "../store/slices/userSlice";
import {
  MapPin,
  Utensils,
  Home,
  Trees,
  Phone,
  Mail,
  Star,
  Clock,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import Testimonials from "../Components/Home/Testimonials";

export default function PanhalaHomestay() {
  const [activeLanguage, setActiveLanguage] = useState("en");
  const { error } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }
  }, [error]);

  const content = {
    en: {
      title: "Karapewadi Homestay",
      welcome: "Welcome to Our Homestay",
      tagline:
        "Experience authentic village life on the historic Panhala to Pawankhind trek route",
      bookNow: "Book Your Stay",
      about: "About Our Place",
      aboutText:
        "Nestled in a peaceful Maharashtrian village, our family homestay offers trekkers and travelers a comfortable retreat with home-cooked local meals and genuine hospitality.",
      address:
        "Village near Shahuwadi,Karapewadi, Kolhapur District, Maharashtra",
      contact: "Contact Us",
      phone: "+91 9321803014",
      email: "surajkadam1706004@gmail.com",
      whyStay: "Why Stay With Us",
      features: [
        {
          title: "Authentic Food",
          description:
            "Home-cooked Maharashtrian meals prepared with local ingredients",
          icon: Utensils,
        },
        {
          title: "Peaceful Surroundings",
          description:
            "Wake up to birdsong and beautiful views of the countryside",
          icon: Trees,
        },
        {
          title: "Trekker Friendly",
          description:
            "Perfect stop along the historic Panhala to Pawankhind route",
          icon: MapPin,
        },
        {
          title: "Cultural Experience",
          description:
            "Immerse yourself in rural Maharashtrian life and traditions",
          icon: Home,
        },
      ],
      galleryTitle: "Experience Village Life",

      galleryImages: [
        {
          src: "/room.jpg",
          alt: "Simple clean room with traditional bedding and wooden furniture",
        },
        {
          src: "/food-img.jpg",
          alt: "Traditional Maharashtrian thali meal with bhakri, vegetable curry and chutney",
        },
        {
          src: "/nature.jpg",
          alt: "Scenic view of rural Maharashtra with green fields and hills",
        },
        {
          src: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e78c496d-4f41-493d-844f-6fc6a0e7493d.png",
          alt: "Traditional Maharashtrian village home with clay tiles and courtyard",
        },
        {
          src: "/static_image .jpg",
          alt: "Homestay common area with traditional seating and decor",
        },
        {
          src: "/village.jpg",
          alt: "Village homestay surroundings",
        },
      ],
      Testimonial: "💛 Guest Experiences",
      TestMonialSub: "Cherished memories from our happy guests",
      NoTestimonialFirstPara:
        "Every visit leaves behind a story — filled with warmth, laughter, and peaceful moments in our village.",
      NoTestimonialSecPara:
        "While our guests are preparing to share their beautiful experiences, we invite you to relax and enjoy our heartfelt hospitality.",
      loadingTestTitle: "✨ No guest experiences to show yet",
      loadingAnimationText: "⏳ Loading wonderful memories...",

      cancellationPolicy: "Cancellation Policy",
      policyPoints: [
        {
          title: "Cancellation Policy",
          description:
            "You can cancel your booking within 24 hours after the booking is confirmed.",
          icon: Clock,
        },
        {
          title: "25% Cancellation Charges",
          description:
            "25% of the booking amount will be charged on all cancellations.",
          icon: AlertCircle,
        },
        {
          title: "Refund Processing",
          description:
            "Refund (after deduction) will be credited within 3-5 business days.",
          icon: CreditCard,
        },
      ],

      quryText: "For any queries regarding cancellations, please contact us at",
    },
    mr: {
      title: "करपेवाडी होमस्टे",
      welcome: "आमच्या होमस्टे मध्ये आपले स्वागत आहे",
      tagline:
        "ऐतिहासिक पन्हाळा ते पावनखिंड ट्रेक मार्गावर खेडूत जीवनाचा अनुभव घ्या",
      bookNow: "आपली स्टे बुक करा",
      about: "आमच्या जागेबद्दल",
      aboutText:
        "शांत महाराष्ट्रीयन गावात वसलेले, आमचे कुटुंबीय होमस्टे ट्रेकर्स आणि प्रवाशांना स्थानिक पदार्थ आणि खऱ्या आतिथ्यासह आरामदायी निवारा देते.",
      address: "शाहूवाडी जवळील गाव, करपेवाडी, कोल्हापूर जिल्हा, महाराष्ट्र",
      contact: "आमच्याशी संपर्क साधा",
      phone: "+९१ ९३२१८०३०१४",
      email: "surajkadam1706004@gmail.com",
      whyStay: "आमच्याकडे का रहा?",
      features: [
        {
          title: "खऱ्या चवीचे जेवण",
          description:
            "स्थानिक साहित्याने तयार केलेले घरगुती महाराष्ट्रीयन जेवण",
          icon: Utensils,
        },
        {
          title: "शांत वातावरण",
          description: "पक्षांच्या आवाजासह उठणे आणि ग्रामीण भागाचे सुंदर दृश्य",
          icon: Trees,
        },
        {
          title: "ट्रेकर्ससाठी अनुकूल",
          description:
            "ऐतिहासिक पन्हाळा ते पावनखिंड मार्गावरील परिपूर्ण स्थानक",
          icon: MapPin,
        },
        {
          title: "सांस्कृतिक अनुभव",
          description: "ग्रामीण महाराष्ट्रीयन जीवन आणि परंपरांमध्ये रमून जा",
          icon: Home,
        },
      ],
      galleryTitle: "ग्रामीण जीवनाचा अनुभव",

      galleryImages: [
        {
          src: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/345fb1cf-b91a-4e38-96df-37fa9a5c0fff.png",
          alt: "पारंपरिक बेडिंग आणि लाकडी फर्निचर असलेली स्वच्छ खोली",
        },
        {
          src: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/10f0d8bf-e902-4a1b-a843-9289a07cf2f5.png",
          alt: "भाकरी, भाजी आणि चटणीसह पारंपरिक महाराष्ट्रीयन थाळी जेवण",
        },
        {
          src: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9c1920dc-b639-4644-a4de-433f9b90a842.png",
          alt: "शेत आणि डोंगर यांचे ग्रामीण महाराष्ट्राचे नयनरम्य दृश्य",
        },
        {
          src: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e78c496d-4f41-493d-844f-6fc6a0e7493d.png",
          alt: "मातीच्या टाइल्स आणि अंगण असलेले पारंपरिक महाराष्ट्रीयन गावातील घर",
        },
        {
          src: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2b90ff49-310c-41d1-b223-6e20760e4a3d.png",
          alt: "पारंपरिक आसन आणि सजावटीसह होमस्टे कॉमन एरिया",
        },
        {
          src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          alt: "गावातील होमस्टे परिसर",
        },
      ],
      Testimonial: "आमच्या पाहुण्यांचे अनुभव",
      TestMonialSub: "त्यांनी अनुभवलेल्या क्षणांचे शब्दात वर्णन",
      NoTestimonialFirstPara: "आमचे पाहुणे आपले अनुभव सामायिक करतील",
      NoTestimonialSecPara: "तोपर्यंत आपण आमच्या सेवांचा आनंद घ्या",
      loadingTestTitle: "अद्याप कोणतेही अनुभव उपलब्ध नाहीत",
      loadingAnimationText: "⏳ अनुभव लोड होत आहे...",
      cancellationPolicy: "रद्दीकरण धोरण",
      policyPoints: [
        {
          title: "रद्दीकरण धोरण",
          description:
            "बुकिंग कन्फर्म झाल्यानंतर २४ तासांच्या आत तुम्ही तुमचे बुकिंग रद्द करू शकता.",
          icon: Clock,
        },
        {
          title: "25% शुल्क",
          description:
            "सर्व रद्दीकरणांवर बुकिंग रकमेच्या २५% शुल्क आकारले जाईल.",
          icon: AlertCircle,
        },
        {
          title: "पैसे परत प्रक्रिया",
          description: "पैसे परत 3-5 कामकाजाच्या दिवसांत केले जाईल",
          icon: CreditCard,
        },
      ],
      quryText:
        "रद्द करण्याबाबत कोणत्याही प्रश्नांसाठी, कृपया आमच्याशी येथे संपर्क साधा",
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
            aria-label="Switch to English"
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
            aria-label="Switch to Marathi"
            type="button"
          >
            MR
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            {t.title}
          </h1>
          <h2 className="text-2xl md:text-2xl font-bold mb-4">{t.welcome}</h2>
          <p className="max-w-xl mx-auto text-lg md:text-xl mb-8 text-brown-800">
            {t.tagline}
          </p>
          <button
            type="button"
            className="bg-green-700 text-beige-50 px-8 py-3 rounded-full font-semibold shadow-md hover:bg-green-800 transition"
            aria-label={t.bookNow}
          >
            <Link to="/book/details">{t.bookNow}</Link>
          </button>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10"
      >
        <div className="md:w-1/2 text-brown-900">
          <h3 className="text-3xl font-semibold mb-6">{t.about}</h3>
          <p className="mb-6 leading-relaxed">{t.aboutText}</p>
          <div className="flex items-center text-brown-700 mb-3">
            <MapPin className="w-5 h-5 mr-2" />
            <address className="not-italic">{t.address}</address>
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4">{t.contact}</h4>
            <div className="flex items-center text-brown-700 mb-2">
              <Phone className="w-5 h-5 mr-2" />
              <span>{t.phone}</span>
            </div>
            <div className="flex items-center text-brown-700">
              <Mail className="w-5 h-5 mr-2" />
              <span>{t.email}</span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 rounded-xl overflow-hidden shadow-lg">
          <img
            src="/village.jpg"
            alt="Traditional Maharashtrian village home with clay tiles and courtyard"
            className="w-full h-80 sm:h-96 object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* Why Stay With Us */}
      <section id="why-stay" className="bg-beige-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-semibold text-center mb-12">
            {t.whyStay}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.map(({ title, description, icon: Icon }, i) => (
              <article
                key={i}
                className="bg-beige-50 rounded-2xl p-6 shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow"
              >
                <div className="bg-green-100 rounded-full p-4 mb-4">
                  <Icon
                    className="w-10 h-10 text-green-700"
                    aria-hidden="true"
                  />
                </div>
                <h4 className="font-semibold text-brown-900 mb-2">{title}</h4>
                <p className="text-brown-700 text-sm leading-relaxed">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="cancellation-policy" className="py-16 px-6 bg-beige-100">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-semibold text-center mb-12">
            {t.cancellationPolicy}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.policyPoints.map(({ title, description, icon: Icon }, i) => (
              <div
                key={i}
                className="bg-beige-50 rounded-2xl p-6 shadow-md flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="bg-amber-100 rounded-full p-4 mb-4">
                  <Icon
                    className="w-10 h-10 text-amber-700"
                    aria-hidden="true"
                  />
                </div>
                <h4 className="font-semibold text-brown-900 mb-2 text-lg">
                  {title}
                </h4>
                <p className="text-brown-700 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional information */}
          <div className="mt-12 bg-white rounded-xl p-6 shadow-sm max-w-3xl mx-auto">
            <p className="text-brown-700 text-center italic">
              {t.quryText} {t.phone} {t.email}
            </p>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-green-50">
        <Testimonials
          Testimonial={t.Testimonial}
          TestMonialSub={t.TestMonialSub}
          NoTestimonialFirstPara={t.NoTestimonialFirstPara}
          NoTestimonialSecPara={t.NoTestimonialSecPara}
          loadingTestTitle={t.loadingTestTitle}
          loadingAnimationText={t.loadingAnimationText}
        />
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-semibold text-center mb-12">
            {t.galleryTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {t.galleryImages.map(({ src, alt }, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
