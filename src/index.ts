// Components
export { CO2Calculator, default } from './components/CO2Calculator';

// Hooks
export { useCO2Calculator } from './hooks/useCO2Calculator';

// Utils
export {
    emissionFactors,
    categoryColors,
    CHART_COLORS,
    getEmissionFactor,
    calculateCO2,
} from './utils/emissionFactors';

export {
    getCategoryLabel,
    getCategoryIcon,
    filterEntriesByDate,
    calculateCategoryData,
    calculateTrendData,
    getTips,
    getActivityOptions,
    getActivityName,
    getActivityUnit,
} from './utils/calculations';

// Types
export type {
    Entry,
    Category,
    CategoryData,
    TrendData,
    ActivityOption,
    EmissionFactor,
    EmissionFactors,
    CO2CalculatorProps,
    CO2CalculatorState,
} from './types';