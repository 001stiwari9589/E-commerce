import { useRef, useEffect } from "react";

function OtpInput({ length = 4, value = "", onChange, showOtp = true, autoFocus = true }) {
  const inputRefs = useRef([]);

  // Ensure digits array matches length
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleInputChange = (index, e) => {
    const rawVal = e.target.value;
    
    // Handle typing multiple digits or paste in single box
    if (rawVal.length > 1) {
      const cleanDigits = rawVal.replace(/\D/g, "").slice(0, length);
      if (cleanDigits) {
        onChange(cleanDigits);
        const nextIndex = Math.min(cleanDigits.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
      }
      return;
    }

    // Handle single digit input
    const singleDigit = rawVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = singleDigit;
    const newOtp = newDigits.join("");
    onChange(newOtp);

    // Auto advance to next input box if single digit entered
    if (singleDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Current box is empty, delete previous digit and move focus back
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current box
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasteData) {
      onChange(pasteData);
      const targetIndex = Math.min(pasteData.length, length - 1);
      inputRefs.current[targetIndex]?.focus();
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 w-full my-1">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type={showOtp ? "text" : "password"}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={length} // Allow pasting long strings into box
          value={digits[index]}
          onChange={(e) => handleInputChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-xl border transition-all outline-none shadow-xs select-all ${
            digits[index]
              ? "border-blue-500 dark:border-amber-500 bg-blue-50/50 dark:bg-amber-500/10 text-blue-700 dark:text-amber-400 ring-2 ring-blue-500/20 dark:ring-amber-500/20"
              : "border-gray-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-amber-500 focus:bg-white dark:focus:bg-zinc-750 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-amber-500/20"
          }`}
        />
      ))}
    </div>
  );
}

export default OtpInput;
