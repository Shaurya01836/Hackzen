import * as React from "react";
const cn = (...classes) => classes.filter(Boolean).join(" ");

const RCard = React.forwardRef(({ className, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [showRipple, setShowRipple] = React.useState(false);
  const rippleTimeout = React.useRef();

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    handleMouseMove(e);
    setShowRipple(true);
    if (rippleTimeout.current) clearTimeout(rippleTimeout.current);
    rippleTimeout.current = setTimeout(() => setShowRipple(false), 600); // match animate-ping duration
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
    setShowRipple(false);
    if (rippleTimeout.current) clearTimeout(rippleTimeout.current);
  };

  const getRotation = () => {
    if (!isHovered)
      return "perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)";

    const rect = ref?.current?.getBoundingClientRect();
    if (!rect)
      return "perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)";

    // Calculate center-relative position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Normalize to -1 to 1 range
    const normalizedX = (mousePosition.x - centerX) / centerX;
    const normalizedY = (mousePosition.y - centerY) / centerY;

    // Increased rotation for more dramatic tilt effect (max 35 degrees)
    const maxRotation = 35;
    const rotateY = Math.max(
      -maxRotation,
      Math.min(maxRotation, normalizedX * maxRotation)
    );
    const rotateX = Math.max(
      -maxRotation,
      Math.min(maxRotation, -normalizedY * maxRotation)
    );

    return `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(40px)`;
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative group cursor-pointer overflow-hidden",
        "rounded-2xl border border-indigo-400/25",
        "bg-white/50 backdrop-blur-md",
        "shadow-md shadow-indigo-100/40 text-gray-900",
        "transition-all duration-200 ease-out",
        "hover:shadow-md hover:shadow-indigo-200/50",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: getRotation(),
        transition: isHovered ? "all 0.05s ease-out" : "all 0.4s ease-out",
      }}
      {...props}
    >
      {/* Ripple effect */}
      {showRipple && (
        <div 
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
            width: 100,
            height: 100,
          }}
        >
          <div className="w-full h-full rounded-full bg-indigo-400/20 animate-ping" />
        </div>
      )}
      
      {/* Content wrapper with additional hover effects */}
      <div className="relative z-10 transition-transform duration-300 group-hover:translate-y-[-2px]">
        {props.children}
      </div>
    </div>
  );
});
RCard.displayName = "Card";

const RCardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      "transition-all duration-300",
      className
    )}
    {...props}
  />
));
RCardHeader.displayName = "CardHeader";

const RCardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-gray-900",
      "transition-all duration-300 group-hover:text-indigo-900",
      "transform",
      className
    )}
    {...props}
  />
));
RCardTitle.displayName = "CardTitle";

const RCardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p 
    ref={ref} 
    className={cn(
      "text-sm text-gray-500 transition-all duration-300 delay-75",
      "group-hover:text-gray-600",
      className
    )} 
    {...props} 
  />
));
RCardDescription.displayName = "CardDescription";

const RCardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "p-6 pt-0 transition-all duration-300 delay-100",
      "group-hover:translate-x-1",
      className
    )} 
    {...props} 
  />
));
RCardContent.displayName = "CardContent";

const RCardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0 border-t border-gray-100",
      "transition-all duration-300 group-hover:border-indigo-200",
      "group-hover:translate-y-[-1px]",
      className
    )}
    {...props}
  />
));
RCardFooter.displayName = "CardFooter";


export {
  RCard,
  RCardHeader,
  RCardFooter,
  RCardTitle,
  RCardDescription,
  RCardContent,
};

