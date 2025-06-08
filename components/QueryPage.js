import React, { useState, useEffect } from 'react';
import { cicilanAPI } from '../services/api';
import { formatCurrency, formatDate } from '../utils';

const QueryPage = () => {
    const [activeTab, setActiveTab] = useState('jatuh-tempo');
    const [queryParams, setQueryParams] = useState({
        clientName: 'SUGUS',
        tanggal: '2024-08-14'
    });
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        handleQuery();
    }, [activeTab]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQueryParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuery = async () => {
        setLoading(true);
        setError('');
        
        try {
            let response;
            if (activeTab === 'jatuh-tempo') {
                response = await cicilanAPI.getTotalJatuhTempo(queryParams);
                setSummary(null);
            } else {
                response = await cicilanAPI.getDenda(queryParams);
                setSummary(response.summary);
            }
            
            setResults(response.data);
        } catch (err) {
            setError(err.message || 'Terjadi kesalahan saat mengambil data');
            setResults(null);
            setSummary(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleQuery();
    };

    const renderJatuhTempoResults = () => {
        if (!results || results.length === 0) {
            return (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <p className="text-gray-600 text-lg">Tidak ada data yang ditemukan</p>
                    <p className="text-gray-500 text-sm mt-2">Coba ubah parameter pencarian</p>
                </div>
            );
        }

        const totalJatuhTempo = results.reduce((sum, item) => sum + parseFloat(item.TOTAL_ANGSURAN_JATUH_TEMPO), 0);

        return (
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Total Kontrak</p>
                                <p className="text-2xl font-bold">{results.length}</p>
                            </div>
                            <div className="text-3xl opacity-80">📄</div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Total Jatuh Tempo</p>
                                <p className="text-xl font-bold">{formatCurrency(totalJatuhTempo)}</p>
                            </div>
                            <div className="text-3xl opacity-80">💰</div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Sampai Tanggal</p>
                                <p className="text-lg font-bold">{formatDate(queryParams.tanggal)}</p>
                            </div>
                            <div className="text-3xl opacity-80">📅</div>
                        </div>
                    </div>
                </div>

                {/* Main Results Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                        <h3 className="text-xl font-semibold flex items-center">
                            <span className="mr-2">📊</span>
                            Soal 2: Total Angsuran Jatuh Tempo
                        </h3>
                        <p className="text-blue-100 mt-1">
                            Menampilkan total angsuran yang sudah jatuh tempo untuk klien "{queryParams.clientName}" 
                            sampai dengan {formatDate(queryParams.tanggal)}
                        </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <span className="mr-1">🏷️</span>
                                            Kontrak No
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <span className="mr-1">👤</span>
                                            Client Name
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center justify-end">
                                            <span className="mr-1">💵</span>
                                            Total Angsuran Jatuh Tempo
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {results.map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-600 font-semibold text-sm">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.KONTRAK_NO}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">{item.CLIENT_NAME}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-lg font-bold text-green-600">
                                                {formatCurrency(item.TOTAL_ANGSURAN_JATUH_TEMPO)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {((item.TOTAL_ANGSURAN_JATUH_TEMPO / totalJatuhTempo) * 100).toFixed(1)}% dari total
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                {/* Total Row */}
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 font-semibold">
                                    <td colSpan="2" className="px-6 py-4 text-right text-gray-900">
                                        <div className="flex items-center justify-end">
                                            <span className="mr-2">📊</span>
                                            <span className="text-lg">TOTAL KESELURUHAN:</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-xl font-bold text-blue-600">
                                            {formatCurrency(totalJatuhTempo)}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SQL Query Section */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gray-800 text-white p-4">
                        <h4 className="font-semibold flex items-center">
                            <span className="mr-2">🔍</span>
                            Query SQL (Konsep):
                        </h4>
                    </div>
                    <div className="p-4">
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`SELECT 
    k.kontrak_no,
    k.client_name,
    SUM(ja.angsuran_per_bulan) as total_angsuran_jatuh_tempo
FROM kontrak k
JOIN jadwal_angsuran ja ON k.kontrak_no = ja.kontrak_no
WHERE k.client_name = '${queryParams.clientName}'
    AND ja.tanggal_jatuh_tempo <= '${queryParams.tanggal}'
GROUP BY k.kontrak_no, k.client_name
ORDER BY total_angsuran_jatuh_tempo DESC;`}
                        </pre>
                        <div className="mt-3 text-sm text-gray-600">
                            <p><strong>Penjelasan Query:</strong></p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Menggabungkan tabel kontrak dan jadwal_angsuran</li>
                                <li>Filter berdasarkan nama klien dan tanggal jatuh tempo</li>
                                <li>Menghitung total angsuran yang sudah jatuh tempo</li>
                                <li>Mengurutkan berdasarkan total angsuran tertinggi</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDendaResults = () => {
        if (!results || results.length === 0) {
            return (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">⚠️</div>
                    <p className="text-gray-600 text-lg">Tidak ada data tunggakan yang ditemukan</p>
                    <p className="text-gray-500 text-sm mt-2">Semua angsuran telah dibayar tepat waktu</p>
                </div>
            );
        }

        const totalDenda = results.reduce((sum, item) => sum + parseFloat(item.TOTAL_DENDA), 0);
        const totalAngsuranTerlambat = results.length;
        const totalHariKeterlambatan = results.reduce((sum, item) => sum + item.HARI_KETERLAMBATAN, 0);
        const rataRataHariTerlambat = totalAngsuranTerlambat > 0 ? Math.round(totalHariKeterlambatan / totalAngsuranTerlambat) : 0;

        return (
            <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm">Total Denda</p>
                                <p className="text-xl font-bold">{formatCurrency(totalDenda)}</p>
                            </div>
                            <div className="text-3xl opacity-80">💸</div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm">Angsuran Terlambat</p>
                                <p className="text-2xl font-bold">{totalAngsuranTerlambat}</p>
                            </div>
                            <div className="text-3xl opacity-80">📋</div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100 text-sm">Total Hari Telat</p>
                                <p className="text-2xl font-bold">{totalHariKeterlambatan}</p>
                            </div>
                            <div className="text-3xl opacity-80">⏰</div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Rata-rata Telat</p>
                                <p className="text-2xl font-bold">{rataRataHariTerlambat} hari</p>
                            </div>
                            <div className="text-3xl opacity-80">📊</div>
                        </div>
                    </div>
                </div>

                {/* Main Results Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6">
                        <h3 className="text-xl font-semibold flex items-center">
                            <span className="mr-2">⚠️</span>
                            Soal 3: Denda Keterlambatan Pembayaran
                        </h3>
                        <p className="text-red-100 mt-1">
                            Denda keterlambatan 0,1% per hari untuk klien "{queryParams.clientName}" 
                            sampai dengan {formatDate(queryParams.tanggal)}
                        </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <span className="mr-1">🏷️</span>
                                            Kontrak No
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <span className="mr-1">👤</span>
                                            Client Name
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center justify-center">
                                            <span className="mr-1">📝</span>
                                            Installment No
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center justify-center">
                                            <span className="mr-1">⏱️</span>
                                            Hari Keterlambatan
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center justify-end">
                                            <span className="mr-1">💸</span>
                                            Total Denda
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {results.map((item, index) => (
                                    <tr key={index} className="hover:bg-red-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                                        <span className="text-red-600 font-semibold text-sm">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.KONTRAK_NO}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">{item.CLIENT_NAME}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Angsuran ke-{item.INSTALLMENT_NO}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-lg font-bold ${item.HARI_KETERLAMBATAN > 30 ? 'text-red-600' : item.HARI_KETERLAMBATAN > 14 ? 'text-orange-500' : 'text-yellow-600'}`}>
                                                    {item.HARI_KETERLAMBATAN}
                                                </span>
                                                <span className="text-xs text-gray-500">hari</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-lg font-bold text-red-600">
                                                {formatCurrency(item.TOTAL_DENDA)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {((item.TOTAL_DENDA / totalDenda) * 100).toFixed(1)}% dari total
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                {/* Total Row */}
                                <tr className="bg-gradient-to-r from-red-50 to-pink-50 font-semibold border-t-2 border-red-200">
                                    <td colSpan="4" className="px-6 py-4 text-right text-gray-900">
                                        <div className="flex items-center justify-end">
                                            <span className="mr-2">💸</span>
                                            <span className="text-lg">TOTAL DENDA KESELURUHAN:</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-xl font-bold text-red-600">
                                            {formatCurrency(totalDenda)}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detailed Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Denda Information */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">ℹ️</span>
                            Informasi Denda
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Tarif Denda:</span>
                                <span className="font-medium text-red-600">0,1% per hari</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Periode Perhitungan:</span>
                                <span className="font-medium">sampai {formatDate(queryParams.tanggal)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Status Pembayaran:</span>
                                <span className="font-medium">Sudah bayar Jan-Mei 2024</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600">Tunggakan:</span>
                                <span className="font-medium text-red-600">Juni-Agustus 2024</span>
                            </div>
                        </div>
                    </div>

                    {/* Calculation Breakdown */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">🧮</span>
                            Perhitungan Denda
                        </h4>
                        <div className="space-y-3 text-sm">
                            {results.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                    <div className="font-medium text-gray-900 mb-1">
                                        Angsuran ke-{item.INSTALLMENT_NO}
                                    </div>
                                    <div className="text-gray-600">
                                        Rp 12.160.000 × 0,1% × {item.HARI_KETERLAMBATAN} hari = {formatCurrency(item.TOTAL_DENDA)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SQL Query Section */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gray-800 text-white p-4">
                        <h4 className="font-semibold flex items-center">
                            <span className="mr-2">🔍</span>
                            Query SQL (Konsep):
                        </h4>
                    </div>
                    <div className="p-4">
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`SELECT 
    k.kontrak_no,
    k.client_name,
    ja.angsuran_ke,
    DATEDIFF('${queryParams.tanggal}', ja.tanggal_jatuh_tempo) as hari_keterlambatan,
    (ja.angsuran_per_bulan * 0.001 * 
     DATEDIFF('${queryParams.tanggal}', ja.tanggal_jatuh_tempo)) as total_denda
FROM kontrak k
JOIN jadwal_angsuran ja ON k.kontrak_no = ja.kontrak_no
WHERE k.client_name = '${queryParams.clientName}'
    AND ja.status_bayar = 'BELUM_BAYAR'
    AND ja.tanggal_jatuh_tempo <= '${queryParams.tanggal}'
ORDER BY ja.angsuran_ke;`}
                        </pre>
                        <div className="mt-3 text-sm text-gray-600">
                            <p><strong>Penjelasan Query:</strong></p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Menggabungkan tabel kontrak dan jadwal_angsuran</li>
                                <li>Filter angsuran yang belum dibayar dan sudah jatuh tempo</li>
                                <li>Menghitung hari keterlambatan dengan DATEDIFF</li>
                                <li>Menghitung denda: angsuran × 0.1% × hari keterlambatan</li>
                                <li>Mengurutkan berdasarkan nomor angsuran</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Query Data Cicilan</h1>
                <p className="text-gray-600 text-lg">Analisis data angsuran dan perhitungan denda keterlambatan</p>
            </div>

            {/* Tabs */}
            <div className="mb-8">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl max-w-md mx-auto">
                    <button
                        className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === 'jatuh-tempo'
                                ? 'bg-white text-blue-600 shadow-md transform scale-105'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setActiveTab('jatuh-tempo')}
                    >
                        <div className="flex items-center justify-center">
                            <span className="mr-1">📊</span>
                            Soal 2: Total Jatuh Tempo
                        </div>
                    </button>
                    <button
                        className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === 'denda'
                                ? 'bg-white text-red-600 shadow-md transform scale-105'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        onClick={() => setActiveTab('denda')}
                    >
                        <div className="flex items-center justify-center">
                            <span className="mr-1">⚠️</span>
                            Soal 3: Denda Keterlambatan
                        </div>
                    </button>
                </div>
            </div>

            {/* Query Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="flex items-center">
                                <span className="mr-1">👤</span>
                                Nama Klien
                            </span>
                        </label>
                        <input
                            type="text"
                            name="clientName"
                            value={queryParams.clientName}
                            onChange={handleInputChange}
                            placeholder="SUGUS"
                            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="flex-1 min-w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="flex items-center">
                                <span className="mr-1">📅</span>
                                Tanggal {activeTab === 'jatuh-tempo' ? 'Batas' : 'Perhitungan'}
                            </span>
                        </label>
                        <input
                            type="date"
                            name="tanggal"
                            value={queryParams.tanggal}
                            onChange={handleInputChange}
                            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        <div className="flex items-center">
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">🔍</span>
                                    Jalankan Query
                                </>
                            )}
                        </div>
                    </button>
                </form>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <div className="text-sm text-blue-800">
                        {activeTab === 'jatuh-tempo' ? (
                            <div className="flex items-start">
                                <span className="mr-2 mt-0.5">💡</span>
                                <div>
                                    <strong>Query Total Angsuran Jatuh Tempo:</strong> 
                                    <p className="mt-1">Menampilkan total angsuran yang sudah jatuh tempo untuk klien tertentu sampai dengan tanggal yang ditentukan. Query ini menggabungkan tabel kontrak dengan jadwal angsuran dan menghitung jumlah kumulatif angsuran yang harus dibayar.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start">
                                <span className="mr-2 mt-0.5">⚠️</span>
                                <div>
                                    <strong>Query Denda Keterlambatan:</strong> 
                                    <p className="mt-1">Menghitung denda keterlambatan 0,1% per hari untuk angsuran yang belum dibayar dan sudah melewati tanggal jatuh tempo. Denda dihitung berdasarkan selisih hari antara tanggal perhitungan dengan tanggal jatuh tempo.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
                    <div className="flex items-center">
                        <span className="mr-2 text-xl">❌</span>
                        <div>
                            <p className="font-medium">Terjadi Kesalahan</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Sedang memproses query...</p>
                        <p className="text-gray-500 text-sm mt-1">Mengambil data dari database</p>
                    </div>
                </div>
            )}

            {/* Results */}
            {results && !loading && (
                <div className="animate-fadeIn">
                    {activeTab === 'jatuh-tempo' ? renderJatuhTempoResults() : renderDendaResults()}
                </div>
            )}

            {/* Footer Information */}
            <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Informasi Tambahan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="bg-white rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                <span className="mr-2">📊</span>
                                Tentang Soal 2
                            </h4>
                            <p>Query ini menghitung total angsuran yang sudah jatuh tempo berdasarkan tanggal. Berguna untuk mengetahui berapa banyak uang yang seharusnya sudah masuk dari klien tertentu sampai tanggal tertentu.</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                <span className="mr-2">⚠️</span>
                                Tentang Soal 3
                            </h4>
                            <p>Query ini menghitung denda keterlambatan dengan tarif 0,1% per hari. Denda dihitung dari tanggal jatuh tempo sampai tanggal perhitungan untuk setiap angsuran yang belum dibayar.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueryPage;