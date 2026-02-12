import React from 'react'

const Input = ({ labelText, type = "text", name, value, onChange, options }) => {
    return (
        <div className='flex flex-col bg-slate-200 px-4 py-2 gap-2'>
            <label htmlFor={name}>{labelText}</label>
            {type === "select" ? (<select>
                <option id={name} onChange={onChange}>Select</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>) : (<input id={name} type={type} className='bg-blue-50' name={name} onChange={onChange} value={value} />
            )}

        </div>
    )
}

export default Input
