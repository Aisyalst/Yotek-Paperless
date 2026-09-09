import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function SelectInput(
    { className = '', isFocused = false, options = [], ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <select
            {...props}
            className={
                'rounded-md border-gray-300 bg-[#ffffff] text-[#1a1a1a] shadow-sm focus:border-[#eaae36] focus:ring-[#eaae36] ' +
                className
            }
            ref={localRef}
        >
            <option value="" disabled>-- Pilih --</option>
            {options.map((option, index) => (
                <option key={index} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    );
});
