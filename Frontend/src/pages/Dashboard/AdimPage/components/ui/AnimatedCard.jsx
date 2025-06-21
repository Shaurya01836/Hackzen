import * as React from "react";

// Mock cn function for className merging
const cn = (...classes) => classes.filter(Boolean).join(' ');

const ACard = React.forwardRef(({ className, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative group cursor-pointer overflow-hidden",
        "ring-1 ring-indigo-300 rounded-2xl border border-white/20",
        "bg-gradient-to-br from-white/10 to-indigo-200/10 backdrop-blur-lg",
        "shadow-sm shadow-indigo-300 text-gray-900",
        "transition-all duration-500 ease-out",
        "transform-gpu perspective-1000",
        "hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:shadow-indigo-400/30",
        "hover:ring-2 hover:ring-indigo-400",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "before:translate-x-[-100%] before:skew-x-12 before:transition-transform before:duration-1000",
        "hover:before:translate-x-[100%]",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${(mousePosition.y - 150) * 0.05}deg) rotateY(${(mousePosition.x - 150) * 0.05}deg) translateZ(20px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: 'all 0.3s ease-out'
      }}
      {...props}
    >
      {isHovered && (
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
      <div className="relative z-10 transition-transform duration-300 group-hover:translate-y-[-2px]">
        {props.children}
      </div>
    </div>
  );
});
ACard.displayName = "ACard";

const ACardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6 border-b border-gray-100",
      "transition-all duration-300 group-hover:border-indigo-200",
      className
    )}
    {...props}
  />
));
ACardHeader.displayName = "ACardHeader";

const ACardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-gray-900",
      "transition-all duration-300 group-hover:text-indigo-900",
      "transform group-hover:scale-105 group-hover:translate-x-1",
      className
    )}
    {...props}
  />
));
ACardTitle.displayName = "ACardTitle";

const ACardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-gray-500 transition-all duration-300 delay-75",
      "group-hover:text-gray-600 group-hover:translate-x-2",
      className
    )}
    {...props}
  />
));
ACardDescription.displayName = "ACardDescription";

const ACardContent = React.forwardRef(({ className, ...props }, ref) => (
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
ACardContent.displayName = "ACardContent";

const ACardFooter = React.forwardRef(({ className, ...props }, ref) => (
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
ACardFooter.displayName = "ACardFooter";

// Demo component to showcase the animated card
const AnimatedCardDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        {[1, 2, 3].map((i) => (
          <ACard key={i} className="w-80 h-64">
            <ACardHeader>
              <ACardTitle>Animated Card {i}</ACardTitle>
              <ACardDescription>
                Hover me to see the magic happen with advanced animations
              </ACardDescription>
            </ACardHeader>
            <ACardContent>
              <p className="text-sm text-gray-600">
                This card features 3D transforms, particle effects, animated borders, 
                ripple effects, and smooth micro-interactions.
              </p>
            </ACardContent>
            <ACardFooter>
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                Learn More
              </button>
            </ACardFooter>
          </ACard>
        ))}
      </div>
    </div>
  );
};

export {
  ACard,
  ACardHeader,
  ACardFooter,
  ACardTitle,
  ACardDescription,
  ACardContent,
};
