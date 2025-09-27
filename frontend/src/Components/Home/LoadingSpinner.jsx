import { useEffect, useState } from "react";
import logo from "/logo_green.png"; // put logo in public folder or import directly

export default function LoadingSpinner() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2500); // simulate loading complete
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="preloader"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-800 ${
        loaded ? "opacity-0 pointer-events-none" : "opacity-100"
      } bg-gradient-to-br from-[#0f3c2f] to-[#1a5c47]`}
    >
      {/* Logo */}
      <div className="relative w-[120px] h-[120px] mb-8">
        <img
          src={logo}
          alt="Logo"
          className="w-full h-full object-contain animate-pulse drop-shadow-[0_0_15px_rgba(72,187,120,0.5)]"
        />
      </div>

      {/* Spinner Rings */}
      <div className="relative w-[80px] h-[80px]">
        <div className="absolute w-full h-full rounded-full border-4 border-transparent border-t-[#48bb78] border-r-[#48bb78] animate-[spin_2.2s_linear_infinite]" />
        <div className="absolute w-full h-full rounded-full border-4 border-transparent border-b-[#38a169] border-l-[#38a169] animate-[spin_1.8s_linear_infinite_reverse]" />
        <div className="absolute w-[70%] h-[70%] top-[15%] left-[15%] rounded-full border-4 border-[#48bb784d] border-t-transparent animate-[spin_2.5s_linear_infinite]" />
      </div>

      {/* Progress Bar */}
      <div className="w-[200px] h-[4px] bg-white/20 rounded mt-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#48bb78] to-[#68d391] rounded animate-[progress_2s_ease-in-out_infinite]" />
      </div>

      {/* Loading Text */}
      <div className="text-white text-[1.3rem] tracking-[2px] uppercase mt-8 relative">
        Loading
        <span className="ml-1 animate-[dots_1.5s_steps(4,end)_infinite]"></span>
      </div>
    </div>
  );
}
