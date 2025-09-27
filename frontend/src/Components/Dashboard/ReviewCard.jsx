const ReviewCard = ({
  testimonial,
  onView,
  onStatusUpdate,
  onDelete,
  actionLoading,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const truncateMessage = (message, maxLength = 80) => {
    if (!message) return "";
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 border border-amber-200">
      {/* Header with user info and status */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 bg-amber-200 rounded-full flex items-center justify-center mr-3">
            <span className="font-medium text-amber-800">
              {testimonial.user && testimonial.user.name
                ? testimonial.user.name.charAt(0).toUpperCase()
                : "U"}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-900">
              {testimonial.user && testimonial.user.name
                ? testimonial.user.name
                : "Unknown User"}
            </h3>
            <p className="text-xs text-amber-600">
              {new Date(testimonial.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            testimonial.status
          )}`}
        >
          {testimonial.status.charAt(0).toUpperCase() +
            testimonial.status.slice(1)}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${
              star <= testimonial.rating ? "text-amber-500" : "text-amber-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <p className="text-sm text-amber-800">
          {truncateMessage(testimonial.comment)}
          {testimonial.comment && testimonial.comment.length > 80 && (
            <button
              onClick={() => onView(testimonial)}
              className="ml-1 text-green-600 hover:text-green-800 text-sm font-medium"
            >
              View more
            </button>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-amber-100">
        <button
          onClick={() => onView(testimonial)}
          className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Details
        </button>

        <div className="flex space-x-2">
          {testimonial.status !== "approved" && (
            <button
              onClick={() => onStatusUpdate(testimonial._id, "approved")}
              disabled={
                actionLoading.type === "status" &&
                actionLoading.id === testimonial._id
              }
              className="text-green-600 hover:text-green-800"
              title="Approve review"
            >
              {actionLoading.type === "status" &&
              actionLoading.id === testimonial._id ? (
                <svg
                  className="animate-spin h-5 w-5 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          )}

          {testimonial.status !== "rejected" && (
            <button
              onClick={() => onStatusUpdate(testimonial._id, "rejected")}
              disabled={
                actionLoading.type === "status" &&
                actionLoading.id === testimonial._id
              }
              className="text-red-600 hover:text-red-800"
              title="Reject review"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <button
            onClick={() => onDelete(testimonial._id)}
            disabled={
              actionLoading.type === "delete" &&
              actionLoading.id === testimonial._id
            }
            className="text-brown-600 hover:text-brown-800"
            title="Delete review"
          >
            {actionLoading.type === "delete" &&
            actionLoading.id === testimonial._id ? (
              <svg
                className="animate-spin h-5 w-5 text-brown-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
