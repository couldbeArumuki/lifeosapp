const colors = {
  blue: 'bg-primary/10 text-primary',
  purple: 'bg-secondary/10 text-secondary',
  green: 'bg-accent/10 text-accent',
  pink: 'bg-tertiary/10 text-tertiary',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  gray: 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300',
};

const Badge = ({ children, color = 'blue', className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
