import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const translations = {
  en: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    sendEmail: "Send Email",
    sendWhatsApp: "Send WhatsApp",
    successEmail: "Email sent successfully!",
    errorEmail: "Failed to send email. Please try again.",
    successWhatsApp: "WhatsApp chat opened!",
    errorWhatsApp: "Failed to open WhatsApp. Please try again.",
    required: "This field is required",
    language: "Language",
    heading: "Get in Touch",
    subtext:
      "We'd love to hear from you! Whether you want to book your stay, try local food, or ask questions — contact us below.",
    address: "Karpewadi, Shahuwadi, Maharashatra",
    phoneLabel: "Phone",
    emailLabel: "Email",
    hours: "Business Hours",
    hoursValue: "Mon–Sat, 9 AM – 6 PM",
    getDirections: "Get Directions",
  },
  mr: {
    name: "नाव",
    email: "ईमेल",
    phone: "फोन",
    message: "संदेश",
    sendEmail: "ईमेल पाठवा",
    sendWhatsApp: "व्हाट्सअॅप पाठवा",
    successEmail: "ईमेल यशस्वीपणे पाठवले!",
    errorEmail: "ईमेल पाठवण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
    successWhatsApp: "व्हाट्सअॅप चॅट उघडले!",
    errorWhatsApp: "व्हाट्सअॅप उघडण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
    required: "हे क्षेत्र आवश्यक आहे",
    language: "भाषा",
    heading: "संपर्क करा",
    subtext:
      "आम्हाला तुमच्याशी बोलायला आनंद होईल! राहण्यासाठी बुकिंग, स्थानिक जेवण चाखणे किंवा कोणतेही प्रश्न असतील तर खाली संपर्क करा.",
    address: "करपेवाडी , शाहूवाडी , महाराष्ट्र ",
    phoneLabel: "फोन",
    emailLabel: "ईमेल",
    hours: "व्यवसाय वेळ",
    hoursValue: "सोम–शनि, सकाळी ९ ते संध्या ६",
    getDirections: "दिशा मिळवा",
  },
};

function InputField({ label, id, type = "text", value, onChange, error }) {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className="mb-1 font-semibold text-brown-900">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        className={`rounded border border-brown-400 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-beige-50 text-brown-900 ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
    </div>
  );
}

function TextAreaField({ label, id, value, onChange, error }) {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={id} className="mb-1 font-semibold text-brown-900">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        required
        rows={4}
        className={`rounded border border-brown-400 px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-beige-50 text-brown-900 ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
    </div>
  );
}

function Map({ lang, t }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [directionsService] = useState(
    () => new window.google.maps.DirectionsService()
  );
  const [directionsRenderer] = useState(
    () => new window.google.maps.DirectionsRenderer()
  );
  const [showNavigation, setNavigation] = useState(false);

  // Initialize map
  useEffect(() => {
    if (window.google && mapRef.current && !map) {
      const panhalaLocation = { lat: 16.812, lng: 74.103 };
      const newMap = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: panhalaLocation,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#616161" }],
          },
        ],
      });

      const newMarker = new window.google.maps.Marker({
        position: panhalaLocation,
        map: newMap,
        title: "Panhala Fort",
        icon: {
          url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzA4NzQyMCI+PHBhdGggZD0iTTEyIDBDNyAwIDMgNCAzIDljMCA1LjI1IDkgMTUgOSAxNXM5LTkuNzUgOS0xNWMwLTUtNC05LTktOXptMCAxMmMtMi4yMSAwLTQtMS43OS00LTRzMS43OS00IDQtNCA0IDEuNzkgNCA0LTEuNzkgNC00IDR6Ii8+PC9zdmc+",
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });

      setMap(newMap);
      setMarker(newMarker);
      directionsRenderer.setMap(newMap);
    }
  }, [map, directionsRenderer]);

  const handleGetDirections = () => {
    console.log("direction render");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const destination = { lat: 16.812, lng: 74.103 };

          directionsService.route(
            {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
                setNavigation(true);
              } else {
                console.error(`Directions request failed: ${status}`);
              }
            }
          );
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback: Open Google Maps in a new tab
          window.open(
            "https://www.google.com/maps/dir/?api=1&destination=16.812,74.103",
            "_blank"
          );
        }
      );
    } else {
      // Browser doesn't support Geolocation
      window.open(
        "https://www.google.com/maps/dir/?api=1&destination=16.812,74.103",
        "_blank"
      );
    }
  };

  return (
    <div className="mt-4">
      <div
        ref={mapRef}
        className="w-full h-64 rounded-lg border border-brown-300"
      />
      {!showNavigation && (
        <button
          onClick={handleGetDirections}
          className="mt-4 flex items-center justify-center w-full bg-green-700 hover:bg-green-800 text-beige-100 font-semibold rounded py-2 transition-colors focus:outline-none focus:ring-4 focus:ring-green-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {t.getDirections}
        </button>
      )}
      {showNavigation && (
        <button
          onClick={() =>
            window.open(
              "https://www.google.com/maps/dir/?api=1&destination=16.812,74.103",
              "_blank"
            )
          }
          className="mt-4 flex items-center justify-center w-full bg-green-700 hover:bg-green-800 text-beige-100 font-semibold rounded py-2 transition-colors focus:outline-none focus:ring-4 focus:ring-green-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Get Navigation
        </button>
      )}
    </div>
  );
}

export default function ContactUs() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [mapsReady, setMapsReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load Google Maps API script
  useEffect(() => {
    // Load Google Maps script if not already added
    if (!document.querySelector("#google-maps-script")) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAHnI3UiwT-bhyHSMXf8fMccXK903BN8KA`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps script loaded");
        setMapsReady(true);
        setGoogleMapsLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      setMapsReady(true);
    }
  }, []);

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = t.required;
    if (!form.email.trim()) newErrors.email = t.required;
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    )
      newErrors.email = "Invalid email address";
    if (!form.phone.trim()) newErrors.phone = t.required;
    else if (!/^\+?[\d\s-]{7,15}$/.test(form.phone.trim()))
      newErrors.phone = "Invalid phone number";
    if (!form.message.trim()) newErrors.message = t.required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));
    setErrors((errs) => ({ ...errs, [e.target.id]: null }));
    setStatus(null);
  }

  async function handleSendEmail(e) {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;
    setLoading(true);

    try {
      const { data } = await axios.post(
        "https://trekrest.onrender.com/api/v1/user/send/contact-form",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      if (!data.success) throw new Error();
      setStatus({ type: "success", message: t.successEmail });
      setLoading(false);
      setForm({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    } catch (err) {
      setStatus({ type: "error", message: t.errorEmail });
      setLoading(false);
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    }
  }

  function handleSendWhatsApp(e) {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    try {
      const text = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nMessage: ${form.message}`
      );
      const waNumber = "9321803014";
      const url = `https://wa.me/${waNumber}?text=${text}`;
      window.open(url, "_blank");
      setStatus({ type: "success", message: t.successWhatsApp });
    } catch {
      setStatus({ type: "error", message: t.errorWhatsApp });
    }
  }

  return (
    <main className="min-h-screen bg-beige-100 px-4 py-8 sm:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT INFO PANEL */}
        <div className="bg-beige-50 rounded-xl shadow-md p-6 border border-brown-300 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brown-800 mb-4">
              {t.heading}
            </h1>
            <p className="text-brown-700 mb-6">{t.subtext}</p>

            <div className="space-y-3 text-brown-800">
              <p className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 mt-0.5 text-green-700 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <strong>{t.address}</strong>
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <strong>{t.phoneLabel}:</strong>{" "}
                <a
                  href="tel:+919321803014"
                  className="text-green-700 hover:underline ml-1"
                >
                  +91 9321803014
                </a>
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <strong>{t.emailLabel}:</strong>{" "}
                <a
                  href="mailto:surajkadam1706004@gmail.com"
                  className="text-green-700 hover:underline ml-1"
                >
                  surajkadam1706004@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex gap-4 mb-4">
              <a
                href="https://wa.me/93xxxxxxx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 text-xl hover:scale-110 transition flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-1"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.49" />
                </svg>
                WhatsApp
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brown-700 text-xl hover:scale-110 transition flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-1"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Instagram
              </a>
            </div>

            {googleMapsLoaded ? (
              mapsReady && <Map lang={lang} t={t} />
            ) : (
              <div className="w-full h-64 rounded-lg border border-brown-300 flex items-center justify-center bg-beige-100">
                <p className="text-brown-700">Loading map...</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="bg-beige-50 rounded-xl shadow-md p-6 border border-brown-300">
          <div className="flex justify-end mb-6">
            <label
              htmlFor="language-toggle"
              className="mr-2 font-semibold text-brown-900 select-none"
            >
              {t.language}:
            </label>
            <select
              id="language-toggle"
              value={lang}
              onChange={(e) => {
                setLang(e.target.value);
                setStatus(null);
                setErrors({});
              }}
              className="rounded border border-brown-400 bg-beige-100 text-brown-900 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="en">English</option>
              <option value="mr">मराठी</option>
            </select>
          </div>

          <form noValidate>
            <InputField
              label={t.name}
              id="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <InputField
              label={t.email}
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <InputField
              label={t.phone}
              id="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <TextAreaField
              label={t.message}
              id="message"
              value={form.message}
              onChange={handleChange}
              error={errors.message}
            />

            {status && (
              <p
                className={`mb-4 font-semibold ${
                  status.type === "success" ? "text-green-700" : "text-red-700"
                }`}
                role="alert"
              >
                {status.message}
              </p>
            )}

            <div className="flex gap-4">
              {!loading ? (
                <button
                  type="submit"
                  onClick={handleSendEmail}
                  className="flex-1 bg-brown-700 hover:bg-brown-800 text-beige-100 font-semibold rounded py-2 transition-colors focus:outline-none focus:ring-4 focus:ring-brown-400 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {t.sendEmail}
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSendEmail}
                  disabled
                  className="flex-1 bg-brown-700 hover:bg-brown-800 text-beige-100 font-semibold rounded py-2 transition-colors focus:outline-none focus:ring-4 focus:ring-brown-400 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Sending Email....
                </button>
              )}
              <button
                type="submit"
                onClick={handleSendWhatsApp}
                className="flex-1 bg-green-700 hover:bg-green-800 text-beige-100 font-semibold rounded py-2 transition-colors focus:outline-none focus:ring-4 focus:ring-green-400 flex items-center justify-center"
              >
                {t.sendWhatsApp}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
