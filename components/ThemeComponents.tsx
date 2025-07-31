'use client';

import { useTheme } from '@/app/providers/ThemeProvider';

// 글래스모피즘 컴포넌트
export const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const { theme } = useTheme();
  
  if (theme !== 'glassmorphism') {
    return <div className={`neu-card ${className}`}>{children}</div>;
  }
  
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
};

export const GlassButton = ({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { theme } = useTheme();
  
  if (theme !== 'glassmorphism') {
    return <button className={`neu-button ${className}`} {...props}>{children}</button>;
  }
  
  return (
    <button className={`glass-button ${className}`} {...props}>
      {children}
    </button>
  );
};

// 텍스트 컴포넌트
export const ThemedText = ({ 
  children, 
  variant = 'primary',
  className = '' 
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary';
  className?: string;
}) => {
  const { theme } = useTheme();
  
  const textClass = theme === 'glassmorphism' 
    ? variant === 'primary' ? 'glass-text-primary' : 'glass-text-secondary'
    : variant === 'primary' ? 'neu-text-primary' : 'neu-text-secondary';
  
  return <span className={`${textClass} ${className}`}>{children}</span>;
};