export const formatCurrency = (value: number | string): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numericValue)) return 'Kz 0,00';

    return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA',
    }).format(numericValue);
};

export const formatDate = (date: Date | string): string => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';

    return new Intl.DateTimeFormat('pt-AO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(parsedDate);
};

export const formatTime = (time?: string | null): string => {
    return time?.slice(0, 5) || '';
};

export const formatDateTime = (date: Date | string): string => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';

    return new Intl.DateTimeFormat('pt-AO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(parsedDate);
};
