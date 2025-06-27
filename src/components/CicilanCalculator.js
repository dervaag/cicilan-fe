import React, { useState } from 'react';
// import { cicilanAPI } from '../services/api'; // API dinonaktifkan untuk sementara
import { formatCurrency, formatNumber, parseCurrency, validateCicilanInput } from '../utils'; // Path import diperbaiki

const CicilanCalculator = () => {
    const [formData, setFormData] = useState({
        otr: '',
        dp: '',
        jangkaWaktu: '',
        clientName: ''
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'otr' || name === 'dp') {
            const numValue = parseCurrency(value);
            setFormData(prev => ({
                ...prev,
                [name]: numValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateCicilanInput(formData.otr, formData.dp, formData.jangkaWaktu);

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setLoading(true);
        setErrors({});

        // --- SIMULASI API DENGAN DATA DUMMY ---
        // Fungsi API yang asli dinonaktifkan dan diganti dengan data tiruan
        // untuk fokus pada perbaikan tampilan (UI).
        setTimeout(() => {
            const otrNum = parseFloat(formData.otr) || 0;
            const dpNum = parseFloat(formData.dp) || 0;
            const jangkaWaktuNum = parseInt(formData.jangkaWaktu) || 0;

            const pokokUtang = otrNum - dpNum;
            // Bunga ditentukan secara manual untuk simulasi
            let bungaPersen = 16.5;
            if (jangkaWaktuNum <= 12) {
                bungaPersen = 12;
            } else if (jangkaWaktuNum <= 24) {
                bungaPersen = 14;
            }

            const totalBunga = pokokUtang * (bungaPersen / 100);
            const totalUtang = pokokUtang + totalBunga;
            const angsuranPerBulan = totalUtang / jangkaWaktuNum;

            const dummyResult = {
                otr: otrNum,
                dp: dpNum,
                jangkaWaktu: jangkaWaktuNum,
                pokokUtang: pokokUtang,
                bungaPersen: bungaPersen,
                totalBunga: totalBunga,
                totalUtang: totalUtang,
                angsuranPerBulan: angsuranPerBulan,
                kontrakNo: formData.clientName ? `DUMMY-${Math.floor(Math.random() * 1000)}` : null,
            };
            setResult(dummyResult);

            if (formData.clientName && dummyResult.kontrakNo) {
                alert(`✅ Mode Desain: Kontrak dummy berhasil dibuat dengan nomor: ${dummyResult.kontrakNo}`);
            }
            setLoading(false);
        }, 1000); // Menambahkan delay 1 detik untuk simulasi loading
        // --- AKHIR SIMULASI API ---
    };

    const handleReset = () => {
        setFormData({ otr: '', dp: '', jangkaWaktu: '', clientName: '' });
        setResult(null);
        setErrors({});
    };

    const calculateDpPercentage = () => {
        if (formData.otr && formData.dp) {
            return ((formData.dp / formData.otr) * 100).toFixed(1);
        }
        return 0;
    };

    const getBungaColor = (persen) => {
        if (persen <= 12) return 'text-green-600';
        if (persen <= 14) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Kalkulasi Cicilan Kendaraan</h1>
                <p className="text-gray-600">Hitung angsuran bulanan sesuai flowchart IMS Finance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Input Data Kendaraan</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                On The Road (OTR) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                                <input
                                    type="text"
                                    name="otr"
                                    value={formData.otr ? formatNumber(formData.otr) : ''}
                                    onChange={handleInputChange}
                                    placeholder="240.000.000"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.otr ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                            </div>
                            {errors.otr && <p className="text-red-500 text-sm mt-1">{errors.otr}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Down Payment (DP) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">Rp</span>
                                <input
                                    type="text"
                                    name="dp"
                                    value={formData.dp ? formatNumber(formData.dp) : ''}
                                    onChange={handleInputChange}
                                    placeholder="48.000.000"
                                    className={`w-full pl-10 pr-20 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dp ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {formData.otr > 0 && formData.dp > 0 && (
                                    <span className="absolute right-3 top-3 text-green-600 text-sm font-medium">
                                        {calculateDpPercentage()}%
                                    </span>
                                )}
                            </div>
                            {errors.dp && <p className="text-red-500 text-sm mt-1">{errors.dp}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Jangka Waktu <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="jangkaWaktu"
                                    value={formData.jangkaWaktu}
                                    onChange={handleInputChange}
                                    placeholder="18"
                                    min="1"
                                    max="60"
                                    className={`w-full pr-16 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.jangkaWaktu ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <span className="absolute right-3 top-3 text-gray-500">bulan</span>
                            </div>
                            {errors.jangkaWaktu && <p className="text-red-500 text-sm mt-1">{errors.jangkaWaktu}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nama Klien (Opsional)
                            </label>
                            <input
                                type="text"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleInputChange}
                                placeholder="Masukkan nama klien"
                                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="text-gray-500 text-sm mt-1">Jika diisi, data akan disimpan ke database</p>
                        </div>

                        {errors.submit && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {errors.submit}
                            </div>
                        )}

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Menghitung...' : 'Hitung Cicilan'}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* Result Section */}
                {result && !loading && (
                    <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Hasil Perhitungan</h2>
                            {result.kontrakNo && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {result.kontrakNo}
                                </span>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Harga OTR</span>
                                <span className="font-medium">{formatCurrency(result.otr)}</span>
                            </div>

                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Down Payment</span>
                                <span className="font-medium">{formatCurrency(result.dp)}</span>
                            </div>

                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Pokok Utang</span>
                                <span className="font-semibold text-blue-600">{formatCurrency(result.pokokUtang)}</span>
                            </div>

                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Jangka Waktu</span>
                                <span className="font-medium">{result.jangkaWaktu} bulan</span>
                            </div>

                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Bunga</span>
                                <span className={`font-semibold ${getBungaColor(result.bungaPersen)}`}>
                                    {result.bungaPersen}%
                                </span>
                            </div>

                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Total Bunga</span>
                                <span className="font-medium">{formatCurrency(result.totalBunga)}</span>
                            </div>

                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Total Utang</span>
                                <span className="font-medium">{formatCurrency(result.totalUtang)}</span>
                            </div>

                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg">Angsuran per Bulan</span>
                                    <span className="text-2xl font-bold">
                                        {formatCurrency(result.angsuranPerBulan)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bunga Info */}
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Tingkat Bunga (Sesuai Flowchart)</h4>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <div className="text-center">
                                    <div className="text-gray-600">≤ 12 bulan</div>
                                    <div className="font-semibold text-green-600">12%</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-gray-600">13-24 bulan</div>
                                    <div className="font-semibold text-yellow-600">14%</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-gray-600"> 24 bulan</div>
                                    <div className="font-semibold text-red-600">16.5%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {loading && (
                    <div className="flex justify-center items-center bg-white rounded-lg shadow-md p-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">Menghitung hasil...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CicilanCalculator;
