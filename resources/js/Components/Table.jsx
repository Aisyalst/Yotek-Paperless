export default function Table({ columns, data }) {
    return (
        <div className="overflow-x-auto dark-scrollbar bg-[#252526]/10 rounded-lg border border-gray-700 shadow-sm">
            <table className="min-w-full divide-y divide-gray-700/50">

                {/* Bagian Header Tabel */}
                <thead className="bg-[#252526]/20">
                    <tr className="border-b border-gray-700/50">
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-center text-xs text-semibold font-medium text-gray-200 uppercase tracking-wider"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Bagian Isi Data Tabel */}
                <tbody className="divide-y divide-gray-700/50 bg-transparent">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-[#252526]/20 transition-colors">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 text-center">
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
                            <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-gray-200">
                                Tidak ada data yang ditemukan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}