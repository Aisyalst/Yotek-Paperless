import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ meeting, selectedEmployees = [], rooms = [], divisions = [], roles = [], employees = [] }) {
    const [searchDivision, setSearchDivision] = useState('');
    const [searchRole, setSearchRole] = useState('');
    const [searchEmployee, setSearchEmployee] = useState('');
    const toDatetimeLocal = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    };

    const { data, setData, put, processing, errors } = useForm({
        title: meeting.title,
        description: meeting.description || '',
        type: meeting.type,
        meeting_room_id: meeting.meeting_room_id || '',
        online_platform: meeting.online_platform || '',
        online_link: meeting.online_link || '',
        passcode: meeting.passcode || '',
        date: meeting.date,
        start_time: meeting.start_time,
        end_time: meeting.end_time,
        status: meeting.status,
        divisions: [], // Edit generally loads individual members, adding by division is purely an action
        roles: [],
        employees: selectedEmployees, // prefill with existing participants
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/meetings/${meeting.id}`);
    };

    const filteredDivisions = divisions.filter(div => div.name.toLowerCase().includes(searchDivision.toLowerCase()));
    const filteredRoles = roles.filter(role => role.name.toLowerCase().includes(searchRole.toLowerCase()));
    const filteredEmployees = employees.filter(emp => 
        emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) || 
        emp.nik.toString().toLowerCase().includes(searchEmployee.toLowerCase())
    );

    return (
        <DashboardLayout judulHalaman="Edit Jadwal Meeting">
            <Head title="Edit Jadwal Meeting" />
            
            <div className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-[#1a1a1a]">Edit Jadwal Meeting</h1>
                            <p className="text-sm text-gray-600 mt-1">Ubah data jadwal meeting.</p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                            Judul Meeting <span style={{ color: '#e53e3e' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                            placeholder="Contoh: Meeting Evaluasi Bulanan"
                            required
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                            Deskripsi
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                            placeholder="Opsional"
                            rows={3}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                                Tanggal <span style={{ color: '#e53e3e' }}>*</span>
                            </label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                required
                            />
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                                Waktu Mulai <span style={{ color: '#e53e3e' }}>*</span>
                            </label>
                            <input
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                required
                            />
                            {errors.start_time && <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                                Waktu Selesai <span style={{ color: '#e53e3e' }}>*</span>
                            </label>
                            <input
                                type="time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                                className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                required
                            />
                            {errors.end_time && <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                            Status Meeting <span style={{ color: '#e53e3e' }}>*</span>
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                            required
                        >
                            <option value="Terjadwal">Terjadwal</option>
                            <option value="Berjalan">Berjalan</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Dibatalkan">Dibatalkan</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                            Tipe Meeting <span style={{ color: '#e53e3e' }}>*</span>
                        </label>
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                            required
                        >
                            <option value="">Pilih Tipe Meeting</option>
                            <option value="online">Online</option>
                            <option value="on_room">On Room (Di Ruangan)</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                    </div>

                    {(data.type === 'on_room' || data.type === 'hybrid') && (
                        <div>
                            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                                Ruangan Rapat <span style={{ color: '#e53e3e' }}>*</span>
                            </label>
                            <select
                                value={data.meeting_room_id}
                                onChange={(e) => setData('meeting_room_id', e.target.value)}
                                className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                required
                            >
                                <option value="">Pilih Ruangan Rapat</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name} (Kapasitas: {room.capacity})
                                    </option>
                                ))}
                            </select>
                            {errors.meeting_room_id && <p className="text-red-500 text-sm mt-1">{errors.meeting_room_id}</p>}
                        </div>
                    )}

                    {(data.type === 'online' || data.type === 'hybrid') && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-gray-200 p-4 rounded-md bg-gray-50/50">
                            <div>
                                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                                    Platform Online <span style={{ color: '#e53e3e' }}>*</span>
                                </label>
                                <select
                                    value={data.online_platform}
                                    onChange={(e) => setData('online_platform', e.target.value)}
                                    className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                    required
                                >
                                    <option value="">Pilih Platform</option>
                                    <option value="Zoom">Zoom</option>
                                    <option value="Google Meet">Google Meet</option>
                                    <option value="Ms Teams">Ms Teams</option>
                                    <option value="other">Lainnya</option>
                                </select>
                                {errors.online_platform && <p className="text-red-500 text-sm mt-1">{errors.online_platform}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                                    Tautan (Link) <span style={{ color: '#e53e3e' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.online_link}
                                    onChange={(e) => setData('online_link', e.target.value)}
                                    className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                    placeholder="Contoh: https://zoom.us/j/..."
                                    required
                                />
                                {errors.online_link && <p className="text-red-500 text-sm mt-1">{errors.online_link}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                                    Passcode
                                </label>
                                <input
                                    type="text"
                                    value={data.passcode}
                                    onChange={(e) => setData('passcode', e.target.value)}
                                    className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                    placeholder="Opsional"
                                />
                                {errors.passcode && <p className="text-red-500 text-sm mt-1">{errors.passcode}</p>}
                            </div>
                        </div>
                    )}

                    <div className="pt-6 mt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-1">Partisipan Meeting</h3>
                        <p className="text-sm text-gray-500 mb-6">Pilih siapa saja yang akan diundang ke dalam meeting ini (data akan digabungkan otomatis).</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Divisi */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col">
                                <div className="flex flex-col mb-3 pb-3 border-b border-gray-200 gap-2">
                                    <h4 className="font-medium text-[#1a1a1a]">Berdasarkan Divisi</h4>
                                    <input 
                                        type="text" 
                                        placeholder="Cari divisi..." 
                                        value={searchDivision}
                                        onChange={(e) => setSearchDivision(e.target.value)}
                                        className="w-full text-sm bg-white border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#eaae36] focus:border-transparent"
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                                    {filteredDivisions.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic text-center py-2">Divisi tidak ditemukan.</p>
                                    ) : filteredDivisions.map((div) => (
                                        <label key={div.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                            <input
                                                type="checkbox"
                                                checked={data.divisions.includes(div.id.toString()) || data.divisions.includes(div.id)}
                                                onChange={(e) => {
                                                    const newDivs = e.target.checked 
                                                        ? [...data.divisions, div.id.toString()]
                                                        : data.divisions.filter(id => id.toString() !== div.id.toString());
                                                    setData('divisions', newDivs);
                                                }}
                                                className="rounded border-gray-300 text-[#eaae36] focus:ring-[#eaae36] cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-700 font-medium">{div.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Peran */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col">
                                <div className="flex flex-col mb-3 pb-3 border-b border-gray-200 gap-2">
                                    <h4 className="font-medium text-[#1a1a1a]">Berdasarkan Peran</h4>
                                    <input 
                                        type="text" 
                                        placeholder="Cari peran..." 
                                        value={searchRole}
                                        onChange={(e) => setSearchRole(e.target.value)}
                                        className="w-full text-sm bg-white border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#eaae36] focus:border-transparent"
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                                    {filteredRoles.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic text-center py-2">Peran tidak ditemukan.</p>
                                    ) : filteredRoles.map((role) => (
                                        <label key={role.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                            <input
                                                type="checkbox"
                                                checked={data.roles.includes(role.id.toString()) || data.roles.includes(role.id)}
                                                onChange={(e) => {
                                                    const newRoles = e.target.checked 
                                                        ? [...data.roles, role.id.toString()]
                                                        : data.roles.filter(id => id.toString() !== role.id.toString());
                                                    setData('roles', newRoles);
                                                }}
                                                className="rounded border-gray-300 text-[#eaae36] focus:ring-[#eaae36] cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-700 font-medium">{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Pegawai */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col">
                                <div className="flex flex-col mb-3 pb-3 border-b border-gray-200 gap-2">
                                    <h4 className="font-medium text-[#1a1a1a]">Pegawai Individual</h4>
                                    <input 
                                        type="text" 
                                        placeholder="Cari nama atau NIK..." 
                                        value={searchEmployee}
                                        onChange={(e) => setSearchEmployee(e.target.value)}
                                        className="w-full text-sm bg-white border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#eaae36] focus:border-transparent"
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                                    {filteredEmployees.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic text-center py-2">Pegawai tidak ditemukan.</p>
                                    ) : filteredEmployees.map((emp) => (
                                        <label key={emp.nik} className="flex items-center gap-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                                            <input
                                                type="checkbox"
                                                checked={data.employees.includes(emp.nik.toString()) || data.employees.includes(emp.nik)}
                                                onChange={(e) => {
                                                    const newEmps = e.target.checked 
                                                        ? [...data.employees, emp.nik.toString()]
                                                        : data.employees.filter(nik => nik.toString() !== emp.nik.toString());
                                                    setData('employees', newEmps);
                                                }}
                                                className="rounded border-gray-300 text-[#eaae36] focus:ring-[#eaae36] cursor-pointer mt-0.5 self-start"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-700 leading-tight">{emp.name}</span>
                                                <span className="text-xs text-gray-500 mt-0.5">{emp.nik}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                        <RedirectOutlineButton text="Batal" href="/meetings" className="me-auto" />
                        <SubmitOutlineButton text="Perbarui Jadwal" disabled={processing} />
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
