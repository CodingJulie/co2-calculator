import { useState, useEffect, useMemo, useCallback } from 'react';
import { Entry } from '../types';
import {
    filterEntriesByDate,
    calculateCategoryData,
    calculateTrendData,
    getTips,
    getActivityOptions,
} from '../utils/calculations';
import { getEmissionFactor, calculateCO2 } from '../utils/emissionFactors';

interface UseCO2CalculatorOptions {
    supabase: any;
    t: (key: string, options?: any) => string;
    onError?: (error: Error) => void;
}

export function useCO2Calculator({ supabase, t, onError }: UseCO2CalculatorOptions) {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [currentEntry, setCurrentEntry] = useState({
        category: 'transport',
        activity: 'car_petrol',
        value: 10,
    });
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('month');
    const [showPollution, setShowPollution] = useState(false);
    const [lastCO2Amount, setLastCO2Amount] = useState(0);

    const fetchEntries = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('footprint_entries')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (error) {
                onError?.(error as Error);
                return;
            }
            if (data) setEntries(data);
        } catch (error) {
            onError?.(error as Error);
        } finally {
            setLoading(false);
        }
    }, [supabase, onError]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const addEntry = useCallback(async () => {
        try {
            const co2e = calculateCO2(currentEntry.category, currentEntry.activity, currentEntry.value);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const newEntry = {
                user_id: user.id,
                category: currentEntry.category,
                activity: currentEntry.activity,
                value: currentEntry.value,
                co2e,
                date: new Date().toISOString().split('T')[0],
            };

            const { data, error } = await supabase
                .from('footprint_entries')
                .insert(newEntry)
                .select()
                .single();
            if (error) {
                onError?.(error as Error);
                return;
            }

            await fetchEntries();
            setCurrentEntry(prev => ({ ...prev, value: 10 }));
            setLastCO2Amount(co2e);
            setShowPollution(true);
            return data as Entry;
        } catch (error) {
            onError?.(error as Error);
        }
    }, [supabase, currentEntry, fetchEntries, onError]);

    const deleteEntry = useCallback(async (id: string) => {
        try {
            const { error } = await supabase.from('footprint_entries').delete().eq('id', id);
            if (error) {
                onError?.(error as Error);
                return;
            }
            await fetchEntries();
        } catch (error) {
            onError?.(error as Error);
        }
    }, [supabase, fetchEntries, onError]);

    const filteredEntries = useMemo(() => {
        return filterEntriesByDate(entries, dateRange);
    }, [entries, dateRange]);

    const totalCO2 = useMemo(() => {
        return filteredEntries.reduce((sum, entry) => sum + entry.co2e, 0);
    }, [filteredEntries]);

    const averageCO2 = useMemo(() => {
        return filteredEntries.length > 0 ? totalCO2 / filteredEntries.length : 0;
    }, [filteredEntries, totalCO2]);

    const categoryData = useMemo(() => {
        return calculateCategoryData(filteredEntries, t);
    }, [filteredEntries, t]);

    const trendData = useMemo(() => {
        return calculateTrendData(filteredEntries);
    }, [filteredEntries]);

    const sortedEntries = useMemo(() => {
        return [...filteredEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [filteredEntries]);

    const tips = useMemo(() => {
        return getTips(categoryData, totalCO2, filteredEntries.length, t);
    }, [categoryData, totalCO2, filteredEntries.length, t]);

    const activityOptions = useMemo(() => {
        return getActivityOptions(currentEntry.category, t);
    }, [currentEntry.category, t]);

    const previewCO2 = useMemo(() => {
        const factor = getEmissionFactor(currentEntry.category, currentEntry.activity);
        return (currentEntry.value * factor).toFixed(2);
    }, [currentEntry]);

    const handleCategoryChange = useCallback((category: string) => {
        const factors: Record<string, string[]> = {
            transport: ['car_petrol', 'car_diesel', 'car_hybrid', 'car_electric', 'plane_short', 'plane_long', 'train', 'bus', 'metro', 'bicycle', 'walking'],
            energy: ['electricity', 'gas', 'heating_oil', 'coal', 'solar'],
            food: ['beef', 'lamb', 'pork', 'chicken', 'fish', 'cheese', 'eggs', 'milk', 'vegetables', 'fruits', 'grains', 'coffee'],
            shopping: ['clothes', 'shoes', 'electronics_small', 'electronics_large', 'furniture', 'plastic', 'paper'],
            home: ['water', 'waste', 'recycling', 'heating', 'air_conditioning'],
            lifestyle: ['streaming', 'online_shopping', 'restaurant', 'hotel'],
        };
        const activities = factors[category] || ['car_petrol'];
        setCurrentEntry(prev => ({
            ...prev,
            category,
            activity: activities[0],
        }));
    }, []);

    const handleActivityChange = useCallback((activity: string) => {
        setCurrentEntry(prev => ({ ...prev, activity }));
    }, []);

    const handleValueChange = useCallback((value: number) => {
        setCurrentEntry(prev => ({ ...prev, value }));
    }, []);

    return {
        // State
        entries,
        currentEntry,
        loading,
        dateRange,
        showPollution,
        lastCO2Amount,
        filteredEntries,
        totalCO2,
        averageCO2,
        categoryData,
        trendData,
        sortedEntries,
        tips,
        activityOptions,
        previewCO2,

        // Actions
        setDateRange,
        setShowPollution,
        setLastCO2Amount,
        addEntry,
        deleteEntry,
        handleCategoryChange,
        handleActivityChange,
        handleValueChange,
        refreshEntries: fetchEntries,
    };
}