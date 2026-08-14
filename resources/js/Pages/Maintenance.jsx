import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Maintenance() {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-[#f8f8f8] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <Head title="Dalam Perbaikan" />

            <div className="max-w-md w-full bg-[#ffffff] rounded-2xl shadow-xl border border-gray-100 p-8 text-center transform transition-all duration-300">
                <div className="flex justify-center mb-6">
                    <img 
                        src="https://yogura.com/wp-content/uploads/2026/08/yotek_logo_v3-01.png" 
                        alt="Yotek Logo" 
                        className="h-24 object-contain" 
                    />
                </div>
                
                <h1 className="text-3xl font-extrabold text-[#1a1a1a] mb-4">
                    System Under Maintenance
                </h1>
                
                <div className="w-16 h-1 bg-[#eaae36] mx-auto mb-6 rounded-full"></div>
                
                <p className="text-[#1a1a1a] text-opacity-80 mb-8 leading-relaxed font-medium">
                    Kami sedang melakukan build sistem untuk memberikan pengalaman terbaik bagi Anda.
                </p>
                
                <div className="inline-flex items-center justify-center space-x-3 text-sm text-[#1a1a1a] font-semibold bg-[#f8f8f8] py-3 px-6 rounded-full border border-gray-200 mb-6">
                    <svg className="w-5 h-5 animate-spin text-[#eaae36]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>System Under Build</span>
                </div>

                <div className="mt-4">
                    {auth.user ? (
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-bold rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors focus:outline-none"
                        >
                            Logout
                        </Link>
                    ) : (
                        <Link
                            href={route('login')}
                            className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-bold rounded-md text-[#1a1a1a] bg-[#eaae36] hover:bg-yellow-500 transition-colors focus:outline-none"
                        >
                            Kembali ke Login
                        </Link>
                    )}
                </div>
            </div>
            
            <div className="mt-12 text-sm font-medium text-gray-500">
                &copy; {new Date().getFullYear()} PT. Yogura Tekindo. Seluruh Hak Cipta Dilindungi.
            </div>
        </div>
    );
}
