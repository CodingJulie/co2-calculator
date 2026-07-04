import type { ComponentType } from 'react';

export interface EmissionFactor {
    factor: number;
}

export interface EmissionFactors {
    [category: string]: {
        [activity: string]: EmissionFactor;
    };
}

export interface Entry {
    id: string;
    user_id: string;
    category: string;
    activity: string;
    value: number;
    co2e: number;
    date: string;
    created_at: string;
}

export interface Category {
    value: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
    color: string;
}

export interface CategoryData {
    name: string;
    value: number;
    color: string;
}

export interface TrendData {
    date: string;
    fullDate: string;
    co2e: number;
}

export interface ActivityOption {
    value: string;
    name: string;
    unit: string;
}

export interface CO2CalculatorProps {
    supabase: any;
    t: (key: string, options?: any) => string;
    onEntryAdded?: (entry: Entry) => void;
    onEntryDeleted?: (id: string) => void;
    onError?: (error: Error) => void;
    className?: string;
}

export interface CO2CalculatorState {
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