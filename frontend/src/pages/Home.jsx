import React, { useEffect, useRef, useState } from "react";
import HeroBanner from "../Components/Home/HeroBanner";
import BookingCardStatic from "../Components/BookingCardStatic";
import Testimonials from "../Components/Home/Testimonials";

// मूळ चिन्हे
import {
  FiUserCheck,
  FiUsers,
  FiShield,
  FiCalendar,
  FiMap,
  FiCreditCard,
  FiFlag,
} from "react-icons/fi";
import { FaMountain, FaHiking, FaStar } from "react-icons/fa";

const Home = () => {
  const trekSectionRef = useRef(null);
  const scrollToTrekSection = () => {
    trekSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="overflow-hidden">
      <HeroBanner
        title="पन्हाळा ते पावनखिंड पदभ्रमण"
        subtitle="शिवकालीन इतिहासाच्या पायवाटांवर एक अद्भुत अनुभव"
        ctaText="बुकिंग करा"
        ctaLink="/treks"
        bgImage="https://upload.wikimedia.org/wikipedia/commons/3/32/Panhalgad.jpg"
        onBookClick={scrollToTrekSection}
      />

      {/* ट्रेक्स विभाग */}
      <section
        className="relative py-16 bg-gradient-to-b from-amber-50 to-amber-100 overflow-hidden"
        ref={trekSectionRef}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"></div>
        <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"></div>

        {/* Corner decorative elements */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500 opacity-70"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500 opacity-70"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500 opacity-70"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500 opacity-70"></div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full pattern-dots pattern-amber-400 pattern-opacity-30 pattern-size-6"></div>
          <div className="absolute top-0 right-0 w-72 h-72 -mr-36 -mt-36 bg-amber-400 rounded-full mix-blend-overlay opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 -ml-48 -mb-48 bg-amber-500 rounded-full mix-blend-overlay opacity-15"></div>
        </div>

        <div className="w-full px-2 sm:px-4 text-center relative z-10">
          {/* Section header with Maratha-inspired design */}

          {/* Booking card container with decorative frame */}
          <div className="relative">
            <div className="absolute -inset-2 sm:-inset-3 bg-amber-700 rounded-xl opacity-20 blur-md"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-amber-300 p-4 sm:p-6 md:p-8">
              <div className="flex justify-center">
                <div className="w-full md:w-3/4 lg:w-1/2">
                  <BookingCardStatic />
                </div>
              </div>
            </div>

            {/* Decorative elements around the card */}
            <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-t-2 border-l-2 border-amber-500 rounded-tl-lg"></div>
            <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-t-2 border-r-2 border-amber-500 rounded-tr-lg"></div>
            <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-b-2 border-l-2 border-amber-500 rounded-bl-lg"></div>
            <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-b-2 border-r-2 border-amber-500 rounded-br-lg"></div>
          </div>
        </div>

        {/* Custom styles for the dot pattern */}
        <style>
          {`
      .pattern-dots {
        background-image: radial-gradient(currentColor 1px, transparent 1px);
        background-size: 15px 15px;
      }
    `}
        </style>
      </section>
      {/* आम्हाला का निवडावे */}

      <section>
        <div className="relative">
          <div className="absolute -inset-2 sm:-inset-3 bg-amber-700 rounded-xl opacity-20 blur-md"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-amber-300 p-4 sm:p-6 md:p-8">
            <div className="flex justify-center">
              <div className="w-full">
                <Testimonials />
              </div>
            </div>
          </div>

          {/* Decorative elements around the card */}
          <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-t-2 border-l-2 border-amber-500 rounded-tl-lg"></div>
          <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-t-2 border-r-2 border-amber-500 rounded-tr-lg"></div>
          <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-b-2 border-l-2 border-amber-500 rounded-bl-lg"></div>
          <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 w-4 sm:w-6 md:w-8 h-4 sm:h-6 md:h-8 border-b-2 border-r-2 border-amber-500 rounded-br-lg"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
