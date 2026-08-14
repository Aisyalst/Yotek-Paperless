import React from 'react';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';

export default function DynamicForm({
    title,
    description,
    fields,
    data,
    setData,
    errors,
    onSubmit,
    processing,
    submitText = 'Submit',
    cancelHref,
}) {
    return (
        <div className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-lg shadow-sm p-6">
            <form onSubmit={onSubmit} className="space-y-6">
                {(title || description) && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            {title && <h1 className="text-xl font-bold text-[#1a1a1a]">{title}</h1>}
                            {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
                        </div>
                    </div>
                )}
                
                {fields.map((field) => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                            {field.label} {field.required && <span className="text-xs text-red-600">*</span>}
                        </label>
                        
                        {field.type === 'select' ? (
                            <select
                                value={data[field.name]}
                                onChange={(e) => setData(field.name, e.target.value)}
                                className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                required={field.required}
                            >
                                <option value="">{field.placeholder || `Select ${field.label}`}</option>
                                {field.options && field.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : field.type === 'textarea' ? (
                            <textarea
                                value={data[field.name]}
                                onChange={(e) => setData(field.name, e.target.value)}
                                className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                placeholder={field.placeholder}
                                required={field.required}
                                rows={field.rows || 4}
                            />
                        ) : (
                            <input
                                type={field.type || 'text'}
                                value={data[field.name]}
                                onChange={(e) => setData(field.name, e.target.value)}
                                className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                placeholder={field.placeholder}
                                required={field.required}
                            />
                        )}
                        
                        {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
                    </div>
                ))}

                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    {cancelHref && (
                        <RedirectOutlineButton text="Cancel" href={cancelHref} className="me-auto" />
                    )}
                    <SubmitOutlineButton text={submitText} disabled={processing} />
                </div>
            </form>
    </div>
    );
}

