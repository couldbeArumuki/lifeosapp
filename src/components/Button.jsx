const variants = {
  primary: 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25',
  secondary: 'bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/25',
  tertiary: 'bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/25',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-text-dark dark:text-text-light',
  outline: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick, type = 'button', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl font-medium transition-all duration-300 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
