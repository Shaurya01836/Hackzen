import { useRef } from "react";

export default function useDropdownTimeout(setterFn, delay = 200) {
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setterFn(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setterFn(false);
    }, delay);
  };

  return { handleMouseEnter, handleMouseLeave };
}
