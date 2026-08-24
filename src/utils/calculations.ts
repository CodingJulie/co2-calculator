import { Car, Zap, Utensils, ShoppingBag, Home, Coffee, Leaf } from 'lucide-react';
import { Entry, CategoryData, TrendData } from '../types';
import { categoryColors } from './emissionFactors';

export const getCategoryLabel = (t: (key: string) => string, category: string): string => {
    const map: Record<string, string> = {
        transport: t('category_transport'),
        energy: t('category_energy'),
        food: t('category_food'),
        shopping: t('category_shopping'),
        home: t('category_home'),
        lifestyle: t('category_lifestyle'),
    };
    return map[category] || category;
};

export const getCategoryIcon = (category: string) => {
    const icons: Record<string, typeof Car> = {
        transport: Car,
        energy: Zap,
        food: Utensils,
        shopping: ShoppingBag,
        home: Home,
        lifestyle: Coffee,
    };
    return icons[category] || Leaf;
};

export const filterEntriesByDate = (
    entries: Entry[],
    dateRange: 'week' | 'month' | 'all'
): Entry[] => {
    if (dateRange === 'all') return entries;
    const now = new Date();
    const days = dateRange === 'week' ? 7 : 30;
    const cutoff = new Date(now.setDate(now.getDate() - days));
    return entries.filter(entry => new Date(entry.date) >= cutoff);
};

export const calculateCategoryData = (
    entries: Entry[],
    t: (key: string) => string
): CategoryData[] => {
    const grouped = entries.reduce((acc: Record<string, number>, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + entry.co2e;
        return acc;
    }, {});

    return Object.entries(grouped)
        .map(([name, value]) => ({
            name: getCategoryLabel(t, name),
            value: Number(value),
            color: categoryColors[name as keyof typeof categoryColors] || '#10b981',
        }))
        .sort((a, b) => b.value - a.value);
};

export const calculateTrendData = (entries: Entry[]): TrendData[] => {
    const grouped = entries.reduce((acc: Record<string, number>, entry) => {
        acc[entry.date] = (acc[entry.date] || 0) + entry.co2e;
        return acc;
    }, {});

    return Object.entries(grouped)
        .map(([date, value]) => ({
            date: new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
            fullDate: date,
            co2e: Number(value),
        }))
        .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
};

export const getTips = (
    categoryData: CategoryData[],
    totalCO2: number,
    entriesCount: number,
    t: (key: string) => string
): string[] => {
    const tips: string[] = [];
    if (categoryData.length === 0) return [t('start_adding_tip')];

    const transport = categoryData.find(c => c.name === t('category_transport'));
    if (transport && transport.value > totalCO2 * 0.4) tips.push(t('tip_transport'));

    const food = categoryData.find(c => c.name === t('category_food'));
    if (food && food.value > totalCO2 * 0.3) tips.push(t('tip_food'));

    const energy = categoryData.find(c => c.name === t('category_energy'));
    if (energy && energy.value > totalCO2 * 0.25) tips.push(t('tip_energy'));

    const shopping = categoryData.find(c => c.name === t('category_shopping'));
    if (shopping && shopping.value > totalCO2 * 0.2) tips.push(t('tip_shopping'));

    const home = categoryData.find(c => c.name === t('category_home'));
    if (home && home.value > totalCO2 * 0.15) tips.push(t('tip_home'));

    const lifestyle = categoryData.find(c => c.name === t('category_lifestyle'));
    if (lifestyle && lifestyle.value > totalCO2 * 0.1) tips.push(t('tip_lifestyle'));

    if (tips.length === 0 && entriesCount > 0) tips.push(t('tip_good_job'));

    return tips;
};

export const getActivityOptions = (
    category: string,
    t: (key: string, options?: any) => string
): Array<{ value: string; name: string; unit: string }> => {
    const factors: Record<string, string[]> = {
        transport: ['car_petrol', 'car_diesel', 'car_hybrid', 'car_electric', 'plane_short', 'plane_long', 'train', 'bus', 'metro', 'bicycle', 'walking'],
        energy: ['electricity', 'gas', 'heating_oil', 'coal', 'solar'],
        food: ['beef', 'lamb', 'pork', 'chicken', 'fish', 'cheese', 'eggs', 'milk', 'vegetables', 'fruits', 'grains', 'coffee'],
        shopping: ['clothes', 'shoes', 'electronics_small', 'electronics_large', 'furniture', 'plastic', 'paper'],
        home: ['water', 'waste', 'recycling', 'heating', 'air_conditioning'],
        lifestyle: ['streaming', 'online_shopping', 'restaurant', 'hotel'],
    };

    const activities = factors[category] || [];
    return activities.map(act => ({
        value: act,
        name: t(`emission_${category}_${act}_name`),
        unit: t(`emission_${category}_${act}_unit`),
    }));
};

export const getActivityName = (t: (key: string) => string, category: string, activity: string): string => {
    return t(`emission_${category}_${activity}_name`);
};

export const getActivityUnit = (t: (key: string) => string, category: string, activity: string): string => {
    return t(`emission_${category}_${activity}_unit`);
};