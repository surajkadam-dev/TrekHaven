import { useState } from "react";
import {
  FaGoogle,
  FaLanguage,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

const GoogleProviderMessage = () => {
  const [language, setLanguage] = useState("en");

  // Translation content
  const content = {
    en: {
      title: "Google Account Detected",
      message: "Your account is managed through Google authentication",
      instructions: "Important Instructions",
      advice:
        "For your security, password changes must be performed through your Google account settings. Contact Google support for account assistance.",
      goBack: "Go Back",
      instructionItems: [
        "Use your Google account credentials to sign in",
        "Keep your Google account secure with two-factor authentication",
        "Update your security settings directly through Google",
      ],
    },
    mr: {
      title: "Google खाते आढळले",
      message: "तुमचे खाते Google प्रमाणीकरणाद्वारे व्यवस्थापित केले जाते",
      instructions: "महत्वाच्या सूचना",
      advice:
        "तुमच्या सुरक्षिततेसाठी, संपर्ग्टा बदल Google खाते सेटिंग्जद्वारे केले जाणे आवश्यक आहे. खाते सहाय्यासाठी Google समर्थनाशी संपर्क साधा.",
      goBack: "मागे जा",
      instructionItems: [
        "साइन इन करण्यासाठी तुमच्या Google खात्याच्या प्रमाणपत्रांचा वापर करा",
        "दोन-फॅक्टर प्रमाणीकरणासह तुमचे Google खाते सुरक्षित ठेवा",
        "तुमच्या सुरक्षा सेटिंग्ज थेट Google द्वारे अद्यतनित करा",
      ],
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mt-[60px] md:mt-0">
        {/* Header */}
        <div className="bg-[#6B8E23] text-white rounded-t-xl p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Karpewadi Homestay</h1>
            <p className="text-sm opacity-90">Account Security</p>
          </div>
          <button
            onClick={() => setLanguage(language === "mr" ? "en" : "mr")}
            className="p-2 rounded-full hover:bg-[#556B2F] transition-colors"
          >
            <FaLanguage className="text-xl" />
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white p-6 md:p-8 rounded-b-xl shadow-lg">
          {/* Google Account Info */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-600 to-green-800 flex items-center justify-center">
              <FaGoogle className="text-white text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h2>
            <p className="text-gray-600">{t.message}</p>
          </div>

          {/* Instructions Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaInfoCircle className="text-[#6B8E23] mr-2" />
              {t.instructions}
            </h3>
            <ul className="space-y-3 text-gray-700">
              {t.instructionItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <FaCheckCircle className="text-[#6B8E23] mt-1 mr-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warning Section */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-amber-500 text-xl mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800">
                  Security Advisory
                </h4>
                <p className="text-amber-700 text-sm mt-1">{t.advice}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="px-6 py-3 bg-[#6B8E23] text-white rounded-lg font-medium hover:bg-[#556B2F] transition-colors flex-1 flex items-center justify-center"
              onClick={() => window.history.back()}
            >
              <span className="mr-2">←</span> {t.goBack}
            </button>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex-1 flex items-center justify-center">
              <FaInfoCircle className="mr-2" /> Get Help
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Need additional assistance? Contact support@karpewadi.com</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleProviderMessage;
