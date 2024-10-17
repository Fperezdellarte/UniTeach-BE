const calculateEndDate = (hour, date) => {
    // Extrae el tiempo de fin de la clase
    const endTime = hour.split(' - ')[1];
    const endDateTime = new Date(date);

    // Ajusta el tiempo de la fecha
    const [hours, minutes] = endTime.split(':').map(Number);
    endDateTime.setHours(hours, minutes, 0, 0);

    // Devuelve la fecha y hora en formato YYYY-MM-DD HH:MM:SS
    const year = endDateTime.getFullYear();
    const month = (endDateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = endDateTime.getDate().toString().padStart(2, '0');
    const hoursFormatted = endDateTime.getHours().toString().padStart(2, '0');
    const minutesFormatted = endDateTime.getMinutes().toString().padStart(2, '0');
    const secondsFormatted = endDateTime.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
};

const calculateEndDateFromHour = (hour, startDate) => {
    try {
        if (!startDate) {
            throw new Error('Fecha de inicio no proporcionada');
        }

        const [startTime, endTime] = hour.split(' - ');
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
            throw new Error('Fecha de inicio es inválida');
        }

        const end = new Date(start);
        end.setHours(endHour, endMinute);

        if (isNaN(end.getTime())) {
            throw new Error('Fecha de fin calculada es inválida');
        }

        return end.toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
        console.error('Error en calculateEndDateFromHour:', error);
        throw error;
    }
};



const calculateEndDateFromDate = (hour, startDate) => {
    try {
        const [startTime, endTime] = hour.split(' - ');
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const end = new Date(startDate);
        end.setHours(endHour, endMinute);

        if (isNaN(end.getTime())) {
            throw new Error('Fecha de fin calculada es inválida');
        }

        return end.toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
        console.error('Error en calculateEndDateFromDate:', error);
        throw error;
    }
};



module.exports = {calculateEndDate, calculateEndDateFromHour, calculateEndDateFromDate}