import React, { useContext } from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

// Create a context for router (will be provided by native app)
export interface RouterContextType {
  navigate: (path: string) => void;
}

export const RouterContext = React.createContext<RouterContextType | undefined>(undefined);

// Platform-agnostic Link component
export const Link: React.FC<LinkProps> = ({ href, children, className, onClick, ...props }) => {
  const router = useContext(RouterContext);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onClick) {
      onClick(e);
    }
    
    // Use router context if available (native app)
    if (router) {
      router.navigate(href);
    } else {
      // Fallback for web (Next.js will handle this)
      window.location.href = href;
    }
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default Link;
