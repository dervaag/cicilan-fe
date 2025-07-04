import React, { useState, useEffect } from 'react';
// import { cicilanAPI } from '../services/api'; // API dinonaktifkan untuk sementara
import { formatCurrency, formatDate } from '../utils'; // Path import diperbaiki

const KontrakList = () => {
    const [kontrakList, setKontrakList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchKontrakList();
    }, []);

    const fetchKontrakList = async () => {
        setLoading(true);
        setError('');

        // --- SIMULASI API DENGAN DATA DUMMY ---
        setTimeout(() => {
            const dummyKontrak = [
                {
                    kontrakNo: 'KTR-DUMMY-001',
                    clientName: 'Budi Santoso',
                    otr: 250000000,
                    dp: 50000000,
                    angsuranPerBulan: 5250000,
                    jangkaWaktu: 48,
                    bungaPersen: '16.5',
                    createdAt: new Date().toISOString(),
                    stats: { progress: 50, sudahBayar: 24, belumBayar: 24 },
                    totalUtang: 252000000,
                },
                {
                    kontrakNo: 'KTR-DUMMY-002',
                    clientName: 'Citra Lestari (Lunas)',
                    otr: 180000000,
                    dp: 40000000,
                    angsuranPerBulan: 4500000,
                    jangkaWaktu: 36,
                    bungaPersen: '14.0',
                    createdAt: new Date().toISOString(),
                    stats: { progress: 100, sudahBayar: 36, belumBayar: 0 },
                    totalUtang: 162000000,
                },
                {
                    kontrakNo: 'KTR-DUMMY-003',
                    clientName: 'Ahmad Dahlan',
                    otr: 120000000,
                    dp: 30000000,
                    angsuranPerBulan: 3100000,
                    jangkaWaktu: 36,
                    bungaPersen: '14.0',
                    createdAt: new Date().toISOString(),
                    stats: { progress: 10, sudahBayar: 4, belumBayar: 32 },
                    totalUtang: 111600000,
                }
            ];
            setKontrakList(dummyKontrak);
            setLoading(false);
        }, 1000);
        // --- AKHIR SIMULASI API ---
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getStatusBadge = (stats) => {
        if (!stats) return null;
        if (stats.belumBayar === 0) {
            return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Lunas</span>;
        } else if (stats.sudahBayar === 0) {
            return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Baru</span>;
        } else {
            return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Dalam Proses</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Memuat data kontrak...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Daftar Kontrak Cicilan</h1>
                    <p className="text-gray-600 mt-1">Kelola dan monitor semua kontrak cicilan kendaraan</p>
                </div>
                <button
                    onClick={fetchKontrakList}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Refresh Data
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <span className="text-sm text-gray-600">
                    Total Kontrak: <span className="font-semibold">{kontrakList.length}</span>
                </span>
            </div>

            {kontrakList.length === 0 && !loading ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📄</div>
                    <p className="text-gray-600">Belum ada kontrak yang tersedia</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kontrakList.map((kontrak) => (
                        <div key={kontrak.kontrakNo} className="bg-white rounded-lg shadow-md overflow-hidden animate-fadeIn">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">{kontrak.kontrakNo}</h3>
                                        <p className="text-blue-100">{kontrak.clientName}</p>
                                    </div>
                                    {getStatusBadge(kontrak.stats)}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">OTR:</span>
                                        <span className="font-medium">{formatCurrency(kontrak.otr)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">DP:</span>
                                        <span className="font-medium">{formatCurrency(kontrak.dp)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Angsuran/Bulan:</span>
                                        <span className="font-semibold text-blue-600">{formatCurrency(kontrak.angsuranPerBulan)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Jangka Waktu:</span>
                                        <span className="font-medium">{kontrak.jangkaWaktu} bulan</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Bunga:</span>
                                        <span className="font-medium text-purple-600">{kontrak.bungaPersen}%</span>
                                    </div>
                                </div>

                                {kontrak.stats && (
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-600">Progress Pembayaran</span>
                                                <span className="font-medium">{kontrak.stats.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(kontrak.stats.progress)}`}
                                                    style={{ width: `${kontrak.stats.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="text-center p-2 bg-green-50 rounded">
                                                <div className="text-green-600 font-semibold">{kontrak.stats.sudahBayar}</div>
                                                <div className="text-gray-600">Sudah Bayar</div>
                                            </div>
                                            <div className="text-center p-2 bg-red-50 rounded">
                                                <div className="text-red-600 font-semibold">{kontrak.stats.belumBayar}</div>
                                                <div className="text-gray-600">Belum Bayar</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 pt-3 border-t border-gray-200">
                                    <div className="text-xs text-gray-500">
                                        Dibuat: {formatDate(kontrak.createdAt)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KontrakList;