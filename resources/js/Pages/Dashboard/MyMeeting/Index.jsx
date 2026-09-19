import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ meetings = [] }) {
    const { auth } = usePage().props;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return timeStr.substring(0, 5);
    };

    const handleRespond = (meetingId, status) => {
        const confirmMsg = status === 'accepted' 
            ? 'Anda yakin ingin Menerima undangan meeting ini?' 
            : 'Anda yakin ingin Menolak undangan meeting ini?';
            
        if (confirm(confirmMsg)) {
            router.put(`/my-meetings/${meetingId}/respond`, { status });
        }
    };

    const filteredMeetings = meetings.filter(meeting => {
        const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase());
        const myParticipant = meeting.participants[0];
        const myStatus = myParticipant ? myParticipant.status : '';
        const matchesStatus = statusFilter === '' || myStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout judulHalaman="Undangan Meeting">
            <Head title="Undangan Meeting" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">Undangan Meeting</h1>
                    <p className="text-sm text-gray-500 mt-1.5">Kelola dan respons undangan meeting yang ditujukan kepada Anda.</p>
                </div>
            </div>

            <div className="bg-[#ffffff] border border-gray-200 rounded-xl shadow-sm flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/50 rounded-t-xl">
                    <div className="relative w-full sm:w-80">
                        <input 
                            type="text" 
                            placeholder="Cari judul meeting..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#eaae36]/50 focus:border-[#eaae36] transition-all"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-xs font-medium text-gray-500 hidden sm:block uppercase tracking-wider">Filter Respons:</span>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-auto bg-gray-50/50 border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#eaae36]/50 focus:border-[#eaae36] transition-all cursor-pointer"
                        >
                            <option value="">Semua</option>
                            <option value="pending">Menunggu Respons</option>
                            <option value="accepted">Hadir</option>
                            <option value="declined">Tidak Hadir</option>
                        </select>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-[#f8f8f8]/80 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                <th className="p-4 font-semibold rounded-tl-xl">Judul Meeting</th>
                                <th className="p-4 font-semibold">Tipe & Lokasi</th>
                                <th className="p-4 font-semibold">Waktu Pelaksanaan</th>
                                <th className="p-4 font-semibold">Status Meeting</th>
                                <th className="p-4 font-semibold rounded-tr-xl">Respons Saya</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMeetings.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-blue-50 text-[#eaae36] rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                            </div>
                                            <h3 className="text-base font-semibold text-[#1a1a1a] mb-1">Belum ada undangan meeting</h3>
                                            <p className="text-sm text-gray-500 max-w-xs mx-auto whitespace-normal">
                                                {searchQuery || statusFilter 
                                                    ? 'Pencarian Anda tidak menemukan hasil yang sesuai. Coba ubah kata kunci atau filter Anda.' 
                                                    : 'Anda belum menerima undangan meeting apa pun saat ini.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredMeetings.map((meeting) => {
                                    const myParticipant = meeting.participants[0];
                                    const myStatus = myParticipant ? myParticipant.status : 'pending';

                                    return (
                                        <tr key={meeting.id} className="border-b border-gray-100 hover:bg-[#f8f8f8]/60 transition-colors group">
                                            <td className="p-4">
                                                <p className="text-[#1a1a1a] font-semibold mb-0.5">{meeting.title}</p>
                                                <p className="text-xs text-gray-400">Penyelenggara: <span className="text-gray-500">{meeting.organizer?.name || meeting.organizer_nik}</span></p>
                                            </td>
                                            <td className="p-4">
                                                <span className="capitalize font-medium text-sm text-[#1a1a1a] bg-gray-100 px-2 py-1 rounded-md border border-gray-200/50">
                                                    {meeting.type.replace('_', ' ')}
                                                </span>
                                                <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                    {meeting.type === 'on_room' && (
                                                        <><svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> {meeting.room?.name}</>
                                                    )}
                                                    {meeting.type === 'online' && (
                                                        <><svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> <a href={meeting.online_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{meeting.online_platform}</a></>
                                                    )}
                                                    {meeting.type === 'hybrid' && (
                                                        <><svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg> {meeting.room?.name} / <a href={meeting.online_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{meeting.online_platform}</a></>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <div className="flex items-center gap-1.5 text-[#1a1a1a] font-medium">
                                                        <svg className="w-4 h-4 text-[#eaae36]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                        {formatDate(meeting.date)}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-500">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md shadow-sm border ${
                                                    meeting.status === 'Terjadwal' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    meeting.status === 'Berjalan' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    meeting.status === 'Selesai' ? 'bg-[#eaae36]/10 text-[#eaae36] border-[#eaae36]/30' :
                                                    'bg-gray-100 text-gray-700 border-gray-200'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        meeting.status === 'Terjadwal' ? 'bg-blue-600' :
                                                        meeting.status === 'Berjalan' ? 'bg-yellow-600' :
                                                        meeting.status === 'Selesai' ? 'bg-[#eaae36]' :
                                                        'bg-gray-500'
                                                    }`}></span>
                                                    {meeting.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {myStatus === 'pending' ? (
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => handleRespond(meeting.id, 'accepted')}
                                                            className="px-3 py-1.5 text-xs font-semibold bg-[#1a1a1a] hover:bg-black text-white rounded-md transition-colors shadow-sm border border-[#1a1a1a]"
                                                        >
                                                            Hadir
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRespond(meeting.id, 'declined')}
                                                            className="px-3 py-1.5 text-xs font-semibold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md transition-colors shadow-sm"
                                                        >
                                                            Tidak
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md border ${
                                                        myStatus === 'accepted' ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'bg-gray-100 text-gray-600 border-gray-200'
                                                    }`}>
                                                        {myStatus === 'accepted' ? (
                                                            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Hadir</>
                                                        ) : (
                                                            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Tidak Hadir</>
                                                        )}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
