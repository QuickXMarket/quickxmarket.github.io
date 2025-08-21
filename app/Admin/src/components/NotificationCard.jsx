import React from "react";

const NotificationCard = ({ title, message, icon }) => {
    
  return (
    <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2 rounded-md">
      <div className="text-text flex items-center justify-center rounded-lg bg-[#e7edf4] shrink-0 size-12">
        {icon ? (
          icon
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" />
          </svg>
        )}
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-text text-base font-medium leading-normal line-clamp-1">
          {title}
        </p>
        <p className="text-gray-200 text-sm font-normal leading-normal line-clamp-2">
          {message}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;
