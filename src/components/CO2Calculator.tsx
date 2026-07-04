'use client';

import React from 'react';
import {
    Leaf,
    Plus,
    Trash2,
    Calendar,
    TrendingUp,
    Coffee,
    Car,
    Home,
    ShoppingBag,
    Utensils,
    Zap,
    Loader2,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';

import { CO2CalculatorProps, Category } from '../types';
import { useCO2Calculator } from '../hooks/useCO2Calculator';
import { getActivityName, getActivityUnit } from '../utils/calculations';
import { categoryColors, CHART_COLORS } from '../utils/emissionFactors';

// Эти компоненты должны быть переданы извне (shadcn/ui)
// или экспортируются отдельно из пакета
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`rounded-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 ${className || ''}`}>
        {children}
    </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`p-6 pb-3 ${className || ''}`}>{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <h3 className={`text-xl font-semibold ${className || ''}`}>{children}</h3>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`p-6 pt-0 ${className || ''}`}>{children}</div>
);

const Button: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'default' | 'ghost' | 'destructive' | 'outline';
    size?: 'sm' | 'default' | 'icon';
    disabled?: boolean;
}> = ({ children, onClick, className, variant = 'default', size = 'default', disabled }) => {
    const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
        default: 'bg-emerald-600 text-white hover:bg-emerald-700',
        ghost: 'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800',
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        default: 'px-4 py-2',
        icon: 'w-9 h-9',
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${sizes[size]} ${className || ''}`}
        >
            {children}
        </button>
    );
};

const Input: React.FC<{
    type?: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}> = ({ type = 'number', value, onChange, className }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className || ''}`}
    />
);

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <label className={`block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300 ${className || ''}`}>
        {children}
    </label>
);

const SELECT_CONTENT_MARKER = '__SelectContent__';

function extractSelectItems(children: React.ReactNode): Array<{ value: string; label: React.ReactNode }> {
    const items: Array<{ value: string; label: React.ReactNode }> = [];

    React.Children.forEach(children, (child) => {
        if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return;

        const isContent =
            (child.type as { displayName?: string }).displayName === SELECT_CONTENT_MARKER;

        if (isContent) {
            React.Children.forEach(child.props.children, (item) => {
                if (React.isValidElement<{ value?: string; children?: React.ReactNode }>(item) && item.props.value) {
                    items.push({ value: item.props.value, label: item.props.children });
                }
            });
        }
    });

    return items;
}

const Select: React.FC<{
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
}> = ({ value, onValueChange, children }) => {
    const [open, setOpen] = React.useState(false);
    const items = extractSelectItems(children);
    const selected = items.find((item) => item.value === value);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full px-4 py-2 text-left rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-700"
            >
                <span>{selected?.label || 'Select...'}</span>
                <span className="text-zinc-400">▼</span>
            </button>
            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden">
                    {items.map((item) => (
                        <div
                            key={item.value}
                            className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                            onClick={() => {
                                onValueChange(item.value);
                                setOpen(false);
                            }}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`flex items-center justify-between ${className || ''}`}>{children}</div>
);

const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
    <span className="text-zinc-700 dark:text-zinc-300">{placeholder || 'Select...'}</span>
);

const SelectContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden ${className || ''}`}>
        {children}
    </div>
);
SelectContent.displayName = SELECT_CONTENT_MARKER;

const SelectItem: React.FC<{ children: React.ReactNode; value: string; className?: string }> = ({ children, className }) => (
    <div className={`px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer ${className || ''}`}>
        {children}
    </div>
);

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 z-50 relative">
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-emerald-600 font-bold text-base">
                    {payload[0].value.toFixed(1)} кг CO₂e
                </p>
            </div>
        );
    }
    return null;
};

interface PollutionEffectProps {
    co2Amount: number;
    onComplete: () => void;
}

const PollutionEffect: React.FC<PollutionEffectProps> = ({ co2Amount, onComplete }) => {
    const [show, setShow] = React.useState(true);
    const intensity = Math.min(1, co2Amount / 300);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            onComplete();
        }, 2500);
        return () => clearTimeout(timer);
    }, [co2Amount, onComplete]);

    if (!show) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10002] pointer-events-none"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 + intensity * 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black"
            />
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2, opacity: 0.6 }}
                exit={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
                style={{
                    background: `radial-gradient(circle, rgba(80,80,80,0.8) 0%, rgba(60,60,60,0.4) 50%, transparent 100%)`
                }}
            />
            {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800), y: typeof window !== 'undefined' ? window.innerHeight : 600, scale: 0.3 + Math.random()}}
                    animate={{ y: -100, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800), rotate: 360 }}
                    transition={{ duration: 1 + Math.random() * 2, delay: Math.random() * 0.3, ease: "linear" }}
                    className="absolute"
                >
                    <span className="text-gray-400 text-sm opacity-60">💨</span>
                </motion.div>
            ))}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center bg-black/50 backdrop-blur-sm px-6 py-3 rounded-2xl"
            >
                <p className="text-red-500 font-bold text-xl">+{co2Amount} кг CO₂</p>
                <p className="text-white/80 text-sm mt-1">Добавлено в атмосферу</p>
            </motion.div>
        </motion.div>
    );
};

const categories: Category[] = [
    { value: 'transport', label: 'category_transport', icon: Car, color: categoryColors.transport },
    { value: 'energy', label: 'category_energy', icon: Zap, color: categoryColors.energy },
    { value: 'food', label: 'category_food', icon: Utensils, color: categoryColors.food },
    { value: 'shopping', label: 'category_shopping', icon: ShoppingBag, color: categoryColors.shopping },
    { value: 'home', label: 'category_home', icon: Home, color: categoryColors.home },
    { value: 'lifestyle', label: 'category_lifestyle', icon: Coffee, color: categoryColors.lifestyle },
];

export const CO2Calculator: React.FC<CO2CalculatorProps> = ({
                                                                supabase,
                                                                t,
                                                                onEntryAdded,
                                                                onEntryDeleted,
                                                                onError,
                                                                className = '',
                                                            }) => {
    const {
        loading,
        currentEntry,
        dateRange,
        showPollution,
        lastCO2Amount,
        totalCO2,
        averageCO2,
        categoryData,
        trendData,
        sortedEntries,
        filteredEntries,
        tips,
        activityOptions,
        previewCO2,
        setDateRange,
        setShowPollution,
        setLastCO2Amount,
        addEntry,
        deleteEntry,
        handleCategoryChange,
        handleActivityChange,
        handleValueChange,
    } = useCO2Calculator({ supabase, t, onError });

    const categoriesWithLabels = categories.map(cat => ({
        ...cat,
        label: t(cat.label),
    }));

    return (
        <>
            <Card className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${className}`}>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl text-zinc-900 dark:text-white">
                        <Leaf className="text-emerald-600" />
                        {t('carbon_footprint_calculator')}
                    </CardTitle>
                </CardHeader>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                ) : (
                    <CardContent className="pt-0 space-y-8">
                        {/* Форма добавления */}
                        <div className="space-y-5 p-2">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('category')}</Label>
                                <Select
                                    value={currentEntry.category}
                                    onValueChange={handleCategoryChange}
                                >
                                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                                        {categoriesWithLabels.map(cat => (
                                            <SelectItem
                                                key={cat.value}
                                                value={cat.value}
                                                className="hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                            >
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('activity')}</Label>
                                <Select
                                    value={currentEntry.activity}
                                    onValueChange={handleActivityChange}
                                >
                                    <SelectTrigger className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                                        {activityOptions.map(opt => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                                className="hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                            >
                                                {opt.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    {t('value')} ({activityOptions.find(a => a.value === currentEntry.activity)?.unit || t('unit')})
                                </Label>
                                <Input
                                    type="number"
                                    value={currentEntry.value}
                                    onChange={(e) => handleValueChange(Number(e.target.value))}
                                    className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-10"
                                />
                            </div>

                            <div className="pt-4 space-y-2">
                                <div className="text-sm text-muted-foreground bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg text-center">
                                    {t('forecast', { co2: previewCO2 })}
                                </div>
                                <Button
                                    onClick={async () => {
                                        const entry = await addEntry();
                                        if (entry) onEntryAdded?.(entry);
                                    }}
                                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> {t('add')}
                                </Button>
                            </div>
                        </div>

                        {/* Date range filters */}
                        <div className="flex gap-2 justify-end">
                            {(['week', 'month', 'all'] as const).map((range) => (
                                <button
                                    key={range}
                                    type="button"
                                    onClick={() => setDateRange(range)}
                                    className={`px-3 py-1 text-sm rounded-lg transition-all ${
                                        dateRange === range
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-muted hover:bg-muted/80'
                                    }`}
                                >
                                    {range === 'all' ? t('all_time') : t(range)}
                                </button>
                            ))}
                        </div>

                        {/* Category chart */}
                        <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-lg">{t('emissions_by_category')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {categoryData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={320}>
                                        <BarChart
                                            data={categoryData}
                                            layout="vertical"
                                            margin={{ left: 80, right: 30, top: 20, bottom: 20 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} stroke="#888888" />
                                            <XAxis
                                                type="number"
                                                fontSize={12}
                                                tickFormatter={(value) => `${value} ${t('kg')}`}
                                                stroke="#888888"
                                                tickLine={true}
                                                axisLine={true}
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                fontSize={12}
                                                tickLine={true}
                                                axisLine={true}
                                                width={100}
                                                stroke="#888888"
                                            />
                                            <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 40 }} />
                                            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[320px] flex items-center justify-center text-muted-foreground">
                                        {t('no_data')}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Trend and Structure */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {trendData.length > 0 && (
                                <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5" />
                                            {t('emissions_trend_chart')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} stroke="#888888" />
                                                <XAxis
                                                    dataKey="date"
                                                    fontSize={11}
                                                    tickLine={true}
                                                    axisLine={true}
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={60}
                                                    interval={0}
                                                    stroke="#888888"
                                                />
                                                <YAxis
                                                    fontSize={12}
                                                    tickLine={true}
                                                    axisLine={true}
                                                    tickFormatter={(value) => `${value} ${t('kg')}`}
                                                    stroke="#888888"
                                                />
                                                <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 40 }} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="co2e"
                                                    stroke="#10b981"
                                                    strokeWidth={3}
                                                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                                    activeDot={{ r: 6 }}
                                                    name="CO₂e"
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            )}

                            <Card className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                <CardHeader>
                                    <CardTitle className="text-lg">{t('footprint_structure')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {categoryData.length > 0 ? (
                                        <div className="flex flex-col">
                                            <ResponsiveContainer width="100%" height={260}>
                                                <PieChart>
                                                    <Pie
                                                        data={categoryData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={50}
                                                        outerRadius={80}
                                                        dataKey="value"
                                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                                        labelLine={false}
                                                    >
                                                        {categoryData.map((_, index) => (
                                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 40 }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="flex flex-wrap justify-center gap-3 mt-4">
                                                {categoryData.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                                                        />
                                                        <span className="text-xs">
                              {item.name} ({Math.round(item.value)} {t('kg')})
                            </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-[260px] flex items-center justify-center text-muted-foreground">
                                            {t('no_data')}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tips */}
                        {tips.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl">
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    {t('tips_to_reduce')}
                                </h4>
                                <ul className="space-y-1 text-sm">
                                    {tips.map((tip, i) => (
                                        <li key={i}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Total */}
                        <div className="bg-emerald-50 dark:bg-emerald-950/50 p-8 rounded-3xl text-center border border-emerald-100 dark:border-emerald-900">
                            <p className="text-zinc-600 dark:text-zinc-400">
                                {t('total_footprint_period', {
                                    period: dateRange === 'week'
                                        ? t('week').toLowerCase()
                                        : dateRange === 'month'
                                            ? t('month').toLowerCase()
                                            : t('all_time').toLowerCase()
                                })}
                            </p>
                            <p className="text-6xl font-bold text-emerald-600 mt-3">
                                {totalCO2.toFixed(1)} <span className="text-3xl">{t('kg_co2e')}</span>
                            </p>
                            {filteredEntries.length > 0 && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    {t('average_per_entry', { avg: averageCO2.toFixed(1), count: filteredEntries.length })}
                                </p>
                            )}
                        </div>

                        {/* Entries list */}
                        {sortedEntries.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-4 text-zinc-900 dark:text-white">
                                    {t('your_records', { count: sortedEntries.length })}
                                </h3>
                                <div className="space-y-3 max-h-96 overflow-auto">
                                    {sortedEntries.map(entry => {
                                        const category = categoriesWithLabels.find(c => c.value === entry.category);
                                        const activityName = getActivityName(t, entry.category, entry.activity);
                                        const activityUnit = getActivityUnit(t, entry.category, entry.activity);
                                        return (
                                            <div
                                                key={entry.id}
                                                className="flex justify-between items-center bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
                                            >
                                                <div>
                                                    <div className="font-medium capitalize">
                                                        {category?.label} — {activityName || entry.activity}
                                                    </div>
                                                    <div className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(entry.date).toLocaleDateString('ru-RU')}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right font-mono">
                                                        {entry.value} {activityUnit || t('unit')} →
                                                        <span className="text-emerald-600 font-semibold ml-1">
                              {entry.co2e.toFixed(1)} {t('kg')}
                            </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            deleteEntry(entry.id);
                                                            onEntryDeleted?.(entry.id);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>

            {showPollution && (
                <PollutionEffect
                    co2Amount={lastCO2Amount}
                    onComplete={() => {
                        setShowPollution(false);
                        setLastCO2Amount(0);
                    }}
                />
            )}
        </>
    );
};

export default CO2Calculator;