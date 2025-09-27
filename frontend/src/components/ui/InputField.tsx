import React from 'react';

interface InputFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'time' | 'number';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  step?: string;
  currency?: boolean; // For number type, adds Kz prefix and currency formatting
}

export default function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  disabled = false,
  required = false,
  error,
  step,
  currency = false
}: InputFieldProps) {
  const isCurrency = type === 'number' && currency;
  const inputStep = isCurrency ? '0.01' : (type === 'number' ? step : undefined);
  const inputPlaceholder = isCurrency ? '0.00' : placeholder;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        {isCurrency && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
            Kz
          </span>
        )}
        <input
          className={`input-field ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''} ${isCurrency ? 'pl-12' : ''}`}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={inputPlaceholder}
          disabled={disabled}
          required={required}
          step={inputStep}
          min={isCurrency ? '0' : undefined}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error-message' : undefined}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <p id="error-message" className="text-red-400 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
