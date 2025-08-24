import React from "react";
import { cn } from "../utils/utils.js";

// Enhanced button variants with modern professional styling
const buttonVariants = ({ variant = "default", size = "default", className = "" }) => {
  const base = cn(
    // Core layout and typography
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "text-sm leading-none select-none cursor-pointer",
    
    // Modern border radius and transitions
    "rounded-lg transition-all duration-200 ease-out",
    
    // Focus and interaction states
    "outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
    
    // Icon handling
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
    
    // Accessibility
    "aria-invalid:ring-2 aria-invalid:ring-red-500/20",
    
    // Hover effects
    "hover:shadow-lg hover:scale-[1.02]",
    "transform-gpu" // Hardware acceleration
  );

  const variants = {
    // Primary - Modern gradient with enhanced shadows
    default: cn(
      "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md",
      "hover:from-blue-700 hover:to-blue-800 hover:shadow-xl",
      "focus-visible:ring-blue-500/30 focus-visible:ring-offset-white",
      "border border-blue-600/20",
      "active:from-blue-800 active:to-blue-900"
    ),
    
    // Destructive - Modern red gradient
    destructive: cn(
      "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-md",
      "hover:from-red-700 hover:to-red-800 hover:shadow-xl",
      "focus-visible:ring-red-500/30 focus-visible:ring-offset-white",
      "border border-red-600/20",
      "active:from-red-800 active:to-red-900"
    ),
    
    // Outline - Clean with subtle border
    outline: cn(
      "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 shadow-sm",
      "hover:bg-white hover:border-slate-300 hover:text-slate-900",
      "focus-visible:ring-slate-500/30 focus-visible:ring-offset-white",
      "active:bg-slate-50"
    ),
    
    // Secondary - Subtle background
    secondary: cn(
      "bg-slate-100 text-slate-700 shadow-sm border border-slate-200/50",
      "hover:bg-slate-200 hover:text-slate-900 hover:border-slate-300",
      "focus-visible:ring-slate-500/30 focus-visible:ring-offset-white",
      "active:bg-slate-300"
    ),
    
    // Ghost - Minimal with hover state
    ghost: cn(
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      "focus-visible:ring-slate-500/20 focus-visible:ring-offset-white",
      "active:bg-slate-200"
    ),
    
    // Link - Clean underline style
    link: cn(
      "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
      "focus-visible:ring-blue-500/30 focus-visible:ring-offset-white",
      "active:text-blue-800"
    ),
    
    // Success - Green gradient
    success: cn(
      "bg-gradient-to-br from-green-600 to-green-700 text-white shadow-md",
      "hover:from-green-700 hover:to-green-800 hover:shadow-xl",
      "focus-visible:ring-green-500/30 focus-visible:ring-offset-white",
      "border border-green-600/20",
      "active:from-green-800 active:to-green-900"
    ),
    
    // Warning - Amber gradient
    warning: cn(
      "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md",
      "hover:from-amber-600 hover:to-amber-700 hover:shadow-xl",
      "focus-visible:ring-amber-500/30 focus-visible:ring-offset-white",
      "border border-amber-500/20",
      "active:from-amber-700 active:to-amber-800"
    )
  };

  const sizes = {
    // Extra small - For compact interfaces
    xs: "h-7 px-3 text-xs gap-1.5 rounded-md",
    
    // Small - Common for secondary actions
    sm: "h-8 px-3 text-sm gap-1.5 rounded-md has-[>svg]:px-2.5",
    
    // Default - Standard size
    default: "h-9 px-4 py-2 gap-2 has-[>svg]:px-3",
    
    // Large - For primary CTAs
    lg: "h-11 px-6 text-base gap-2.5 font-semibold has-[>svg]:px-5",
    
    // Extra large - Hero buttons
    xl: "h-12 px-8 text-lg gap-3 font-semibold rounded-xl has-[>svg]:px-6",
    
    // Icon only - Square buttons
    icon: "size-9 p-0",
    "icon-sm": "size-8 p-0 rounded-md",
    "icon-lg": "size-11 p-0",
  };

  return cn(base, variants[variant], sizes[size], className);
};

// Loading spinner component
const LoadingSpinner = ({ className = "" }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const Button = React.forwardRef(({ 
  className = "", 
  variant = "default", 
  size = "default", 
  children, 
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      data-slot="button"
      className={buttonVariants({ variant, size, className })}
      disabled={isDisabled}
      {...props}
    >
      {/* Left icon or loading spinner */}
      {loading ? (
        <LoadingSpinner className="size-4" />
      ) : leftIcon ? (
        <span className="inline-flex shrink-0">{leftIcon}</span>
      ) : null}
      
      {/* Button content */}
      {children && (
        <span className={cn(loading && "opacity-70")}>
          {children}
        </span>
      )}
      
      {/* Right icon */}
      {rightIcon && !loading && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = "Button";

// Button group for related actions
const ButtonGroup = ({ className = "", children, ...props }) => (
  <div
    className={cn(
      "inline-flex items-center rounded-lg shadow-sm",
      "[&>button:not(:first-child)]:ml-[-1px] [&>button:not(:first-child)]:rounded-l-none",
      "[&>button:not(:last-child)]:rounded-r-none [&>button:focus]:z-10",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Icon button wrapper for common use cases
const IconButton = React.forwardRef(({ 
  icon, 
  'aria-label': ariaLabel,
  size = "icon",
  ...props 
}, ref) => (
  <Button
    ref={ref}
    size={size}
    aria-label={ariaLabel}
    {...props}
  >
    {icon}
  </Button>
));

IconButton.displayName = "IconButton";

export { Button, ButtonGroup, IconButton, buttonVariants };