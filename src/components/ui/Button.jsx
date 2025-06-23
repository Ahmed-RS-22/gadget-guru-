import React from 'react';
import clsx from 'clsx';

function Button({ children, className, variant = 'primary', size = 'md', ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantStyles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border border-gray-600 text-gray-200 hover:bg-gray-700"
  };
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };
  
  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;