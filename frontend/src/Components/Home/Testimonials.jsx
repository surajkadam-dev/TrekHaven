import React, { useEffect, useState } from "react";
import { fetchTestimonials } from "../../store/slices/TestimonialSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaQuoteLeft, FaUser, FaSadTear } from "react-icons/fa";

const Testimonials = ({
  Testimonial,
  TestMonialSub,
  NoTestimonialFirstPara,
  NoTestimonialSecPara,
  loadingTestTitle,
  loadingAnimationText,
}) => {
  const dispatch = useDispatch();
  const { testimonials, loading, error } = useSelector(
    (store) => store.testimonial
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  // Filter approved testimonials
  const approvedTestimonials = testimonials.filter(
    (testimonial) => testimonial.status === "approved"
  );

  // Handle next button click
  const handleNext = () => {
    if (approvedTestimonials.length <= 3) return;
    setDirection("next");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 3 >= approvedTestimonials.length ? 0 : prevIndex + 1
      );
      setDirection(null);
    }, 300);
  };

  // Handle previous button click
  const handlePrev = () => {
    if (approvedTestimonials.length <= 3) return;
    setDirection("prev");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? approvedTestimonials.length - 3 : prevIndex - 1
      );
      setDirection(null);
    }, 300);
  };

  // Get current testimonials to display
  const getCurrentTestimonials = () => {
    if (approvedTestimonials.length <= 3) return approvedTestimonials;

    const testimonialsToShow = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % approvedTestimonials.length;
      testimonialsToShow.push(approvedTestimonials[index]);
    }
    return testimonialsToShow;
  };

  // Star rating component
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar
            key={`full-${i}`}
            className="w-5 h-5 text-yellow-400 fill-current"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: "50%" }}
            >
              <FaStar className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
            <FaStar className="w-5 h-5 text-gray-300 fill-current" />
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar
            key={`empty-${i}`}
            className="w-5 h-5 text-gray-300 fill-current"
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-900">
            {loadingTestTitle}
          </h2>
          <div className="flex justify-center">
            <div className="animate-pulse text-green-800">
              {loadingAnimationText}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-900">
            {Testimonial}
          </h2>
          <div className="flex justify-center">
            <div className="text-red-600">त्रुटी: {error}</div>
          </div>
        </div>
      </section>
    );
  }

  if (approvedTestimonials.length === 0) {
    return (
      <section className="py-16 bg-green-50 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-24 h-24 opacity-10">
          <svg viewBox="0 0 100 100" className="text-green-700">
            <path
              d="M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 w-20 h-20 opacity-10">
          <svg viewBox="0 0 100 100" className="text-green-700">
            <path
              d="M20,0 L30,40 L70,50 L30,60 L20,100 L10,60 L-30,50 L10,40 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-4 text-green-900">
            {Testimonial}
          </h2>
          <p className="text-center text-green-700 mb-12">{TestMonialSub}</p>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-green-200 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <FaSadTear className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                {NoTestimonialFirstPara}
              </h3>
              <p className="text-green-600 mb-6">{NoTestimonialSecPara}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentTestimonials = getCurrentTestimonials();

  return (
    <section className="py-16 bg-green-50 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-24 h-24 opacity-10">
        <svg viewBox="0 0 100 100" className="text-green-700">
          <path
            d="M50,0 L60,40 L100,50 L60,60 L50,100 L40,60 L0,50 L40,40 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="absolute bottom-10 right-10 w-20 h-20 opacity-10">
        <svg viewBox="0 0 100 100" className="text-green-700">
          <path
            d="M20,0 L30,40 L70,50 L30,60 L20,100 L10,60 L-30,50 L10,40 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-4 text-green-900">
          {Testimonial}
        </h2>
        <p className="text-center text-green-700 mb-12">{TestMonialSub}</p>

        <div className="relative max-w-6xl mx-auto">
          {/* Testimonials container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {currentTestimonials.map((testimonial, index) => (
              <div
                key={testimonial._id}
                className={`bg-white rounded-xl shadow-lg p-6 border border-green-200 transition-all duration-300 transform ${
                  direction === "next"
                    ? "opacity-0 translate-x-10"
                    : direction === "prev"
                    ? "opacity-0 -translate-x-10"
                    : "opacity-100 translate-x-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-4 left-4 text-green-200">
                  <FaQuoteLeft className="w-6 h-6" />
                </div>
                <div className="mb-4 mt-10">
                  <StarRating rating={testimonial.rating} />
                </div>
                <p className="text-gray-700 italic mb-6 relative z-10">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center mt-4">
                  <div className="bg-green-100 text-green-800 rounded-full h-12 w-12 flex items-center justify-center font-bold mr-3">
                    {testimonial?.user?.name?.charAt(0) || (
                      <FaUser className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-900">
                      {testimonial?.user?.name || "अनामिक पाहुणे"}
                    </h4>
                    <p className="text-sm text-green-600">
                      {testimonial?.user?.role === "admin"
                        ? "प्रशासक"
                        : "ट्रेकर"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation controls - desktop */}
          {approvedTestimonials.length > 3 && (
            <>
              <button
                onClick={handlePrev}
                className="hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 z-20 bg-green-700 hover:bg-green-800 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                aria-label="Previous testimonials"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 z-20 bg-green-700 hover:bg-green-800 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                aria-label="Next testimonials"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Navigation controls - mobile */}
          {approvedTestimonials.length > 3 && (
            <div className="flex md:hidden justify-center space-x-8 mt-8">
              <button
                onClick={handlePrev}
                className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                aria-label="Previous testimonials"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                aria-label="Next testimonials"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Indicator dots */}
          {approvedTestimonials.length > 3 && (
            <div className="flex justify-center mt-8">
              {Array.from({
                length: Math.ceil(approvedTestimonials.length / 3),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * 3)}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    Math.floor(currentIndex / 3) === index
                      ? "bg-green-700"
                      : "bg-green-300"
                  }`}
                  aria-label={`Go to testimonial group ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
