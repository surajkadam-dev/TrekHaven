import {
  FaScroll,
  FaRupeeSign,
  FaUndo,
  FaClock,
  FaBoxOpen,
  FaHandshake,
} from "react-icons/fa";

const TermsAndConditions = () => {
  const terms = [
    {
      icon: <FaRupeeSign className="text-amber-600 text-2xl" />,
      title: "Payment Policy",
      description:
        "All bookings must be paid in advance through our website, just as the Maratha treasury collected taxes before services were rendered.",
    },
    {
      icon: <FaUndo className="text-amber-600 text-2xl" />,
      title: "Cancellation Policy",
      description:
        "Cancellations are allowed only within 48 hours of booking, similar to how the Maratha administration allowed a grace period for trade agreements.",
    },
    {
      icon: <FaClock className="text-amber-600 text-2xl" />,
      title: "Refund Policy",
      description:
        "Refunds (if applicable) will be processed within 5–7 business days, following the meticulous accounting practices of the Maratha Empire.",
    },
    {
      icon: <FaBoxOpen className="text-amber-600 text-2xl" />,
      title: "Shipping Policy",
      description:
        "We do not provide any shipping of physical goods, as our services are digital like the swift messages carried by Maratha horseback messengers.",
    },
    {
      icon: <FaHandshake className="text-amber-600 text-2xl" />,
      title: "Agreement",
      description:
        "By using our website and making a booking, you agree to these terms and conditions, just as subjects agreed to the laws of the Maratha Kingdom.",
    },
  ];

  return (
    <div className="min-h-screen bg-amber-50 text-amber-900">
      {/* Hero Section with Maratha Theme */}
      <div className="relative bg-amber-800 text-amber-50 py-16">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-amber-700 p-3 rounded-full mb-6">
            <FaScroll className="text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
            राजकीय अटी आणि नियम
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            The Royal Decrees of our digital kingdom
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-amber-700"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12 border-2 border-amber-700">
            <h2 className="text-3xl font-bold mb-6 text-amber-800 font-serif">
              Welcome to Our Digital Kingdom
            </h2>
            <p className="mb-4 text-lg">
              Just as the great Maratha Empire had its codes of conduct, we too
              have established these terms to ensure fair and transparent
              dealings with all who engage with our services.
            </p>
            <p className="text-lg">
              These terms are binding, much like the treaties signed during the
              reign of Chhatrapati Shivaji Maharaj. Please read them carefully
              before proceeding.
            </p>
          </div>

          {/* Terms List */}
          <div className="space-y-8">
            {terms.map((term, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-amber-700"
              >
                <div className="bg-amber-700 text-amber-50 p-4 flex items-center">
                  <div className="mr-4">{term.icon}</div>
                  <h3 className="text-xl font-bold">{term.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-amber-800">{term.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Final Note */}
          <div className="mt-12 bg-amber-100 border-l-4 border-amber-700 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold mb-3 text-amber-800">
              Royal Proclamation
            </h3>
            <p>
              These terms may be updated periodically, just as the Maratha
              administration would issue new edicts. Continued use of our
              services constitutes acceptance of any modifications.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">
            © {new Date().getFullYear()} Inspired by the Great Maratha Empire
          </p>
          <p className="text-amber-200">
            "When justice is lost, the foundation of sovereignty is destroyed."
            - Chhatrapati Shivaji Maharaj
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
