import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
};