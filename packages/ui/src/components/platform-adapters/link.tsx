import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

// Platform-agnostic Link component
export const Link: React.FC<LinkProps> = ({ href, children, className, onClick, ...props }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
    // In a Tauri app, you might handle navigation differently
    console.log('Link clicked:', href);
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default Link;
