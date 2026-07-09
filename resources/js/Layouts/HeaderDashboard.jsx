import { useState } from 'react';
import { Link , usePage } from '@inertiajs/react'; // Gunakan Link dari Inertia agar perpindahan halaman cepat (SPA)

export default function Header({ judul, onMenuButtonClick }) {
    // State untuk mengontrol buka/tutup dropdown
    const [isLayananOpen, setIsLayananOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { auth } = usePage().props;

    return (
        <nav className="bg-[#252526] border-b border-zinc-700 text-gray-200 shadow-sm relative z-50 w-full">
            <div className="px-0 mx-0">
                <div className="flex justify-between h-16 items-center">
                    {/* BAGIAN KIRI: Logo dan Navigasi */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onMenuButtonClick}
                            className="lg:hidden p-2 rounded-md text-zinc-700 hover:text-zinc-700 hover:bg-zinc-100 focus:outline-none ms-4"
                            aria-label="Open Sidebar"
                        >
                            <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <span className="ms-3 lg:ms-5 text-xl font-bold text-gray-200">{judul}</span>
                    </div>

                    {/* BAGIAN KANAN: Profile Dropdown */}
                    <div className="ms-auto flex items-center mr-4 sm:mr-[50px]">
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 focus:outline-none"
                            >
                                <img 
                                    className="h-8 w-8 rounded-full object-cover border border-zinc-200" 
                                    src={auth.user.avatar || "https://i.pinimg.com/236x/6c/1a/49/6c1a495a071c97a638b21fc5bfabebf7.jpg"} 
                                    alt="Profile" 
                                />
                                <span className="text-sm font-medium text-gray-200 hidden md:block">{auth.user.name}</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>

                            {/* Isi Dropdown Profil */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-blue-900/60 backdrop-blur-md text-blue-200 border border-blue-500 rounded-md shadow-lg py-1 z-50">
                                    <div className="px-4 py-2 border-b border-blue-500/50">
                                        <p className="text-sm font-semibold text-blue-300">Halo, {auth.user.name}!</p>
                                    </div>
                                    <Link href="/profile" className="block px-4 py-2 text-sm text-blue-200 hover:bg-blue-500/20">Edit Profil</Link>
                                    
                                    {/* Contoh tombol Logout (menggunakan method POST Inertia) */}
                                    <Link href="/logout" method="post" as="button" className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-blue-500/20 border-t border-blue-500/50">
                                        Keluar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
}