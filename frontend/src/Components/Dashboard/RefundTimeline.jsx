import React from "react";

const RefundTimeline = ({ timeline, onBack, refundData }) => {
  // Get status with proper formatting
  const getStatusInfo = (status) => {
    switch (status) {
      case "initiated":
        return {
          text: "Initiated",
          color: "text-amber-600",
          bg: "bg-amber-100",
          border: "border-amber-200",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      case "processing":
        return {
          text: "Processing",
          color: "text-blue-600",
          bg: "bg-blue-100",
          border: "border-blue-200",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      case "refunded":
        return {
          text: "Refunded",
          color: "text-green-600",
          bg: "bg-green-100",
          border: "border-green-200",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      case "failed":
        return {
          text: "Failed",
          color: "text-red-600",
          bg: "bg-red-100",
          border: "border-red-200",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
      default:
        return {
          text: status,
          color: "text-gray-600",
          bg: "bg-gray-100",
          border: "border-gray-200",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          ),
        };
    }
  };

  // Find the current status for the main header
  const currentStatus =
    timeline.length > 0 ? timeline[timeline.length - 1].status : "initiated";
  const statusInfo = getStatusInfo(currentStatus);

  // Timeline steps configuration
  const timelineSteps = [
    {
      status: "initiated",
      title: "Initiated",
      description: "Refund request initiated by user",
      icon: statusInfo.icon,
    },
    {
      status: "processing",
      title: "Processing",
      description: "Refund request sent to payment processor",
      icon: statusInfo.icon,
    },
    {
      status: "refunded",
      title: "Refunded",
      description: `Refund of ₹${
        refundData.amount || "0.00"
      } completed successfully`,
      icon: statusInfo.icon,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-16 md:mt-0">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Refunds
          </button>

          <span
            className={`py-2 px-4 text-center rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border flex items-center`}
          >
            {statusInfo.icon}
            <span className="ml-2">{statusInfo.text}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Refund Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{refundData.amount || "0.00"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Indian Rupee (INR)</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Refund ID</p>
            <p className="text-lg font-semibold text-gray-900">
              {refundData?.refundPaymentId || "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Initiated On</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(refundData.initiatedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(refundData.initiatedAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Modern Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Refund Timeline
        </h3>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          {timelineSteps.map((step, index) => {
            const timelineItem = timeline.find(
              (item) => item.status === step.status
            );
            const isCompleted = timeline.some(
              (item) => item.status === step.status
            );
            const isCurrent = currentStatus === step.status;
            const stepStatusInfo = getStatusInfo(step.status);

            return (
              <div key={step.status} className="flex mb-8 relative">
                <div className="flex flex-col items-center mr-6">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center z-10 ${
                      isCompleted ? stepStatusInfo.bg : "bg-gray-200"
                    } ${stepStatusInfo.border} border-2`}
                  >
                    <div
                      className={
                        isCompleted ? stepStatusInfo.color : "text-gray-500"
                      }
                    >
                      {stepStatusInfo.icon}
                    </div>
                  </div>
                  {index < timelineSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-16 ${
                        isCompleted ? "bg-blue-400" : "bg-gray-300"
                      } mt-2`}
                    ></div>
                  )}
                </div>

                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-semibold uppercase ${
                        isCompleted ? stepStatusInfo.color : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                    {timelineItem && (
                      <span className="text-xs text-gray-500">
                        {new Date(timelineItem.date).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-3">{step.description}</p>

                  {isCurrent && step.status === "processing" && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-800 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Refund processing
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        Takes 3-5 working days. The amount will be credited to
                        your original payment method.
                      </p>
                    </div>
                  )}

                  {isCurrent && step.status === "refunded" && timelineItem && (
                    <div className="mt-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-800 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Refund processed successfully
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        Amount will be credited to your bank account within 5-7
                        working days after the refund has processed.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-3 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Important Information
        </h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Refunds are processed to the original payment method</span>
          </li>
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              It may take 5-10 business days for the refund to reflect in your
              account
            </span>
          </li>
          <li className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              For any queries, please contact our support team at
              surajkadam1706004@gmail.com
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RefundTimeline;
