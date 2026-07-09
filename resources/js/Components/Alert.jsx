import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import * as HiIcons from 'react-icons/hi';

export default function Alert() {
    const { flash = {} } = usePage().props;
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash.success) {
            setMessage(flash.success);
            setType('success');
            setShow(true);
        } else if (flash.error) {
            setMessage(flash.error);
            setType('error');
            setShow(true);
        }
    }, [flash]);

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                setShow(false);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [show, message]);

    if (!message) return null;

    const Icon = type === 'success' ? HiIcons.HiCheckCircle : HiIcons.HiExclamationCircle;
    const CloseIcon = HiIcons.HiX;

    return (
        <div
            className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 max-w-md p-4 rounded-lg shadow-xl border transition-all duration-500 transform ${
                show ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'
            } ${
                type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
        >
            <Icon className="w-6 h-6 flex-shrink-0" />
            
            <div className="flex-1 text-sm font-medium pr-4">
                {message}
            </div>

            <button
                onClick={() => setShow(false)}
                className={`p-1 rounded-md transition-colors ${
                    type === 'success'
                        ? 'hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800'
                        : 'hover:bg-rose-100 text-rose-600 hover:text-rose-800'
                }`}
                aria-label="Close Alert"
            >
                <CloseIcon className="w-4 h-4" />
            </button>
        </div>
    );
}
