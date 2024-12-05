import React from "react";
import { getPercentage } from "../util/Conversions";

const CampaignCard = ({ data }) => {
  const isClosed = getPercentage(data?.amountCollected, data?.target) > 100;
  const progressPercentage = Math.min(
    getPercentage(data?.amountCollected, data?.target),
    100
  );

  return (
    <>
      {data && (
        <div
          onClick={() => (window.location.href = `/campaign/${data.id}`)}
          className="min-w-[280px] rounded-xl shadow-lg dark:shadow-none hover:shadow-2xl hover:dark:shadow-xl transition-shadow duration-300 p-0 border dark:border-gray-700 bg-white dark:bg-gray-900 border-gray-300 w-96 h-[460px] cursor-pointer"
        >
          {/* Campaign Image */}
          <div className="w-full h-[240px] rounded-t-xl overflow-hidden relative bg-gray-200 dark:bg-gray-800">
            <img
              src={data.image}
              alt="campaign"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Campaign Details */}
          <div className="p-4">
            {/* Title and Description */}
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
              {data.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {data.description}
            </p>

            {/* Progress */}
            <div className="mt-4">
              <div className="relative w-full h-4 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${
                    isClosed ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                {isClosed
                  ? "Campaign Closed"
                  : `${progressPercentage}% Completed`}
              </p>
            </div>

            {/* Target and Deadline */}
            <div className="flex justify-between mt-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Target
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {data.target} ETH
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Deadline
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {data.deadline}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignCard;
