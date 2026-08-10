import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link } from '@inertiajs/react';

export default function Show({ participant, results }) {
    // Extract results data safely
    const papiData = results?.papi || {};
    const traitScores = papiData.traitScores || {};
    const traitsDetails = papiData.traitsDetails || {};
    const answers = papiData.answers || [];

    // Extract basic participant data
    const name = participant?.name || results?.participant?.name || 'Peserta';
    const email = participant?.email || results?.participant?.email || '-';
    const age = participant?.age || '-';
    const position = participant?.position || '-';
    const institution = participant?.institution || '-';
    
    // Check token test type from either source
    const testType = participant?.token?.test_type || results?.participant?.token_type || '-';

    return (
        <DashboardLayout judulHalaman="Hasil Tes Peserta">
            <Head title={`Hasil Tes: ${name}`} />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-200">Hasil Tes: {name}</h1>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-6">
                <Link
                    href="/participants"
                    className="px-4 py-2 bg-[#333333] hover:bg-[#444444] text-gray-300 hover:text-white text-xs font-semibold rounded shadow-sm transition-colors"
                >
                    &larr; KEMBALI
                </Link>
                <button
                    className="px-4 py-2 bg-[#f0c182] hover:bg-[#dfb175] text-[#4a3419] text-xs font-bold rounded shadow-sm transition-colors"
                >
                    EKSPOR KE PDF
                </button>
            </div>

            {/* Informasi Peserta */}
            <div className="bg-[#1e1e1e] border border-[#2b2b2c] rounded-lg p-6 mb-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-200 mb-4">Informasi Peserta</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>
                        <p className="mb-2"><span className="text-gray-400 me-1">Nama:</span> {name}</p>
                        <p className="mb-2"><span className="text-gray-400 me-1">Email:</span> {email}</p>
                        <p className="mb-2"><span className="text-gray-400 me-1">Usia:</span> {age}</p>
                    </div>
                    <div>
                        <p className="mb-2"><span className="text-gray-400 me-1">Posisi:</span> {position}</p>
                        <p className="mb-2"><span className="text-gray-400 me-1">Institusi:</span> {institution}</p>
                        <p className="mb-2"><span className="text-gray-400 me-1">Jenis Tes:</span> {testType}</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6 border-b border-[#2b2b2c]">
                <div className="inline-block px-4 py-2 text-[#f0c182] font-semibold border-b-2 border-[#f0c182]">
                    PapiKostick
                </div>
            </div>

            {/* Skor Sifat */}
            <div className="bg-[#1e1e1e] border border-[#2b2b2c] rounded-lg mb-8 overflow-hidden shadow-sm flex flex-col">
                <div className="p-6 pb-4 shrink-0">
                    <h2 className="text-lg font-bold text-gray-200">Skor Sifat</h2>
                </div>
                <div className="overflow-auto max-h-[350px]">
                    <table className="w-full text-sm text-left text-gray-300 relative">
                        <thead className="text-xs text-gray-500 uppercase bg-[#252526] sticky top-0 z-10 shadow-sm border-y border-[#2b2b2c]">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-medium">KODE</th>
                                <th scope="col" className="px-6 py-3 font-medium">NAMA SIFAT</th>
                                <th scope="col" className="px-6 py-3 font-medium">SKOR</th>
                                <th scope="col" className="px-6 py-3 font-medium">DESKRIPSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(traitScores).length > 0 ? (
                                Object.keys(traitScores).map((key, index) => (
                                    <tr key={index} className="border-b border-[#2b2b2c] hover:bg-[#2a2a2b] transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-200">{key}</td>
                                        <td className="px-6 py-4">{traitsDetails[key]?.name || '-'}</td>
                                        <td className="px-6 py-4 font-bold text-gray-200">{traitScores[key]}</td>
                                        <td className="px-6 py-4 text-gray-400">{traitsDetails[key]?.description || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Tidak ada data skor (Tes belum selesai).</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Jawaban */}
            <div className="bg-[#1e1e1e] border border-[#2b2b2c] rounded-lg overflow-hidden shadow-sm flex flex-col">
                <div className="p-6 pb-4 shrink-0">
                    <h2 className="text-lg font-bold text-gray-200">Detail Jawaban</h2>
                </div>
                <div className="overflow-auto max-h-[450px]">
                    <table className="w-full text-sm text-left text-gray-300 relative">
                        <thead className="text-xs text-gray-500 uppercase bg-[#252526] sticky top-0 z-10 shadow-sm border-y border-[#2b2b2c]">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-medium">NO.</th>
                                <th scope="col" className="px-6 py-3 font-medium">PILIHAN A</th>
                                <th scope="col" className="px-6 py-3 font-medium">SIFAT A</th>
                                <th scope="col" className="px-6 py-3 font-medium">PILIHAN B</th>
                                <th scope="col" className="px-6 py-3 font-medium">SIFAT B</th>
                                <th scope="col" className="px-6 py-3 font-medium">JAWABAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {answers.length > 0 ? (
                                answers.map((answer, index) => (
                                    <tr key={index} className="border-b border-[#2b2b2c] hover:bg-[#2a2a2b] transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-200">{answer.question_id}</td>
                                        <td className="px-6 py-4">{answer.statement_a}</td>
                                        <td className="px-6 py-4">{answer.choice_a_trait}</td>
                                        <td className="px-6 py-4">{answer.statement_b}</td>
                                        <td className="px-6 py-4">{answer.choice_b_trait}</td>
                                        <td className="px-6 py-4 font-bold text-[#f0c182]">{answer.chosen_option}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Tidak ada data jawaban (Tes belum selesai).</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </DashboardLayout>
    );
}
