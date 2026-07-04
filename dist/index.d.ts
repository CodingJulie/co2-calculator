import * as react from 'react';
import react__default, { ComponentType } from 'react';
import * as lucide_react from 'lucide-react';

interface EmissionFactor {
    factor: number;
}
interface EmissionFactors {
    [category: string]: {
        [activity: string]: EmissionFactor;
    };
}
interface Entry {
    id: string;
    user_id: string;
    category: string;
    activity: string;
    value: number;
    co2e: number;
    date: string;
    created_at: string;
}
interface Category {
    value: string;
    label: string;
    icon: ComponentType<{
        className?: string;
    }>;
    color: string;
}
interface CategoryData {
    name: string;
    value: number;
    color: string;
}
interface TrendData {
    date: string;
    fullDate: string;
    co2e: number;
}
interface ActivityOption {
    value: string;
    name: string;
    unit: string;
}
interface CO2CalculatorProps {
    supabase: any;
    t: (key: string, options?: any) => string;
    onEntryAdded?: (entry: Entry) => void;
    onEntryDeleted?: (id: string) => void;
    onError?: (error: Error) => void;
    className?: string;
}
interface CO2CalculatorState {
    entries: Entry[];
    currentEntry: {
        category: string;
        activity: string;
        value: number;
    };
    loading: boolean;
    dateRange: 'week' | 'month' | 'all';
    showPollution: boolean;
    lastCO2Amount: number;
}

declare const CO2Calculator: react__default.FC<CO2CalculatorProps>;

interface UseCO2CalculatorOptions {
    supabase: any;
    t: (key: string, options?: any) => string;
    onError?: (error: Error) => void;
}
declare function useCO2Calculator({ supabase, t, onError }: UseCO2CalculatorOptions): {
    entries: Entry[];
    currentEntry: {
        category: string;
        activity: string;
        value: number;
    };
    loading: boolean;
    dateRange: "week" | "month" | "all";
    showPollution: boolean;
    lastCO2Amount: number;
    filteredEntries: Entry[];
    totalCO2: number;
    averageCO2: number;
    categoryData: CategoryData[];
    trendData: TrendData[];
    sortedEntries: Entry[];
    tips: string[];
    activityOptions: {
        value: string;
        name: string;
        unit: string;
    }[];
    previewCO2: string;
    setDateRange: react.Dispatch<react.SetStateAction<"week" | "month" | "all">>;
    setShowPollution: react.Dispatch<react.SetStateAction<boolean>>;
    setLastCO2Amount: react.Dispatch<react.SetStateAction<number>>;
    addEntry: () => Promise<void>;
    deleteEntry: (id: string) => Promise<void>;
    handleCategoryChange: (category: string) => void;
    handleActivityChange: (activity: string) => void;
    handleValueChange: (value: number) => void;
    refreshEntries: () => Promise<void>;
};

declare const emissionFactors: EmissionFactors;
declare const categoryColors: {
    transport: string;
    energy: string;
    food: string;
    shopping: string;
    home: string;
    lifestyle: string;
};
declare const CHART_COLORS: string[];
declare const getEmissionFactor: (category: string, activity: string) => number;
declare const calculateCO2: (category: string, activity: string, value: number) => number;

declare const getCategoryLabel: (t: (key: string) => string, category: string) => string;
declare const getCategoryIcon: (category: string) => lucide_react.LucideIcon;
declare const filterEntriesByDate: (entries: Entry[], dateRange: "week" | "month" | "all") => Entry[];
declare const calculateCategoryData: (entries: Entry[], t: (key: string) => string) => CategoryData[];
declare const calculateTrendData: (entries: Entry[]) => TrendData[];
declare const getTips: (categoryData: CategoryData[], totalCO2: number, entriesCount: number, t: (key: string) => string) => string[];
declare const getActivityOptions: (category: string, t: (key: string, options?: any) => string) => Array<{
    value: string;
    name: string;
    unit: string;
}>;
declare const getActivityName: (t: (key: string) => string, category: string, activity: string) => string;
declare const getActivityUnit: (t: (key: string) => string, category: string, activity: string) => string;

export { type ActivityOption, CHART_COLORS, CO2Calculator, type CO2CalculatorProps, type CO2CalculatorState, type Category, type CategoryData, type EmissionFactor, type EmissionFactors, type Entry, type TrendData, calculateCO2, calculateCategoryData, calculateTrendData, categoryColors, CO2Calculator as default, emissionFactors, filterEntriesByDate, getActivityName, getActivityOptions, getActivityUnit, getCategoryIcon, getCategoryLabel, getEmissionFactor, getTips, useCO2Calculator };
