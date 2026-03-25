const Card = ({ children, className = '', glass = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-6 transition-all duration-300 ${
        glass
          ? 'glass dark:glass-dark'
          : 'bg-white dark:bg-white/5 shadow-sm hover:shadow-md border border-gray-100 dark:border-white/10'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
