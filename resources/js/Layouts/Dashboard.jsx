import { useState } from 'react';
import SidebarDashboard from '@/Layouts/SidebarDashboard';
import HeaderDashboard from '@/Layouts/HeaderDashboard'; // Pastikan path import HeaderDashboard Anda benar
import Alert from '@/Components/Alert';

export default function DashboardLayout({ children, judulHalaman }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        // flex & h-screen memastikan tampilan mengambil seluruh layar tanpa scroll pada body utama
        <div className="flex h-screen bg-[#1e1e1e] bg-dot-pattern text-gray-200 overflow-hidden">
            <Alert />
            
            {/* Kiri: SidebarDashboard mengambil tinggi penuh */}
            <SidebarDashboard isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Overlay Backdrop untuk Mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Kanan: Wrapper untuk HeaderDashboard dan Konten Utama */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                
                {/* Atas: HeaderDashboard yang menempel di kanan SidebarDashboard */}
                <HeaderDashboard 
                    judul={judulHalaman} 
                    onMenuButtonClick={() => setSidebarOpen(true)}
                    className="h-16 bg-white border-b border-zinc-200 flex items-center px-6 flex-shrink-0"
                />

                {/* Bawah: Konten Utama yang bisa di-scroll (overflow-y-auto) */}
                <main className="flex-1 overflow-y-auto dark-scrollbar py-6 px-4 sm:py-10 sm:px-10">
                    {children}
                </main>
            </div>
        </div>
    );
}