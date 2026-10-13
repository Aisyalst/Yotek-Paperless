import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HiX, HiChevronDown, HiOutlineSearch } from 'react-icons/hi';

/**
 * Searchable multi-select dengan chip/tag.
 * Cukup klik untuk memilih / membuang role (tanpa tahan Ctrl).
 * Role pertama otomatis ditandai "Primary".
 */
export default function MultiSelect({
    value = [],
    onChange,
    options = [],
    placeholder = 'Select...',
    searchPlaceholder = 'Cari...',
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef(null);
    const searchRef = useRef(null);

    // Normalisasi: bandingkan sebagai string agar aman dari perbedaan tipe.
    const selectedIds = useMemo(() => (value || []).map((v) => String(v)), [value]);

    // Tutup dropdown saat klik di luar komponen.
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fokuskan kotak pencarian saat dropdown dibuka.
    useEffect(() => {
        if (open && searchRef.current) {
            searchRef.current.focus();
        }
    }, [open]);

    const filteredOptions = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter((o) => String(o.label).toLowerCase().includes(q));
    }, [options, query]);

    const selectedOptions = useMemo(
        () => selectedIds.map((id) => options.find((o) => String(o.value) === id)).filter(Boolean),
        [selectedIds, options]
    );

    const toggle = (id) => {
        const sid = String(id);
        if (selectedIds.includes(sid)) {
            onChange(selectedIds.filter((v) => v !== sid));
        } else {
            onChange([...selectedIds, sid]);
        }
    };

    const remove = (id) => {
        const sid = String(id);
        onChange(selectedIds.filter((v) => v !== sid));
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Kotak utama: chip terpilih + tombol buka dropdown */}
            <div
                onClick={() => setOpen((o) => !o)}
                className="min-h-[46px] w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-3 py-2 flex flex-wrap items-center gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-[#eaae36]"
            >
                {selectedOptions.length === 0 && (
                    <span className="text-gray-400 text-sm py-1">{placeholder}</span>
                )}

                {selectedOptions.map((opt, idx) => (
                    <span
                        key={opt.value}
                        className="inline-flex items-center gap-1 bg-[#eaae36]/15 text-[#8a6410] border border-[#eaae36]/40 rounded-full pl-2.5 pr-1 py-1 text-xs font-semibold"
                    >
                        {idx === 0 && (
                            <span className="bg-[#eaae36] text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                                Primary
                            </span>
                        )}
                        {opt.label}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                remove(opt.value);
                            }}
                            className="ml-0.5 rounded-full hover:bg-[#eaae36]/30 p-0.5"
                            aria-label={`Buang ${opt.label}`}
                        >
                            <HiX className="w-3.5 h-3.5" />
                        </button>
                    </span>
                ))}

                <HiChevronDown
                    className={`w-4 h-4 ml-auto text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                    {/* Kotak pencarian */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <HiOutlineSearch className="w-4 h-4 text-gray-400" />
                        <input
                            ref={searchRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full text-sm focus:outline-none focus:ring-0 focus:border-transparent border-0 p-0 bg-transparent"
                        />
                        {selectedIds.length > 0 && (
                            <button
                                type="button"
                                onClick={() => onChange([])}
                                className="text-xs text-red-500 hover:underline whitespace-nowrap"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* Daftar opsi */}
                    <ul className="max-h-60 overflow-y-auto py-1">
                        {filteredOptions.length === 0 && (
                            <li className="px-3 py-2 text-sm text-gray-400">Tidak ada role yang cocok.</li>
                        )}
                        {filteredOptions.map((opt) => {
                            const checked = selectedIds.includes(String(opt.value));
                            return (
                                <li key={opt.value}>
                                    <button
                                        type="button"
                                        onClick={() => toggle(opt.value)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[#eaae36]/10 ${
                                            checked ? 'bg-[#eaae36]/5 font-semibold' : ''
                                        }`}
                                    >
                                        <span
                                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                                checked ? 'bg-[#eaae36] border-[#eaae36] text-white' : 'border-gray-300'
                                            }`}
                                        >
                                            {checked && (
                                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.79 6.8-6.79a1 1 0 011.4 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </span>
                                        <span className="text-[#1a1a1a]">{opt.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
