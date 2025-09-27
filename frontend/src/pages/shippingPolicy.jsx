import {
  FaHorse,
  FaEnvelope,
  FaSms,
  FaUndo,
  FaMoneyBillWave,
} from "react-icons/fa";

const ShippingPolicy = () => {
  const policies = [
    {
      icon: <FaHorse className="text-amber-600 text-2xl" />,
      title: "Physical Products",
      description:
        "We do not ship physical products. Like the swift Maratha messengers, we deliver only digital confirmations.",
    },
    {
      icon: <FaEnvelope className="text-amber-600 text-2xl" />,
      title: "Service Delivery",
      description:
        "Our services include homestay and food bookings, which are confirmed immediately after payment via royal decrees (email/SMS), just as announcements were made in the Maratha courts.",
    },
    {
      icon: <FaUndo className="text-amber-600 text-2xl" />,
      title: "Cancellation Grace Period",
      description:
        "Cancellations are allowed within 48 hours of booking, similar to the grace period granted by Maratha administrators for hospitality arrangements.",
    },
    {
      icon: <FaMoneyBillWave className="text-amber-600 text-2xl" />,
      title: "Refund Processing",
      description:
        "Refunds, if applicable, will be processed within 5–7 business days, following the meticulous treasury protocols of the Maratha Empire.",
    },
  ];

  return (
    <div className="min-h-screen bg-amber-50 text-amber-900">
      {/* Hero Section with Maratha Theme */}
      <div className="relative bg-amber-800 text-amber-50 py-16">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-amber-700 p-3 rounded-full mb-6">
            <FaHorse className="text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
            सेवा धोरण
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            The Royal Decree on Service Delivery
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
              Maratha Hospitality Policies
            </h2>
            <p className="mb-4 text-lg">
              Just as the Maratha Empire was known for its excellent
              administration and hospitality, we maintain clear policies for our
              homestay and food booking services.
            </p>
            <p className="text-lg">
              These policies ensure smooth service delivery, much like the
              efficient systems established by the Peshwas for governing their
              empire.
            </p>
          </div>

          {/* Policies List */}
          <div className="space-y-8">
            {policies.map((policy, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-amber-700"
              >
                <div className="bg-amber-700 text-amber-50 p-4 flex items-center">
                  <div className="mr-4">{policy.icon}</div>
                  <h3 className="text-xl font-bold">{policy.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-amber-800">{policy.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Final Note */}
          <div className="mt-12 bg-amber-100 border-l-4 border-amber-700 p-6 rounded-r-lg">
            <h3 className="text-xl font-bold mb-3 text-amber-800">
              Royal Assurance
            </h3>
            <p>
              We uphold the Maratha values of honesty and efficiency in all our
              services. Your comfort and satisfaction are our top priorities,
              just as citizen welfare was paramount to the Maratha rulers.
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
            "The true measure of a kingdom is in the satisfaction of its
            guests." - Inspired by Maratha hospitality principles
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ShippingPolicy;
