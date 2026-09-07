import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    HiOutlineDocumentText, 
    HiOutlineUserGroup, 
    HiOutlineClipboardList, 
    HiOutlineClipboardCheck, 
    HiOutlineMail,
    HiOutlineBell,
    HiChevronLeft,
    HiChevronRight
} from 'react-icons/hi';

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

export default function Index({ stats }) {
    const { auth } = usePage().props;
    const latestNotifications = auth?.latestNotifications || [];

    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const dummyImages = [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500&q=80"
    ];

    useEffect(() => {
        let interval;
        if (!isHovered) {
            interval = setInterval(() => {
                slideNext();
            }, 5000); // ini adalah interval waktu untuk mengganti gambar 
        }
        return () => clearInterval(interval);
    }, [isHovered]);

    const slideNext = () => {
        if (sliderRef.current && sliderRef.current.children.length > 0) {
            const slider = sliderRef.current;
            const itemWidth = slider.children[0].offsetWidth + 16; // width + gap
            const totalScroll = slider.scrollWidth - slider.clientWidth;
            
            if (slider.scrollLeft >= totalScroll - 10) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }
        }
    };

    const slidePrev = () => {
        if (sliderRef.current && sliderRef.current.children.length > 0) {
            const slider = sliderRef.current;
            const itemWidth = slider.children[0].offsetWidth + 16;
            
            if (slider.scrollLeft <= 10) {
                slider.scrollTo({ left: slider.scrollWidth, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: -itemWidth, behavior: 'smooth' });
            }
        }
    };

    const handleScroll = () => {
        if (sliderRef.current && sliderRef.current.children.length > 0) {
            const itemWidth = sliderRef.current.children[0].offsetWidth + 16;
            const index = Math.round(sliderRef.current.scrollLeft / itemWidth);
            setActiveIndex(index);
        }
    };

    return (
        <DashboardLayout judulHalaman="Beranda">
            <Head title="Beranda" />

            <div className="flex flex-col gap-6">
                
                {/* 1. Banner Section */}
                <div className="relative w-full h-[300px] md:h-[350px] rounded-3xl overflow-hidden shadow-sm">
                    {/* Background Image Placeholder (Sky/Clouds) */}
                    <img 
                        src="https://images.unsplash.com/photo-1509803874385-db7c23652552?auto=format&fit=crop&w=1920&q=80" 
                        alt="Banner Background" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    
                    {/* YOTEK 3D Text Placeholder (Using text for now, could be an image) */}
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden md:block opacity-80">
                        <h1 className="text-8xl font-black text-white drop-shadow-lg tracking-widest" style={{ WebkitTextStroke: '2px #f0f0f0', color: 'transparent' }}>YOTEK</h1>
                    </div>

                    {/* Info Card Overlay */}
                    <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-md shadow-lg border border-white/50">
                        <div className="relative mb-4">
                            <h2 className="text-3xl font-black text-[#1a1a1a] relative z-10">Info Penting!</h2>
                            {/* Decorative brackets like in the image */}
                            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-[#eaae36]"></div>
                            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-[#eaae36]"></div>
                        </div>
                        
                        <p className="text-[#1a1a1a] font-medium text-sm md:text-base leading-relaxed mb-4">
                            Teman-teman yotek, yuk mulai biasakan hemat air dan listrik! Matikan lampu, AC, dan perangkat elektronik saat tidak digunakan.
                        </p>
                        <p className="text-[#1a1a1a] font-medium text-sm md:text-base leading-relaxed">
                            Gunakan air seperlunya, jangan biarkan kran menyala terus. Ingat, sekecil apapun penghematan yang kita lakukan, akan berdampak besar untuk lingkungan dan tagihan bulanan kantor.
                        </p>
                    </div>

                    {/* Carousel Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <div className="w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                </div>

                {/* 2. Subsidiaries Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center justify-between overflow-x-auto gap-8">
                    {/* Dummy Logos */}
                    <div className="flex-shrink-0 flex items-center gap-2 font-bold text-green-700">
                        <div className="w-8 h-8 bg-green-600 mask mask-hexagon"></div>
                        PT. HUNIAN HIJAU INDONESIA
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 font-bold text-[#8dc63f]">
                        <div className="w-10 h-10 rounded-full bg-[#8dc63f] flex items-center justify-center text-white">UP</div>
                        PT. Indo Riau Perkasa
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 font-bold text-cyan-500">
                        <span className="text-3xl text-cyan-500">mw</span>
                        <span className="text-sm text-gray-800">mediaworld</span>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 font-bold text-teal-600">
                        <div className="w-8 h-8 rounded-full bg-teal-600"></div>
                        SDA
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 font-bold text-blue-500">
                        <div className="w-10 h-10 rounded bg-blue-500"></div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 font-bold text-red-600">
                        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center border-2 border-gray-200 shadow-sm">SH</div>
                    </div>
                </div>

                {/* 3. Bottom Grid: Activities & Shortcuts & Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Latest Activities (Company Album) */}
                    <div className="lg:col-span-6 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                        <h3 className="text-xl font-bold text-center text-[#1a1a1a] mb-4">Latest Activities</h3>
                        
                        <div 
                            className="relative group"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <div 
                                ref={sliderRef}
                                onScroll={handleScroll}
                                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                            >
                                {dummyImages.map((src, idx) => (
                                    <div key={idx} className="w-[calc(25%-12px)] min-w-[100px] aspect-[4/5] rounded-2xl overflow-hidden snap-start flex-shrink-0">
                                        <img src={src} alt={`Activity ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                onClick={slidePrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 rounded-full p-2 text-gray-800 hover:bg-gray-50 hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <HiChevronLeft className="w-6 h-6 text-[#eaae36]" />
                            </button>

                            <button 
                                onClick={slideNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 rounded-full p-2 text-gray-800 hover:bg-gray-50 hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <HiChevronRight className="w-6 h-6 text-[#eaae36]" />
                            </button>
                        </div>
                        
                        {/* Dots */}
                        <div className="flex justify-center gap-2 mt-2 flex-wrap">
                            {dummyImages.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${activeIndex === idx ? 'bg-[#1a1a1a]' : 'bg-gray-300'}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Shortcuts List Buttons */}
                    <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-center text-[#1a1a1a] mb-6">Akses Cepat</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-6 w-full justify-items-center">
                            
                            <Link href="#" className="flex flex-col items-center gap-3 group">
                                <div className="w-14 h-14 rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <HiOutlineDocumentText className="w-7 h-7 text-[#eaae36]" />
                                </div>
                                <span className="text-sm font-semibold text-[#1a1a1a] underline-offset-4 decoration-2 group-hover:underline text-center">Form Cuti</span>
                            </Link>

                            <Link href="#" className="flex flex-col items-center gap-3 group">
                                <div className="w-14 h-14 rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <HiOutlineUserGroup className="w-7 h-7 text-[#eaae36]" />
                                </div>
                                <span className="text-sm font-semibold text-[#1a1a1a] underline-offset-4 decoration-2 group-hover:underline text-center">Booking Meeting Room</span>
                            </Link>
                            
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                                <HiOutlineBell className="text-[#eaae36] w-6 h-6" />
                                Notifikasi Terbaru
                            </h2>
                        </div>
                        
                        <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] pr-2">
                            {latestNotifications.length === 0 ? (
                                <div className="py-8 text-center text-zinc-500 text-sm">
                                    Belum ada notifikasi
                                </div>
                            ) : (
                                latestNotifications.map(notif => {
                                    const type = notif.notification.type?.toLowerCase() || 'info';
                                    let iconBg = 'bg-blue-50';
                                    let iconText = 'text-blue-600';
                                    let iconChar = 'i';

                                    if (type === 'success') {
                                        iconBg = 'bg-green-50'; iconText = 'text-green-600'; iconChar = '✓';
                                    } else if (type === 'warning') {
                                        iconBg = 'bg-yellow-50'; iconText = 'text-yellow-600'; iconChar = '!';
                                    } else if (type === 'error') {
                                        iconBg = 'bg-red-50'; iconText = 'text-red-600'; iconChar = '✕';
                                    }

                                    return (
                                        <div key={notif.id} className={`flex gap-3 items-start p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-gray-100 ${!notif.is_read ? 'bg-blue-50/20' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full ${iconBg} ${iconText} flex items-center justify-center shrink-0 font-bold text-sm`}>
                                                {iconChar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className="text-sm font-bold text-[#1a1a1a] truncate">{notif.notification.title}</h4>
                                                    {!notif.is_read && <div className="w-2 h-2 rounded-full bg-[#eaae36] flex-shrink-0"></div>}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.notification.body}</p>
                                                <span className="text-[10px] text-gray-400 mt-2 block">{timeAgo(notif.created_at)}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <Link href={route('notifications.index')} className="w-full mt-4 py-2 text-sm text-[#eaae36] font-bold border border-[#eaae36] rounded-xl hover:bg-[#eaae36] hover:text-white transition-colors text-center block">
                            Lihat Semua
                        </Link>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
