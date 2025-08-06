import React from "react";

const PopupModal = () => {
  return (
    <div
      className="fixed top-0 left-0 z-50 flex h-full w-full items-end justify-center bg-black/40"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="flex w-full flex-col items-stretch bg-slate-50">
        {/* Drag handle */}
        <button className="flex h-5 w-full items-center justify-center">
          <div className="h-1 w-9 rounded-full bg-[#cedbe8]" />
        </button>

        {/* Modal content */}
        <div className="flex-1">
          <h1 className="px-4 pb-3 pt-5 text-left text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#0d141c]">
            Exclusive Offer
          </h1>
          <p className="px-4 pt-1 pb-3 text-base font-normal leading-normal text-[#0d141c]">
            Get 20% off your first purchase. Limited time only!
          </p>

          <div className="flex w-full grow bg-slate-50 @container p-4">
            <div className="flex aspect-[2/3] w-full overflow-hidden rounded-xl bg-slate-50 gap-1 @[480px]:gap-2">
              <div
                className="aspect-auto flex-1 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC0OMizaiFDi1DE5f8CWJmyUSXmsciVJ0gg_Tohrlar1DDUYCFKZJhVOX_kw2CDL2vHUcc4DvRVLxd2A88OrJMOKknojmr9xE_dXmX9eoHnHmz-xcx1f9qccZZItosXNO22PEjfK-Jd0KYk4cv_fYHpqffQp31hgQI_ck5xIwxQFZKtvDXTLRQMrmvS1oa0bzLHP19VGLlOPB2O4KhhFIoFA50K68K7upz2CpLiDC_9joS9-1ZoZeYXjP7G8W7Qee78_udHmkOnmzU")',
                }}
              />
            </div>
          </div>

          {/* CTA button */}
          <div className="flex px-4 py-3">
            <button className="flex h-10 min-w-[84px] max-w-[480px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#0d80f2] px-4 text-sm font-bold leading-normal tracking-[0.015em] text-slate-50">
              <span className="truncate">Shop Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
