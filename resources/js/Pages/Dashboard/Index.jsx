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
import * as HiIcons from 'react-icons/hi';

const DynamicIcon = ({ iconName, className }) => {
  const IconComponent = HiIcons[iconName];
  if (!IconComponent) return <HiIcons.HiFolder className={className} />; 
  return <IconComponent className={className} />;
};

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

export default function Index({ stats, companies, banners = [], albums = [], quickAccesses = [] }) {
    const { auth } = usePage().props;
    const latestNotifications = auth?.latestNotifications || [];

    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const subsidiarySliderRef = useRef(null);
    const [subsidiaryIsHovered, setSubsidiaryIsHovered] = useState(false);

    const bannerSliderRef = useRef(null);
    const [bannerActiveIndex, setBannerActiveIndex] = useState(0);
    const [bannerIsHovered, setBannerIsHovered] = useState(false);

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

    useEffect(() => {
        let interval;
        if (!bannerIsHovered && banners && banners.length > 0) {
            interval = setInterval(() => {
                slideNextBanner();
            }, 5000); 
        }
        return () => clearInterval(interval);
    }, [bannerIsHovered, banners]);

    const slideNextBanner = () => {
        if (bannerSliderRef.current && bannerSliderRef.current.children.length > 0) {
            const slider = bannerSliderRef.current;
            const itemWidth = slider.clientWidth;
            const totalScroll = slider.scrollWidth - slider.clientWidth;
            
            if (slider.scrollLeft >= totalScroll - 10) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }
        }
    };

    const slidePrevBanner = () => {
        if (bannerSliderRef.current && bannerSliderRef.current.children.length > 0) {
            const slider = bannerSliderRef.current;
            const itemWidth = slider.clientWidth;
            
            if (slider.scrollLeft <= 10) {
                slider.scrollTo({ left: slider.scrollWidth, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: -itemWidth, behavior: 'smooth' });
            }
        }
    };

    const handleBannerScroll = () => {
        if (bannerSliderRef.current && bannerSliderRef.current.children.length > 0) {
            const itemWidth = bannerSliderRef.current.clientWidth;
            const index = Math.round(bannerSliderRef.current.scrollLeft / itemWidth);
            setBannerActiveIndex(index);
        }
    };

    useEffect(() => {
        let interval;
        if (!subsidiaryIsHovered && companies && companies.length > 0) {
            interval = setInterval(() => {
                slideNextSubsidiary();
            }, 3000); 
        }
        return () => clearInterval(interval);
    }, [subsidiaryIsHovered, companies]);

    const slideNextSubsidiary = () => {
        if (subsidiarySliderRef.current && subsidiarySliderRef.current.children.length > 0) {
            const slider = subsidiarySliderRef.current;
            const itemWidth = slider.children[0].offsetWidth; 
            const totalScroll = slider.scrollWidth - slider.clientWidth;
            
            if (slider.scrollLeft >= totalScroll - 10) {
                slider.scrollTo({ left: 0, behavior: 'auto' });
            } else {
                slider.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }
        }
    };

    const slidePrevSubsidiary = () => {
        if (subsidiarySliderRef.current && subsidiarySliderRef.current.children.length > 0) {
            const slider = subsidiarySliderRef.current;
            const itemWidth = slider.children[0].offsetWidth;
            
            if (slider.scrollLeft <= 10) {
                slider.scrollTo({ left: slider.scrollWidth, behavior: 'auto' });
            } else {
                slider.scrollBy({ left: -itemWidth, behavior: 'smooth' });
            }
        }
    };

    const displayCompanies = companies && companies.length > 0 
        ? [...companies, ...companies, ...companies, ...companies, ...companies, ...companies] 
        : [];

    return (
        <DashboardLayout judulHalaman="Beranda">
            <Head title="Beranda" />

            <div className="flex flex-col gap-6">
                
                {/* 1. Undangan Meeting & Banner Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Undangan Meeting (Left, 4 columns) */}
                    <div className="lg:col-span-4 order-2 lg:order-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-[300px] md:h-[350px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-[#1a1a1a]">Undangan Meeting</h3>
                            <span className="text-xs font-semibold bg-[#eaae36] text-white px-2 py-1 rounded-full">Baru</span>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                            {/* Dummy Meeting Item */}
                            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-[#eaae36] transition-colors cursor-pointer group">
                                <p className="font-bold text-sm text-[#1a1a1a] group-hover:text-[#eaae36] transition-colors">Rapat Koordinasi IT</p>
                                <p className="text-xs text-gray-500 mt-1">Hari ini, 14:00 WIB</p>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">Zoom</span>
                                    <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-md">Internal</span>
                                </div>
                            </div>
                            
                            {/* Dummy Meeting Item 2 */}
                            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-[#eaae36] transition-colors cursor-pointer group">
                                <p className="font-bold text-sm text-[#1a1a1a] group-hover:text-[#eaae36] transition-colors">Evaluasi Kinerja Q3</p>
                                <p className="text-xs text-gray-500 mt-1">Besok, 09:00 WIB</p>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-md">Ruang Rapat Utama</span>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2.5 text-sm font-semibold text-[#1a1a1a] bg-gray-50 border border-gray-200 rounded-xl hover:bg-[#1a1a1a] hover:text-white transition-all">
                            Lihat Semua Undangan
                        </button>
                    </div>

                    {/* Banner Section (Right, 8 columns) */}
                    <div 
                        className="lg:col-span-8 order-1 lg:order-2 relative w-full h-[300px] md:h-[350px] rounded-3xl overflow-hidden shadow-sm group"
                        onMouseEnter={() => setBannerIsHovered(true)}
                        onMouseLeave={() => setBannerIsHovered(false)}
                    >
                        <div 
                            ref={bannerSliderRef}
                            onScroll={handleBannerScroll}
                            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
                        >
                            {banners.length > 0 ? (
                                banners.map((banner, idx) => (
                                    <div key={banner.id} className="w-full h-full flex-shrink-0 snap-start relative">
                                        <img 
                                            src={`/storage/${banner.banner}`} 
                                            alt={banner.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="w-full h-full flex-shrink-0 snap-start relative">
                                    <img 
                                        src="https://images.unsplash.com/photo-1509803874385-db7c23652552?auto=format&fit=crop&w=1920&q=80" 
                                        alt="Banner Background" 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden md:block opacity-80">
                                        <h1 className="text-8xl font-black text-white drop-shadow-lg tracking-widest" style={{ WebkitTextStroke: '2px #f0f0f0', color: 'transparent' }}>YOTEK</h1>
                                    </div>
                                    <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-md shadow-lg border border-white/50">
                                        <div className="relative mb-4">
                                            <h2 className="text-3xl font-black text-[#1a1a1a] relative z-10">Info Penting!</h2>
                                            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-[#eaae36]"></div>
                                            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-[#eaae36]"></div>
                                        </div>
                                        <p className="text-[#1a1a1a] font-medium text-sm md:text-base leading-relaxed mb-4">
                                            Teman-teman yotek, yuk mulai biasakan hemat air dan listrik! Matikan lampu, AC, dan perangkat elektronik saat tidak digunakan.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {banners.length > 1 && (
                            <>
                                <button 
                                    onClick={slidePrevBanner}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full text-[#1a1a1a] transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                >
                                    <HiChevronLeft className="w-6 h-6" />
                                </button>
                                <button 
                                    onClick={slideNextBanner}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full text-[#1a1a1a] transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                >
                                    <HiChevronRight className="w-6 h-6" />
                                </button>
                                
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {banners.map((_, idx) => (
                                        <div 
                                            key={idx} 
                                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${bannerActiveIndex === idx ? 'bg-[#eaae36] w-4' : 'bg-white/50'}`}
                                        ></div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* 2. Subsidiaries Section */}
                <div 
                    className="relative group bg-white rounded-3xl border border-gray-100 py-3 px-6 overflow-hidden"
                    onMouseEnter={() => setSubsidiaryIsHovered(true)}
                    onMouseLeave={() => setSubsidiaryIsHovered(false)}
                >
                    <div 
                        ref={subsidiarySliderRef}
                        className="flex items-center gap-0 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
                    >
                        {displayCompanies.map((company, idx) => (
                            <div key={`${company.id}-${idx}`} className="flex-shrink-0 flex items-center justify-center snap-center w-1/5 px-4">
                                {company.logo ? (
                                    <img src={`/storage/${company.logo}`} alt={company.name} className="max-h-12 w-full object-contain mix-blend-multiply" />
                                ) : (
                                    <span className="text-sm font-bold text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">{company.name}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={slidePrevSubsidiary}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-gray-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <HiChevronLeft className="w-8 h-8" />
                    </button>

                    <button 
                        onClick={slideNextSubsidiary}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-gray-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <HiChevronRight className="w-8 h-8" />
                    </button>
                </div>

                {/* 3. Bottom Grid: Activities & Shortcuts & Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* (Company Album) */}
                    <div className="lg:col-span-6 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                        <h3 className="text-xl font-bold text-center text-[#1a1a1a] mb-4">Album Kegiatan</h3>
                        
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
                                {albums.length > 0 ? albums.map((album, idx) => (
                                    <div key={album.id} className="w-[calc(25%-12px)] min-w-[100px] aspect-[4/5] rounded-2xl overflow-hidden snap-start flex-shrink-0 border border-gray-100 shadow-sm">
                                        <img src={`/storage/${album.image}`} alt={`Album ${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />
                                    </div>
                                )) : (
                                    <div className="w-full py-10 flex items-center justify-center text-gray-400 text-sm">
                                        Belum ada foto album.
                                    </div>
                                )}
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
                            {albums.map((_, idx) => (
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
                            
                            {quickAccesses.map(qa => (
                                <Link key={qa.id} href={route().has(qa.url) ? route(qa.url) : qa.url} className="flex flex-col items-center gap-3 group">
                                    <div className="w-14 h-14 rounded-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <DynamicIcon iconName={qa.logo} className="w-7 h-7 text-[#eaae36]" />
                                    </div>
                                    <span className="text-sm font-semibold text-[#1a1a1a] underline-offset-4 decoration-2 group-hover:underline text-center">
                                        {qa.title}
                                    </span>
                                </Link>
                            ))}

                            {quickAccesses.length === 0 && (
                                <p className="col-span-2 text-xs text-gray-400 text-center">Belum ada menu cepat.</p>
                            )}
                            
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
