const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const colors = { primary: 'border-primary', secondary: 'border-secondary', white: 'border-white' };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} ${colors[color]} border-2 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
