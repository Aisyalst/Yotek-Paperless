import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link } from '@inertiajs/react';

export default function Show({ meeting }) {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return timeStr.substring(0, 5);
    };

    return (
        <DashboardLayout judulHalaman="Detail Jadwal Meeting">
            <Head title={`Detail Meeting: ${meeting.title}`} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">Detail Meeting</h1>
                    <p className="text-sm text-gray-500 mt-1.5">Informasi lengkap jadwal dan partisipan meeting.</p>
                </div>
                <Link
                    href={route('meetings.index')}
                    className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Kembali
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informasi Utama */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#ffffff] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold text-[#1a1a1a] text-lg">{meeting.title}</h2>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md shadow-sm border ${
                                meeting.status === 'Terjadwal' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                meeting.status === 'Berjalan' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                meeting.status === 'Selesai' ? 'bg-[#eaae36]/10 text-[#eaae36] border-[#eaae36]/30' :
                                'bg-gray-100 text-gray-700 border-gray-200'
                            }`}>
                                {meeting.status}
                            </span>
                        </div>
                        <div className="p-6">
                            {meeting.description && (
                                <div className="mb-6">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Deskripsi</h3>
                                    <p className="text-sm text-[#1a1a1a] whitespace-pre-line">{meeting.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Penyelenggara</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[#eaae36] font-bold">
                                            {meeting.organizer?.name?.charAt(0) || '-'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#1a1a1a]">{meeting.organizer?.name || meeting.organizer_nik}</p>
                                            <p className="text-xs text-gray-500">Penyelenggara</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Waktu Pelaksanaan</h3>
                                    <p className="text-sm font-semibold text-[#1a1a1a] flex items-center gap-2">
                                        <svg className="w-4 h-4 text-[#eaae36]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {formatDate(meeting.date)}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lokasi & Partisipan */}
                <div className="space-y-6">
                    <div className="bg-[#ffffff] border border-gray-200 rounded-xl shadow-sm">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-bold text-[#1a1a1a]">Lokasi & Tipe</h3>
                        </div>
                        <div className="p-5">
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 mb-1">Tipe Meeting</p>
                                <span className="capitalize font-medium text-sm text-[#1a1a1a] bg-gray-100 px-3 py-1 rounded-md border border-gray-200/50">
                                    {meeting.type.replace('_', ' ')}
                                </span>
                            </div>
                            
                            {['on_room', 'hybrid'].includes(meeting.type) && (
                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 mb-1">Ruangan Rapat</p>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">{meeting.room?.name || '-'}</p>
                                </div>
                            )}

                            {['online', 'hybrid'].includes(meeting.type) && (
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Platform Online</p>
                                    <p className="text-sm font-semibold text-[#1a1a1a] mb-2">{meeting.online_platform}</p>
                                    
                                    <p className="text-xs text-gray-500 mb-1">Link Meeting</p>
                                    {meeting.online_link ? (
                                        <a href={meeting.online_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline break-all">
                                            {meeting.online_link}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-400">-</span>
                                    )}
                                    
                                    {meeting.passcode && (
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-500 mb-1">Passcode</p>
                                            <p className="text-sm font-semibold text-[#1a1a1a]">{meeting.passcode}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#ffffff] border border-gray-200 rounded-xl shadow-sm">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-[#1a1a1a]">Partisipan ({meeting.participants?.length || 0})</h3>
                        </div>
                        <div className="p-0">
                            {meeting.participants && meeting.participants.length > 0 ? (
                                <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                                    {meeting.participants.map((participant) => (
                                        <li key={participant.id} className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {participant.employee?.name?.charAt(0) || '-'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[#1a1a1a]">{participant.employee?.name || participant.employee_nik}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {participant.employee_nik} &bull; {participant.employee?.role?.name || '-'} &bull; {participant.employee?.employee_information?.department || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                {participant.status === 'pending' && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded">Menunggu</span>}
                                                {participant.status === 'accepted' && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 rounded">Hadir</span>}
                                                {participant.status === 'declined' && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 rounded">Tidak</span>}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-6 text-center">
                                    <p className="text-sm text-gray-500">Belum ada partisipan yang ditambahkan.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
