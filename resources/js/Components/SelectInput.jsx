import { forwardRef, useImperativeHandle, useRef } from 'react';
import SearchableSelect from '@/Components/SearchableSelect';

export default forwardRef(function SelectInput(
    { className = '', isFocused = false, options = [], ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    return (
        <SearchableSelect
            {...props}
            ref={localRef}
            options={options}
            placeholder={props.placeholder ?? '-- Pilih --'}
            className={className}
        />
    );
});

