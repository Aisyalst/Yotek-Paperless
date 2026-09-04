import React from 'react';

export default function NotificationModal({ isOpen, onClose, notification }) {
    if (!isOpen || !notification) return null;

    // Determine icon based on type
    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            case 'warning':
                return <svg className="w-8 h-8 text-[#eaae36]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
            case 'error':
                return <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            case 'info':
            default:
                return <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all flex flex-col max-h-[90vh]">
                <div className="p-6 overflow-y-auto">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            {getIcon(notification.notification.type)}
                        </div>
                        <div className="flex-1 w-0">
                            <h3 className="text-lg font-bold text-zinc-900 leading-tight">
                                {notification.notification.title}
                            </h3>
                            <div className="mt-1 text-sm text-zinc-500">
                                {new Date(notification.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                            </div>
                            <div className="mt-4 text-base text-zinc-700 whitespace-pre-wrap">
                                {notification.notification.body}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-50 px-6 py-4 flex justify-end rounded-b-xl border-t border-zinc-200 flex-shrink-0">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        onClick={onClose}
                    >
                        Tutup
                    </button>
                    {notification.notification.url && (
                        <a
                            href={notification.notification.url}
                            className="inline-flex justify-center rounded-lg border border-transparent bg-[#eaae36] px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ml-2"
                            onClick={onClose}
                        >
                            Buka Tautan
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
