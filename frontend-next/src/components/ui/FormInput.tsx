import { LucideIcon } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  isTextArea?: boolean;
}

const FormInput = ({
  label,
  icon: Icon,
  error,
  isTextArea = false,
  className = '',
  ...props
}: FormInputProps) => {
  const inputClasses = `
    w-full px-4 py-3 rounded-xl border-2 bg-secondary-50/50 
    transition-all duration-200 outline-none
    ${error
      ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
      : 'border-secondary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
    }
  `;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-bold text-secondary-700 ml-1">
        {Icon && <Icon className="w-4 h-4 text-primary-500" />}
        {label}
      </label>
      
      {isTextArea ? (
        <textarea
          className={`${inputClasses} min-h-[120px] resize-none`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={inputClasses}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      
      {error && (
        <p className="text-red-500 text-xs font-medium ml-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
