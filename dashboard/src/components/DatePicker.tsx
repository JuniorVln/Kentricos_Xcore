import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval, isWithinInterval, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

interface DatePickerProps {
    dateRange: DateRange;
    onChange: (range: DateRange) => void;
    onClose: () => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ dateRange, onChange, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const onDateClick = (day: Date) => {
        const normalizedDay = startOfDay(day);

        if (!dateRange.from || (dateRange.from && dateRange.to)) {
            onChange({ from: normalizedDay, to: undefined });
        } else if (normalizedDay < dateRange.from) {
            onChange({ from: normalizedDay, to: dateRange.from });
        } else {
            onChange({ from: dateRange.from, to: normalizedDay });
        }
    };

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
                <button onClick={prevMonth} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <span className="text-sm font-bold text-brand-dark capitalize">
                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                </span>
                <button onClick={nextMonth} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <ChevronRight size={20} className="text-gray-600" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const dateFormat = "EEEEEE";
        const days = [];
        let startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-center text-[10px] font-bold text-gray-400 uppercase">
                    {format(addDays(startDate, i), dateFormat, { locale: ptBR })}
                </div>
            );
        }

        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows: React.ReactNode[] = [];
        let days: React.ReactNode[] = [];

        const allDaysInRange = eachDayOfInterval({
            start: startDate,
            end: endDate
        });

        allDaysInRange.forEach((d, i) => {
            const normalizedDay = startOfDay(d);
            const isInRange = dateRange.from && dateRange.to && isWithinInterval(normalizedDay, { start: dateRange.from, end: dateRange.to });
            const isSelected = (dateRange.from && isSameDay(normalizedDay, dateRange.from)) || (dateRange.to && isSameDay(normalizedDay, dateRange.to));
            const isCurrentMonth = isSameMonth(normalizedDay, monthStart);

            days.push(
                <div
                    key={normalizedDay.toString()}
                    className={`
                        relative h-10 flex items-center justify-center cursor-pointer text-sm transition-all rounded-lg
                        ${!isCurrentMonth ? "text-gray-300 pointer-events-none opacity-20" : "text-gray-600 hover:bg-brand-cyan/20"}
                        ${isSelected ? "bg-brand-cyan text-white font-bold shadow-lg z-10" : ""}
                        ${isInRange && !isSelected ? "bg-brand-cyan/10" : ""}
                    `}
                    onClick={() => onDateClick(normalizedDay)}
                >
                    <span>{format(normalizedDay, "d")}</span>
                </div>
            );

            if ((i + 1) % 7 === 0) {
                rows.push(
                    <div className="grid grid-cols-7" key={normalizedDay.toString()}>
                        {days}
                    </div>
                );
                days = [];
            }
        });

        return <div className="px-2 pb-2">{rows}</div>;
    };

    return (
        <div className="absolute top-12 right-0 z-[100] w-72 bg-white/90 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-4 py-2 bg-brand-dark/5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Selecionar Período</span>
                <button onClick={onClose} className="p-1 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-red-500">
                    <X size={16} />
                </button>
            </div>
            {renderHeader()}
            <div className="p-2">
                {renderDays()}
                {renderCells()}
            </div>
            {(dateRange.from || dateRange.to) && (
                <div className="px-4 py-3 border-t border-white/20 bg-brand-dark/5 flex justify-between items-center">
                    <div className="text-[10px] text-gray-500">
                        {dateRange.from && format(dateRange.from, 'dd/MM/yy')}
                        {dateRange.to && ` - ${format(dateRange.to, 'dd/MM/yy')}`}
                    </div>
                    <button
                        onClick={() => onChange({ from: undefined, to: undefined })}
                        className="text-[10px] font-bold text-brand-blue hover:underline"
                    >
                        Limpar
                    </button>
                </div>
            )}
        </div>
    );
};
