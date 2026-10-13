import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { HiChevronDown, HiOutlineSearch } from 'react-icons/hi';

/**
 * Searchable single-select.
 *
 * Drop-in pengganti <select>:
 *  - Bisa memakai anak <option> (children) ATAU prop `options`.
 *  - onChange dipanggil dengan event sintetis `{ target: { name, value } }`
 *    sehingga handler lama seperti `(e) => setData('x', e.target.value)` tetap jalan.
 *
 * `options` menerima salah satu bentuk:
 *  - [{ value, label }]
 *  - [{ id, name }]   (kompatibel dengan SelectInput lama)
 *  - ['A', 'B', 'C']
 */

const toText = (node) => {
    if (node === null || node === undefined || typeof node === 'boolean') return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(toText).join('');
    if (React.isValidElement(node)) return toText(node.props.children);
    return '';
};

const ChevronIcon = HiChevronDown || (() => null);
const SearchIcon = HiOutlineSearch || (() => null);

export default forwardRef(function SearchableSelect(
    {
        value = '',
        onChange,
        options,
        children,
        placeholder,
        name,
        id,
        className = '',
        disabled = false,
        searchPlaceholder = 'Cari...',
        emptyText = 'Tidak ada hasil',
        required: _required,
    },
    ref,
) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef(null);
    const buttonRef = useRef(null);
    const searchRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => buttonRef.current?.focus(),
    }));

    // Tutup dropdown saat klik di luar.
    useEffect(() => {
        const onDocClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    // Fokuskan kotak pencarian saat dropdown dibuka.
    useEffect(() => {
        if (open && searchRef.current) {
            searchRef.current.focus();
        }
    }, [open]);

    const disabledPlaceholder = useMemo(() => {
        let text = '';
        React.Children.toArray(children).forEach((child) => {
            if (
                !text &&
                React.isValidElement(child) &&
                child.type === 'option' &&
                child.props.disabled
            ) {
                text = toText(child.props.children);
            }
        });
        return text;
    }, [children]);

    const normalizedOptions = useMemo(() => {
        const fromChildren = [];
        if (children !== undefined && children !== null) {
            React.Children.toArray(children).forEach((child) => {
                if (React.isValidElement(child) && child.type === 'option') {
                    // Opsi ber-`disabled` (mis. "-- Pilih --") tidak bisa dipilih;
                    // dipakai sebagai placeholder, bukan item daftar.
                    if (child.props.disabled) return;
                    fromChildren.push({
                        value: String(child.props.value ?? toText(child.props.children)),
                        label: child.props.children,
                        text: toText(child.props.children),
                    });
                }
            });
        }
        if (fromChildren.length) return fromChildren;

        return (options || []).map((o) => {
            if (typeof o === 'string' || typeof o === 'number') {
                return { value: String(o), label: String(o), text: String(o) };
            }
            if (o && 'value' in o) {
                return { value: String(o.value), label: o.label, text: toText(o.label) };
            }
            return { value: String(o?.id), label: o?.name, text: toText(o?.name) };
        });
    }, [children, options]);

    const filteredOptions = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return normalizedOptions;
        return normalizedOptions.filter((o) => o.text.toLowerCase().includes(q));
    }, [normalizedOptions, query]);

    const currentValue = String(value ?? '');
    const selected = normalizedOptions.find((o) => o.value === currentValue);

    const emit = (val) => {
        if (typeof onChange === 'function') {
            const target = { name, value: val };
            onChange({ target, currentTarget: target, preventDefault() {}, stopPropagation() {} });
        }
    };

    const handleSelect = (opt) => {
        emit(opt.value);
        setOpen(false);
        setQuery('');
    };

    // Pisahkan kelas lebar/layout (mis. `w-full`, `sm:w-auto`) ke wrapper,
    // sisanya (border, rounded, dsb.) ke tombol kontrol.
    const widthClasses = [];
    const controlClasses = [];
    className
        .split(/\s+/)
        .filter(Boolean)
        .forEach((c) => {
            if (/^(sm:|md:|lg:|xl:|2xl:)?(w-|min-w-|max-w-|flex-1|grow)/.test(c)) {
                widthClasses.push(c);
            } else {
                controlClasses.push(c);
            }
        });
    const wrapperClass = ['relative', ...widthClasses].join(' ');
    const buttonClass = controlClasses.join(' ');

    return (
        <div className={wrapperClass} ref={containerRef}>
            {name && <input type="hidden" name={name} value={currentValue} readOnly />}
            <button
                type="button"
                id={id}
                disabled={disabled}
                ref={buttonRef}
                onClick={() => !disabled && setOpen((o) => !o)}
                className={`w-full min-w-[5rem] flex items-center justify-between gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-[#eaae36] disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    open ? 'ring-2 ring-[#eaae36] border-[#eaae36]' : ''
                } ${buttonClass}`}
            >
                <span className={`truncate ${selected ? '' : 'text-gray-400'}`}>
                    {selected ? selected.label : (placeholder || disabledPlaceholder || '')}
                </span>
                <ChevronIcon className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <SearchIcon className="w-4 h-4 text-gray-400 shrink-0" />
                        <input
                            ref={searchRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') e.preventDefault();
                                if (e.key === 'Escape') {
                                    setOpen(false);
                                    setQuery('');
                                }
                            }}
                            placeholder={searchPlaceholder}
                            className="w-full text-sm bg-transparent border-0 p-0 focus:outline-none focus:ring-0 focus:border-transparent"
                        />
                    </div>

                    <ul className="max-h-60 overflow-y-auto py-1">
                        {filteredOptions.length === 0 && (
                            <li className="px-3 py-2 text-sm text-gray-400">{emptyText}</li>
                        )}
                        {filteredOptions.map((opt, idx) => {
                            const isSelected = opt.value === currentValue;
                            return (
                                <li key={`${opt.value}-${idx}`}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(opt)}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#eaae36]/10 ${
                                            isSelected
                                                ? 'bg-[#eaae36]/15 font-semibold text-[#8a6410]'
                                                : 'text-[#1a1a1a]'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
});

