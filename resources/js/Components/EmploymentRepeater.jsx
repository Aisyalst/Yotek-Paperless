import React from 'react';

const EMPLOYMENT_STATUSES = ['Active', 'Inactive', 'Resigned', 'Terminated'];

/**
 * Repeater penempatan karyawan: satu baris = satu kombinasi
 * Perusahaan + Cabang + Departemen + Jabatan + Level + Atasan + Status + Tgl Gabung.
 *
 * Baris pertama dianggap penempatan UTAMA (Primary).
 * Dipakai untuk karyawan multi-perusahaan DAN multi-jabatan sekaligus.
 */
export default function EmploymentRepeater({
    value = [],
    onChange,
    companies = [],
    ranks = [],
    positions = [],
    allUsers = [],
}) {
    const rows = Array.isArray(value) && value.length ? value : [emptyRow()];

    const updateRow = (index, key, val) => {
        onChange(rows.map((row, i) => (i === index ? { ...row, [key]: val } : row)));
    };

    const addRow = () => {
        onChange([...rows, emptyRow()]);
    };

    const removeRow = (index) => {
        onChange(rows.filter((_, i) => i !== index));
    };

    const branchOptions = (companyName) => {
        const company = companies.find((c) => c.name === companyName);
        if (!company || !Array.isArray(company.branch)) return [];
        return company.branch.map((b) => `${b.region}, ${b.province}, ${b.city}`);
    };

    const inputClass =
        'w-full bg-white border border-gray-200 text-[#1a1a1a] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed';
    const labelClass = 'block text-xs font-semibold text-gray-500 mb-1';

    return (
        <div className="space-y-4">
            {rows.map((row, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50/60">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#1a1a1a]">
                                Penempatan {index + 1}
                            </span>
                            {index === 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#eaae36] text-white">
                                    Primary
                                </span>
                            )}
                        </div>
                        {rows.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeRow(index)}
                                className="text-xs font-semibold text-red-600 hover:text-red-700"
                            >
                                Hapus
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Perusahaan</label>
                            <select
                                value={row.company || ''}
                                onChange={(e) => updateRow(index, 'company', e.target.value)}
                                className={inputClass}
                            >
                                <option value="">Pilih Perusahaan</option>
                                {companies.map((c) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Cabang</label>
                            <select
                                value={row.branch || ''}
                                onChange={(e) => updateRow(index, 'branch', e.target.value)}
                                className={inputClass}
                                disabled={!row.company}
                            >
                                <option value="">Pilih Cabang</option>
                                {branchOptions(row.company).map((b, i) => (
                                    <option key={i} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Departemen</label>
                            <input
                                type="text"
                                value={row.department || ''}
                                onChange={(e) => updateRow(index, 'department', e.target.value)}
                                className={inputClass}
                                placeholder="Departemen"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Jabatan</label>
                            <select
                                value={row.employee_position_id || ''}
                                onChange={(e) => updateRow(index, 'employee_position_id', e.target.value)}
                                className={inputClass}
                            >
                                <option value="">Pilih Jabatan</option>
                                {positions.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Level</label>
                            <select
                                value={row.employee_rank_id || ''}
                                onChange={(e) => updateRow(index, 'employee_rank_id', e.target.value)}
                                className={inputClass}
                            >
                                <option value="">Pilih Level</option>
                                {ranks.map((r) => (
                                    <option key={r.id} value={r.id}>{r.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Atasan Langsung</label>
                            <select
                                value={row.direct_supervisor || ''}
                                onChange={(e) => updateRow(index, 'direct_supervisor', e.target.value)}
                                className={inputClass}
                            >
                                <option value="">Pilih Atasan Langsung</option>
                                {allUsers.map((u) => (
                                    <option key={u.nik} value={u.nik}>{u.name} ({u.nik})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Status Kepegawaian</label>
                            <select
                                value={row.employment_status || ''}
                                onChange={(e) => updateRow(index, 'employment_status', e.target.value)}
                                className={inputClass}
                            >
                                <option value="">Pilih Status</option>
                                {EMPLOYMENT_STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Tanggal Bergabung</label>
                            <input
                                type="date"
                                value={row.join_date || ''}
                                onChange={(e) => updateRow(index, 'join_date', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addRow}
                className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:border-[#eaae36] hover:text-[#eaae36] transition-colors"
            >
                + Tambah Penempatan
            </button>
        </div>
    );
}

function emptyRow() {
    return {
        company: '',
        branch: '',
        department: '',
        employee_position_id: '',
        employee_rank_id: '',
        direct_supervisor: '',
        employment_status: '',
        join_date: '',
    };
}
