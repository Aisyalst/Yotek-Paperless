import React from 'react';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function ThankYou() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] bg-dot-pattern p-4 relative overflow-hidden">
            {/* Glowing background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#eaae36]/30 rounded-full blur-[100px] pointer-events-none"></div>

            <Head title="Thank You!" />

            <div className="relative z-10 w-full max-w-lg bg-[#1e1e20]/90 backdrop-blur-xl rounded-3xl p-10 md:p-14 text-center border border-zinc-700/50 shadow-2xl">
                <div className="flex justify-center mb-8">
                    <div className="p-5 bg-zinc-800/50 rounded-2xl border border-zinc-600/30 shadow-inner flex items-center justify-center">
                        <ApplicationLogo 
                            className="w-[150px] h-[150px] object-contain drop-shadow-xl mx-auto" 
                            style={{ maxWidth: '150px', maxHeight: '150px' }}
                        />
                    </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-6 tracking-tight">
                    Success!
                </h1>
                
                <p className="text-gray-300 mb-10 text-lg leading-relaxed px-2">
                    Thank you for creating an account. We're absolutely thrilled to have you on board!
                </p>
                
                <div className="flex justify-center">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center justify-center w-full sm:w-auto bg-white text-zinc-900 rounded-full px-12 py-4 font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:-translate-y-1"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
