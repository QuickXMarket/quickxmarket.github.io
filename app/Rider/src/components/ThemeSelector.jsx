import React, { useState, useEffect } from "react";
import { useCoreContext } from "../context/CoreContext";

const ThemeSelector = ({ open, onClose }) => {
  const { toggleTheme, Preferences } = useCoreContext();
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    if (!open) return;

    const getTheme = async () => {
      try {
        const { value } = await Preferences.get({ key: "theme" });
        setTheme(value || "system"); 
      } catch (err) {
        console.error("Failed to get theme:", err);
        setTheme("system");
      }
    };

    getTheme();
  }, [open, Preferences]);

  return (
    <div>
      {open && (
        <div
          className="flex absolute top-0 left-0 h-full w-full flex-col justify-end items-stretch bg-[#141414]/40"
          onClick={onClose}
        >
          <div
            className="flex flex-col items-stretch bg-gray-50 rounded-t-xl"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Drag handle */}
            <button className="flex h-5 w-full items-center justify-center">
              <div className="h-1 w-9 rounded-full bg-[#cedbe8]"></div>
            </button>

            {/* Content */}
            <div className="flex-1">
              <h1 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
                Theme
              </h1>

              {/* Theme options */}
              <div className="flex flex-col gap-3 p-4">
                {/* System */}
                <label className="flex items-center gap-4 rounded-lg border border-solid border-[#cedbe8] p-[15px] flex-row-reverse cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    checked={theme === "system"}
                    onChange={() => {
                      toggleTheme("system");
                      setTheme("system");
                      onClose();
                    }}
                    className="h-5 w-5 border-2 border-[#cedbe8] text-primary accent-primary"
                  />
                  <div className="flex grow flex-col">
                    <p className="text-text text-sm font-medium">
                      System Default
                    </p>
                  </div>
                </label>

                {/* Light */}
                <label className="flex items-center gap-4 rounded-lg border border-solid border-[#cedbe8] p-[15px] flex-row-reverse cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    checked={theme === "light"}
                    onChange={() => {
                      toggleTheme("light");
                      setTheme("light");
                      onClose();
                    }}
                    className="h-5 w-5 border-2 border-[#cedbe8] text-primary accent-primary"
                  />
                  <div className="flex grow flex-col">
                    <p className="text-text text-sm font-medium">Light</p>
                  </div>
                </label>

                {/* Dark */}
                <label className="flex items-center gap-4 rounded-lg border border-solid border-[#cedbe8] p-[15px] flex-row-reverse cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    checked={theme === "dark"}
                    onChange={() => {
                      toggleTheme("dark");
                      setTheme("dark");
                      onClose();
                    }}
                    className="h-5 w-5 border-2 border-[#cedbe8] text-primary accent-primary"
                  />
                  <div className="flex grow flex-col">
                    <p className="text-text text-sm font-medium">Dark</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
