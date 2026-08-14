export default function Table({ columns, data }) {
    return (
        <div className="overflow-x-auto dark-scrollbar bg-[#ffffff] rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">

                {/* Bagian Header Tabel */}
                <thead className="bg-[#f8f8f8]">
                    <tr className="border-b border-gray-200">
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-center text-xs font-semibold text-[#1a1a1a] uppercase tracking-wider"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Bagian Isi Data Tabel */}
                <tbody className="divide-y divide-gray-200 bg-transparent">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a] text-center">
                                        {/* Jika di pengaturan kolom ada fungsi 'render' kustom (seperti tombol), gunakan itu.
                                           Jika tidak, cukup tampilkan teks biasa berdasarkan 'accessor'. 
                                        */}
                                        {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-[#1a1a1a]">
                                Tidak ada data yang ditemukan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}