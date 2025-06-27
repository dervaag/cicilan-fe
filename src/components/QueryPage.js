import React, { useState, useEffect } from 'react';
// import { cicilanAPI } from '../services/api'; // API dinonaktifkan untuk sementara
import { formatCurrency, formatDate } from '../utils'; // Path import diperbaiki

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
        // Automatically run query when component loads for the first time
        handleQuery();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

        // --- SIMULASI API DENGAN DATA DUMMY ---
        setTimeout(() => {
            if (activeTab === 'jatuh-tempo') {
                const dummyJatuhTempo = [
                    { KONTRAK_NO: 'DUMMY-JT-001', CLIENT_NAME: queryParams.clientName, TOTAL_ANGSURAN_JATUH_TEMPO: 35000000 },
                    { KONTRAK_NO: 'DUMMY-JT-002', CLIENT_NAME: queryParams.clientName, TOTAL_ANGSURAN_JATUH_TEMPO: 12000000 },
                ];
                setResults(dummyJatuhTempo);
                setSummary(null); // Summary tidak digunakan di mode dummy
            } else { // denda
                const dummyDenda = [
                    { KONTRAK_NO: 'DUMMY-DND-001', CLIENT_NAME: queryParams.clientName, INSTALLMENT_NO: 5, HARI_KETERLAMBATAN: 20, TOTAL_DENDA: 243200 },
                    { KONTRAK_NO: 'DUMMY-DND-001', CLIENT_NAME: queryParams.clientName, INSTALLMENT_NO: 6, HARI_KETERLAMBATAN: 10, TOTAL_DENDA: 121600 },
                ];
                setResults(dummyDenda);
                setSummary(null);
            }
            setLoading(false);
        }, 1000);
        // --- AKHIR SIMULASI API ---
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
                </div>
            );
        }

        const totalJatuhTempo = results.reduce((sum, item) => sum + parseFloat(item.TOTAL_ANGSURAN_JATUH_TEMPO), 0);

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                        <p className="text-blue-100 text-sm">Total Kontrak</p>
                        <p className="text-2xl font-bold">{results.length}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                        <p className="text-green-100 text-sm">Total Jatuh Tempo</p>
                        <p className="text-xl font-bold">{formatCurrency(totalJatuhTempo)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                        <p className="text-purple-100 text-sm">Sampai Tanggal</p>
                        <p className="text-lg font-bold">{formatDate(queryParams.tanggal)}</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold">Soal 2: Total Angsuran Jatuh Tempo</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontrak No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client Name</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Angsuran Jatuh Tempo</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {results.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.KONTRAK_NO}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.CLIENT_NAME}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-green-600">{formatCurrency(item.TOTAL_ANGSURAN_JATUH_TEMPO)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-100 font-semibold">
                                    <td colSpan="2" className="px-6 py-4 text-right text-gray-900">TOTAL KESELURUHAN:</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-lg text-blue-600">{formatCurrency(totalJatuhTempo)}</td>
                                </tr>
                            </tbody>
                        </table>
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
                </div>
            );
        }

        const totalDenda = results.reduce((sum, item) => sum + parseFloat(item.TOTAL_DENDA), 0);

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg">
                        <p className="text-red-100 text-sm">Total Denda</p>
                        <p className="text-xl font-bold">{formatCurrency(totalDenda)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                        <p className="text-orange-100 text-sm">Angsuran Terlambat</p>
                        <p className="text-2xl font-bold">{results.length}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold">Soal 3: Denda Keterlambatan Pembayaran</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kontrak No</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Angsuran Ke</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hari Telat</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Denda</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {results.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.KONTRAK_NO}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">{item.INSTALLMENT_NO}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">{item.HARI_KETERLAMBATAN}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-red-600">{formatCurrency(item.TOTAL_DENDA)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-red-50 font-semibold">
                                    <td colSpan="3" className="px-6 py-4 text-right text-gray-900">TOTAL DENDA KESELURUHAN:</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-lg text-red-600">{formatCurrency(totalDenda)}</td>
                                </tr>
                            </tbody>
                        </table>
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

            <div className="mb-8">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl max-w-md mx-auto">
                    <button
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${activeTab === 'jatuh-tempo' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('jatuh-tempo')} >
                        Total Jatuh Tempo
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${activeTab === 'denda' ? 'bg-white text-red-600 shadow' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('denda')} >
                        Denda Keterlambatan
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Klien</label>
                        <input type="text" name="clientName" value={queryParams.clientName} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                        <input type="date" name="tanggal" value={queryParams.tanggal} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg" />
                    </div>
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Memproses...' : 'Jalankan Query'}
                    </button>
                </form>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-lg">{error}</div>}

            {loading && (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                </div>
            )}

            {results && !loading && (
                <div className="animate-fadeIn">
                    {activeTab === 'jatuh-tempo' ? renderJatuhTempoResults() : renderDendaResults()}
                </div>
            )}
        </div>
    );
};

export default QueryPage;