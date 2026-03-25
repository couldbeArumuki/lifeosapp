const Input = ({ label, type = 'text', placeholder, value, onChange, icon, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl px-4 py-2.5 text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-text-dark dark:text-text-light placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
