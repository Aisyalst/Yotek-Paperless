import React, { useState, useEffect, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';
import NotificationModal from './NotificationModal';

function timeAgo(dateParam) {
    if (!dateParam) return null;
    const date = new Date(dateParam);
    const seconds = Math.round((new Date() - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return 'Baru saja';
    if (minutes < 60) return `${minutes}mnt lalu`;
    if (hours < 24) return `${hours}j lalu`;
    if (days < 7) return `${days}h lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function NotificationBell() {
    const { auth } = usePage().props;
    const unreadCount = auth?.unreadNotificationsCount || 0;
    const latestNotifications = auth?.latestNotifications || [];
    
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotificationClick = (notification) => {
        // Mark as read if unread
        if (!notification.is_read) {
            router.patch(route('notifications.read', notification.id), {}, {
                preserveScroll: true,
                preserveState: true,
            });
        }
        
        // Open modal
        setSelectedNotification(notification);
        setIsModalOpen(true);
        setIsOpen(false); // close dropdown
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors duration-200 focus:outline-none flex items-center justify-center group"
                title="Notifikasi"
            >
                <svg 
                    className={`w-6 h-6 transition-colors ${isOpen ? 'text-[#1a1a1a]' : 'text-zinc-600 group-hover:text-[#1a1a1a]'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold text-white bg-[#eaae36] border-2 border-white rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-zinc-200 py-2 z-50 transform origin-top-right transition-all">
                    <div className="px-4 py-2 border-b border-zinc-100 flex justify-between items-center">
                        <h3 className="font-bold text-[#1a1a1a]">Notifikasi Terkini</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={() => router.patch(route('notifications.read-all'), {}, { preserveScroll: true })}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Tandai semua
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-[300px] overflow-y-auto">
                        {latestNotifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-zinc-500 text-sm">
                                Belum ada notifikasi
                            </div>
                        ) : (
                            <ul className="divide-y divide-zinc-50">
                                {latestNotifications.map(notif => (
                                    <li key={notif.id}>
                                        <button 
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors flex items-start gap-3 ${notif.is_read ? 'opacity-70' : 'bg-blue-50/30'}`}
                                        >
                                            {!notif.is_read && (
                                                <div className="w-2 h-2 rounded-full bg-[#eaae36] mt-1.5 flex-shrink-0"></div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                                                    {notif.notification.title}
                                                </p>
                                                <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                                                    {notif.notification.body}
                                                </p>
                                                <p className="text-[10px] text-zinc-400 mt-1">
                                                    {timeAgo(notif.created_at)}
                                                </p>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            <NotificationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                notification={selectedNotification} 
            />
        </div>
    );
}
