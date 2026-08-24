import { EmissionFactors } from '../types';

export const emissionFactors: EmissionFactors = {
    transport: {
        car_petrol: { factor: 0.192 },
        car_diesel: { factor: 0.168 },
        car_hybrid: { factor: 0.11 },
        car_electric: { factor: 0.05 },
        plane_short: { factor: 0.255 },
        plane_long: { factor: 0.185 },
        train: { factor: 0.041 },
        bus: { factor: 0.089 },
        metro: { factor: 0.033 },
        bicycle: { factor: 0 },
        walking: { factor: 0 },
    },
    energy: {
        electricity: { factor: 0.475 },
        gas: { factor: 0.202 },
        heating_oil: { factor: 0.267 },
        coal: { factor: 2.42 },
        solar: { factor: 0.05 },
    },
    food: {
        beef: { factor: 99.5 },
        lamb: { factor: 39.2 },
        pork: { factor: 12.1 },
        chicken: { factor: 14.0 },
        fish: { factor: 8.5 },
        cheese: { factor: 23.9 },
        eggs: { factor: 0.8 },
        milk: { factor: 3.15 },
        vegetables: { factor: 2.5 },
        fruits: { factor: 1.8 },
        grains: { factor: 2.0 },
        coffee: { factor: 15.3 },
    },
    shopping: {
        clothes: { factor: 15 },
        shoes: { factor: 30 },
        electronics_small: { factor: 80 },
        electronics_large: { factor: 300 },
        furniture: { factor: 150 },
        plastic: { factor: 3.5 },
        paper: { factor: 1.8 },
    },
    home: {
        water: { factor: 0.15 },
        waste: { factor: 0.58 },
        recycling: { factor: -0.3 },
        heating: { factor: 0.275 },
        air_conditioning: { factor: 0.42 },
    },
    lifestyle: {
        streaming: { factor: 0.05 },
        online_shopping: { factor: 2.5 },
        restaurant: { factor: 3.2 },
        hotel: { factor: 31.5 },
    },
};

export const categoryColors = {
    transport: '#10b981',
    energy: '#34d399',
    food: '#6ee7b7',
    shopping: '#a1f2c5',
    home: '#059669',
    lifestyle: '#047857',
};

export const CHART_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a1f2c5', '#059669', '#047857'];

export const getEmissionFactor = (category: string, activity: string): number => {
    return emissionFactors[category]?.[activity]?.factor ?? 0;
};

export const calculateCO2 = (category: string, activity: string, value: number): number => {
    const factor = getEmissionFactor(category, activity);
    return Number((value * factor).toFixed(2));
};