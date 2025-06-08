import moment from 'moment';

// Format currency to Rupiah
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Format number with thousand separators
export const formatNumber = (number) => {
    if (!number && number !== 0) return '0';
    return new Intl.NumberFormat('id-ID').format(number);
};

// Format date
export const formatDate = (date) => {
    if (!date) return '-';
    return moment(date).format('DD MMMM YYYY');
};

// Parse currency input
export const parseCurrency = (value) => {
    if (!value) return 0;
    const cleanValue = value.toString().replace(/[^\d]/g, '');
    return parseFloat(cleanValue) || 0;
};

// Validate cicilan input
export const validateCicilanInput = (otr, dp, jangkaWaktu) => {
    const errors = {};
    
    if (!otr || otr <= 0) {
        errors.otr = 'OTR harus diisi dan lebih besar dari 0';
    }
    
    if (!dp || dp < 0) {
        errors.dp = 'DP tidak boleh negatif';
    }
    
    if (dp && otr && dp >= otr) {
        errors.dp = 'DP tidak boleh lebih besar atau sama dengan OTR';
    }
    
    if (!jangkaWaktu || jangkaWaktu <= 0) {
        errors.jangkaWaktu = 'Jangka waktu harus diisi dan lebih besar dari 0';
    }
    
    if (jangkaWaktu > 60) {
        errors.jangkaWaktu = 'Jangka waktu maksimal 60 bulan';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};