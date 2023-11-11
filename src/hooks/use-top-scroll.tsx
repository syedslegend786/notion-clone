"use client";
import { useEffect, useState } from "react";

export function useTopScroll(threshHold = 10) {
  const [scrolled, setscrolled] = useState(false);
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > threshHold) {
        setscrolled(true);
      } else {
        setscrolled(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshHold]);
  return {
    scrolled,
  };
}
