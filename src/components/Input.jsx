import React, { forwardRef } from 'react';

const Input = forwardRef(({ labelText, type = "text", name, error, options, horizontal = false, ...rest }, ref) => {
    const className = 'flex flex-col bg-theme-secondary px-3 py-1 gap-1 rounded-md shadow-sm border-theme-color transition-colors duration-200';

    return (
        <div className={horizontal ? 'flex items-center gap-2' : className}>
            <label htmlFor={name} className="text-xs font-medium text-theme-secondary">
                {labelText} {rest.required && <span className="text-error-color">*</span>}
            </label>
            {type === "select" ? (
                <select
                    id={name}
                    ref={ref}
                    className={`bg-theme-input text-theme-primary text-sm p-1 rounded border focus:outline-none focus:ring-1 focus:ring-theme-accent ${error ? 'border-error-color' : 'border-theme-color'}`}
                    name={name}
                    {...rest}
                >
                    <option value="">Select</option>
                    {options && options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={name}
                    type={type}
                    ref={ref}
                    className={`bg-theme-input text-theme-primary text-sm p-1 rounded border focus:outline-none focus:ring-1 focus:ring-theme-accent hover:border-theme-accent transition-colors ${error ? 'border-error-color' : 'border-theme-color'}`}
                    name={name}
                    {...rest}
                />
            )}
            {error && <span className="text-xs text-error-color mt-1">{error.message}</span>}
        </div>
    );
});

export default Input;
