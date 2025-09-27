import {
  FaGavel,
  FaEnvelope,
  FaPhone,
  FaMoneyBillWave,
  FaClock,
  FaBan,
} from "react-icons/fa";

const CancellationRefund = () => {
  const policies = [
    {
      icon: <FaClock className="text-amber-600 text-2xl" />,
      title: "Cancellation Window",
      description:
        "Customers can cancel their booking within 48 hours of making the payment, similar to the grace period granted by Maratha administrators for trade agreements.",
    },
    {
      icon: <FaEnvelope className="text-amber-600 text-2xl" />,
      title: "Contact for Cancellation",
      description: (
        <>
          To request a cancellation, please contact us through royal channels:
          <br />
          <div className="mt-2 pl-6">
            <div className="flex items-center mb-1">
              <FaEnvelope className="mr-2 text-amber-700" />
              <span>Email: surajkadam1706004@gmail.com</span>
            </div>
            <div className="flex items-center">
              <FaPhone className="mr-2 text-amber-700" />
              <span>Phone: +91-9321803014</span>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: <FaMoneyBillWave className="text-amber-600 text-2xl" />,
      title: "Refund Process",
      description:
        "If cancellation is made within the allowed time frame, the refund will be initiated to the original payment method, following the treasury protocols of the Maratha Empire.",
    },
    {
      icon: <FaClock className="text-amber-600 text-2xl" />,
      title: "Processing Time",
      description:
        "Refunds will be processed within 5–7 business days, depending on your bank/payment provider, just as royal decrees took time to reach all corners of the kingdom.",
    },
    {
      icon: <FaBan className="text-amber-600 text-2xl" />,
      title: "Late Cancellations",
      description:
        "No cancellations or refunds will be accepted after 48 hours of booking, as the Maratha administration was firm about deadlines for trade agreements.",
    },
    {
      icon: <FaGavel className="text-amber-600 text-2xl" />,
      title: "Dispute Resolution",
      description:
        "In case of any dispute, the decision of our business will be final, much like the judgments passed in the royal courts of the Maratha Kingdom.",
    },
  ];

  return (
    <div className="min-h-screen bg-amber-50 text-amber-900">
      {/* Hero Section with Maratha Theme */}
      <div className="relative bg-amber-800 text-amber-50 py-16">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-amber-700 p-3 rounded-full mb-6">
            <FaGavel className="text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
            रद्दीकरण आणि परतावा धोरण
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            The Royal Decree on Cancellations and Refunds
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
              Royal Financial Policies
            </h2>
            <p className="mb-4 text-lg">
              Just as the Maratha Empire had clear policies for trade and
              taxation, we have established these cancellation and refund
              policies to ensure fair dealings with all subjects of our digital
              kingdom.
            </p>
            <p className="text-lg">
              These policies are as binding as the treaties signed during the
              reign of Chhatrapati Shivaji Maharaj. Please review them carefully
              before making any bookings.
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
              Royal Proclamation
            </h3>
            <p>
              These policies are part of our broader terms of service. The
              Maratha Empire was known for its fair administration, and we
              strive to maintain those values in all our dealings.
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
            "The strength of a kingdom lies in the fairness of its
            administration." - Chhatrapati Shivaji Maharaj
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CancellationRefund;
