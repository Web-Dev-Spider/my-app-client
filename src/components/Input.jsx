import React from 'react'

const Input = ({ labelText, type = "text", name, value, onChange, options, horizontal = false }) => {
    const className = 'flex flex-col bg-theme-secondary px-3 py-1 gap-1 rounded-md shadow-sm border-theme-color transition-colors duration-200'

    return (
        <div className={horizontal ? 'flex items-center gap-2' : className}>
            <label htmlFor={name} className="text-xs font-medium text-theme-secondary">{labelText}</label>
            {type === "select" ? (
                <select
                    id={name}
                    className='bg-theme-input text-theme-primary text-sm p-1 rounded border border-theme-color focus:outline-none focus:ring-1 focus:ring-theme-accent'
                    onChange={onChange}
                    value={value}
                    name={name}
                >
                    <option value="">Select</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={name}
                    type={type}
                    className='bg-theme-input text-theme-primary text-sm p-1 rounded border border-theme-color focus:outline-none focus:ring-1 focus:ring-theme-accent hover:border-theme-accent transition-colors'
                    name={name}
                    onChange={onChange}
                    value={value}
                />
            )}

        </div>
    )
}

export default Input
