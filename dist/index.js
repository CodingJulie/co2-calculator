"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CHART_COLORS: () => CHART_COLORS,
  CO2Calculator: () => CO2Calculator,
  calculateCO2: () => calculateCO2,
  calculateCategoryData: () => calculateCategoryData,
  calculateTrendData: () => calculateTrendData,
  categoryColors: () => categoryColors,
  default: () => CO2Calculator_default,
  emissionFactors: () => emissionFactors,
  filterEntriesByDate: () => filterEntriesByDate,
  getActivityName: () => getActivityName,
  getActivityOptions: () => getActivityOptions,
  getActivityUnit: () => getActivityUnit,
  getCategoryIcon: () => getCategoryIcon,
  getCategoryLabel: () => getCategoryLabel,
  getEmissionFactor: () => getEmissionFactor,
  getTips: () => getTips,
  useCO2Calculator: () => useCO2Calculator
});
module.exports = __toCommonJS(index_exports);

// src/components/CO2Calculator.tsx
var import_react2 = __toESM(require("react"));
var import_lucide_react2 = require("lucide-react");
var import_recharts = require("recharts");
var import_framer_motion = require("framer-motion");

// src/hooks/useCO2Calculator.ts
var import_react = require("react");

// src/utils/calculations.ts
var import_lucide_react = require("lucide-react");

// src/utils/emissionFactors.ts
var emissionFactors = {
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
    walking: { factor: 0 }
  },
  energy: {
    electricity: { factor: 0.475 },
    gas: { factor: 0.202 },
    heating_oil: { factor: 0.267 },
    coal: { factor: 2.42 },
    solar: { factor: 0.05 }
  },
  food: {
    beef: { factor: 99.5 },
    lamb: { factor: 39.2 },
    pork: { factor: 12.1 },
    chicken: { factor: 14 },
    fish: { factor: 8.5 },
    cheese: { factor: 23.9 },
    eggs: { factor: 0.8 },
    milk: { factor: 3.15 },
    vegetables: { factor: 2.5 },
    fruits: { factor: 1.8 },
    grains: { factor: 2 },
    coffee: { factor: 15.3 }
  },
  shopping: {
    clothes: { factor: 15 },
    shoes: { factor: 30 },
    electronics_small: { factor: 80 },
    electronics_large: { factor: 300 },
    furniture: { factor: 150 },
    plastic: { factor: 3.5 },
    paper: { factor: 1.8 }
  },
  home: {
    water: { factor: 0.15 },
    waste: { factor: 0.58 },
    recycling: { factor: -0.3 },
    heating: { factor: 0.275 },
    air_conditioning: { factor: 0.42 }
  },
  lifestyle: {
    streaming: { factor: 0.05 },
    online_shopping: { factor: 2.5 },
    restaurant: { factor: 3.2 },
    hotel: { factor: 31.5 }
  }
};
var categoryColors = {
  transport: "#10b981",
  energy: "#34d399",
  food: "#6ee7b7",
  shopping: "#a1f2c5",
  home: "#059669",
  lifestyle: "#047857"
};
var CHART_COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a1f2c5", "#059669", "#047857"];
var getEmissionFactor = (category, activity) => {
  return emissionFactors[category]?.[activity]?.factor ?? 0;
};
var calculateCO2 = (category, activity, value) => {
  const factor = getEmissionFactor(category, activity);
  return Number((value * factor).toFixed(2));
};

// src/utils/calculations.ts
var getCategoryLabel = (t, category) => {
  const map = {
    transport: t("category_transport"),
    energy: t("category_energy"),
    food: t("category_food"),
    shopping: t("category_shopping"),
    home: t("category_home"),
    lifestyle: t("category_lifestyle")
  };
  return map[category] || category;
};
var getCategoryIcon = (category) => {
  const icons = {
    transport: import_lucide_react.Car,
    energy: import_lucide_react.Zap,
    food: import_lucide_react.Utensils,
    shopping: import_lucide_react.ShoppingBag,
    home: import_lucide_react.Home,
    lifestyle: import_lucide_react.Coffee
  };
  return icons[category] || import_lucide_react.Leaf;
};
var filterEntriesByDate = (entries, dateRange) => {
  if (dateRange === "all") return entries;
  const now = /* @__PURE__ */ new Date();
  const days = dateRange === "week" ? 7 : 30;
  const cutoff = new Date(now.setDate(now.getDate() - days));
  return entries.filter((entry) => new Date(entry.date) >= cutoff);
};
var calculateCategoryData = (entries, t) => {
  const grouped = entries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.co2e;
    return acc;
  }, {});
  return Object.entries(grouped).map(([name, value]) => ({
    name: getCategoryLabel(t, name),
    value: Number(value),
    color: categoryColors[name] || "#10b981"
  })).sort((a, b) => b.value - a.value);
};
var calculateTrendData = (entries) => {
  const grouped = entries.reduce((acc, entry) => {
    acc[entry.date] = (acc[entry.date] || 0) + entry.co2e;
    return acc;
  }, {});
  return Object.entries(grouped).map(([date, value]) => ({
    date: new Date(date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
    fullDate: date,
    co2e: Number(value)
  })).sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
};
var getTips = (categoryData, totalCO2, entriesCount, t) => {
  const tips = [];
  if (categoryData.length === 0) return [t("start_adding_tip")];
  const transport = categoryData.find((c) => c.name === t("category_transport"));
  if (transport && transport.value > totalCO2 * 0.4) tips.push(t("tip_transport"));
  const food = categoryData.find((c) => c.name === t("category_food"));
  if (food && food.value > totalCO2 * 0.3) tips.push(t("tip_food"));
  const energy = categoryData.find((c) => c.name === t("category_energy"));
  if (energy && energy.value > totalCO2 * 0.25) tips.push(t("tip_energy"));
  const shopping = categoryData.find((c) => c.name === t("category_shopping"));
  if (shopping && shopping.value > totalCO2 * 0.2) tips.push(t("tip_shopping"));
  const home = categoryData.find((c) => c.name === t("category_home"));
  if (home && home.value > totalCO2 * 0.15) tips.push(t("tip_home"));
  const lifestyle = categoryData.find((c) => c.name === t("category_lifestyle"));
  if (lifestyle && lifestyle.value > totalCO2 * 0.1) tips.push(t("tip_lifestyle"));
  if (tips.length === 0 && entriesCount > 0) tips.push(t("tip_good_job"));
  return tips;
};
var getActivityOptions = (category, t) => {
  const factors = {
    transport: ["car_petrol", "car_diesel", "car_hybrid", "car_electric", "plane_short", "plane_long", "train", "bus", "metro", "bicycle", "walking"],
    energy: ["electricity", "gas", "heating_oil", "coal", "solar"],
    food: ["beef", "lamb", "pork", "chicken", "fish", "cheese", "eggs", "milk", "vegetables", "fruits", "grains", "coffee"],
    shopping: ["clothes", "shoes", "electronics_small", "electronics_large", "furniture", "plastic", "paper"],
    home: ["water", "waste", "recycling", "heating", "air_conditioning"],
    lifestyle: ["streaming", "online_shopping", "restaurant", "hotel"]
  };
  const activities = factors[category] || [];
  return activities.map((act) => ({
    value: act,
    name: t(`emission_${category}_${act}_name`),
    unit: t(`emission_${category}_${act}_unit`)
  }));
};
var getActivityName = (t, category, activity) => {
  return t(`emission_${category}_${activity}_name`);
};
var getActivityUnit = (t, category, activity) => {
  return t(`emission_${category}_${activity}_unit`);
};

// src/hooks/useCO2Calculator.ts
function useCO2Calculator({ supabase, t, onError }) {
  const [entries, setEntries] = (0, import_react.useState)([]);
  const [currentEntry, setCurrentEntry] = (0, import_react.useState)({
    category: "transport",
    activity: "car_petrol",
    value: 10
  });
  const [loading, setLoading] = (0, import_react.useState)(false);
  const [dateRange, setDateRange] = (0, import_react.useState)("month");
  const [showPollution, setShowPollution] = (0, import_react.useState)(false);
  const [lastCO2Amount, setLastCO2Amount] = (0, import_react.useState)(0);
  const fetchEntries = (0, import_react.useCallback)(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("footprint_entries").select("*").eq("user_id", user.id).order("date", { ascending: false });
      if (error) throw error;
      if (data) setEntries(data);
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [supabase, onError]);
  (0, import_react.useEffect)(() => {
    fetchEntries();
  }, [fetchEntries]);
  const addEntry = (0, import_react.useCallback)(async () => {
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
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
      const { error } = await supabase.from("footprint_entries").insert(newEntry);
      if (error) throw error;
      await fetchEntries();
      setCurrentEntry((prev) => ({ ...prev, value: 10 }));
      setLastCO2Amount(co2e);
      setShowPollution(true);
    } catch (error) {
      onError?.(error);
    }
  }, [supabase, currentEntry, fetchEntries, onError]);
  const deleteEntry = (0, import_react.useCallback)(async (id) => {
    try {
      const { error } = await supabase.from("footprint_entries").delete().eq("id", id);
      if (error) throw error;
      await fetchEntries();
    } catch (error) {
      onError?.(error);
    }
  }, [supabase, fetchEntries, onError]);
  const filteredEntries = (0, import_react.useMemo)(() => {
    return filterEntriesByDate(entries, dateRange);
  }, [entries, dateRange]);
  const totalCO2 = (0, import_react.useMemo)(() => {
    return filteredEntries.reduce((sum, entry) => sum + entry.co2e, 0);
  }, [filteredEntries]);
  const averageCO2 = (0, import_react.useMemo)(() => {
    return filteredEntries.length > 0 ? totalCO2 / filteredEntries.length : 0;
  }, [filteredEntries, totalCO2]);
  const categoryData = (0, import_react.useMemo)(() => {
    return calculateCategoryData(filteredEntries, t);
  }, [filteredEntries, t]);
  const trendData = (0, import_react.useMemo)(() => {
    return calculateTrendData(filteredEntries);
  }, [filteredEntries]);
  const sortedEntries = (0, import_react.useMemo)(() => {
    return [...filteredEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredEntries]);
  const tips = (0, import_react.useMemo)(() => {
    return getTips(categoryData, totalCO2, filteredEntries.length, t);
  }, [categoryData, totalCO2, filteredEntries.length, t]);
  const activityOptions = (0, import_react.useMemo)(() => {
    return getActivityOptions(currentEntry.category, t);
  }, [currentEntry.category, t]);
  const previewCO2 = (0, import_react.useMemo)(() => {
    const factor = getEmissionFactor(currentEntry.category, currentEntry.activity);
    return (currentEntry.value * factor).toFixed(2);
  }, [currentEntry]);
  const handleCategoryChange = (0, import_react.useCallback)((category) => {
    const factors = {
      transport: ["car_petrol", "car_diesel", "car_hybrid", "car_electric", "plane_short", "plane_long", "train", "bus", "metro", "bicycle", "walking"],
      energy: ["electricity", "gas", "heating_oil", "coal", "solar"],
      food: ["beef", "lamb", "pork", "chicken", "fish", "cheese", "eggs", "milk", "vegetables", "fruits", "grains", "coffee"],
      shopping: ["clothes", "shoes", "electronics_small", "electronics_large", "furniture", "plastic", "paper"],
      home: ["water", "waste", "recycling", "heating", "air_conditioning"],
      lifestyle: ["streaming", "online_shopping", "restaurant", "hotel"]
    };
    const activities = factors[category] || ["car_petrol"];
    setCurrentEntry((prev) => ({
      ...prev,
      category,
      activity: activities[0]
    }));
  }, []);
  const handleActivityChange = (0, import_react.useCallback)((activity) => {
    setCurrentEntry((prev) => ({ ...prev, activity }));
  }, []);
  const handleValueChange = (0, import_react.useCallback)((value) => {
    setCurrentEntry((prev) => ({ ...prev, value }));
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
    refreshEntries: fetchEntries
  };
}

// src/components/CO2Calculator.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Card = ({ children, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `rounded-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 ${className || ""}`, children });
var CardHeader = ({ children, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `p-6 pb-3 ${className || ""}`, children });
var CardTitle = ({ children, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: `text-xl font-semibold ${className || ""}`, children });
var CardContent = ({ children, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `p-6 pt-0 ${className || ""}`, children });
var Button = ({ children, onClick, className, variant = "default", size = "default", disabled }) => {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-emerald-600 text-white hover:bg-emerald-700",
    ghost: "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    icon: "w-9 h-9"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "button",
    {
      onClick,
      disabled,
      className: `${base} ${variants[variant]} ${sizes[size]} ${className || ""}`,
      children
    }
  );
};
var Input = ({ type = "number", value, onChange, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
  "input",
  {
    type,
    value,
    onChange,
    className: `w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className || ""}`
  }
);
var Label = ({ children, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: `block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300 ${className || ""}`, children });
var SELECT_CONTENT_MARKER = "__SelectContent__";
function extractSelectItems(children) {
  const items = [];
  import_react2.default.Children.forEach(children, (child) => {
    if (!import_react2.default.isValidElement(child)) return;
    const isContent = child.type.displayName === SELECT_CONTENT_MARKER;
    if (isContent) {
      import_react2.default.Children.forEach(child.props.children, (item) => {
        if (import_react2.default.isValidElement(item) && item.props.value) {
          items.push({ value: item.props.value, label: item.props.children });
        }
      });
    }
  });
  return items;
}
var Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = import_react2.default.useState(false);
  const items = extractSelectItems(children);
  const selected = items.find((item) => item.value === value);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        type: "button",
        onClick: () => setOpen(!open),
        className: "w-full px-4 py-2 text-left rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-700",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selected?.label || "Select..." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-zinc-400", children: "\u25BC" })
        ]
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute z-50 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden", children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer",
        onClick: () => {
          onValueChange(item.value);
          setOpen(false);
        },
        children: item.label
      },
      item.value
    )) })
  ] });
};
var SelectTrigger = ({ children, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `flex items-center justify-between ${className || ""}`, children });
var SelectValue = ({ placeholder }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-zinc-700 dark:text-zinc-300", children: placeholder || "Select..." });
var SelectContent = ({ children, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden ${className || ""}`, children });
SelectContent.displayName = SELECT_CONTENT_MARKER;
var SelectItem = ({ children, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer ${className || ""}`, children });
var CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-700 z-50 relative", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-semibold text-sm", children: label }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-emerald-600 font-bold text-base", children: [
        payload[0].value.toFixed(1),
        " \u043A\u0433 CO\u2082e"
      ] })
    ] });
  }
  return null;
};
var PollutionEffect = ({ co2Amount, onComplete }) => {
  const [show, setShow] = import_react2.default.useState(true);
  const intensity = Math.min(1, co2Amount / 300);
  import_react2.default.useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [co2Amount, onComplete]);
  if (!show) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_framer_motion.motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-[10002] pointer-events-none",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_framer_motion.motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 0.4 + intensity * 0.4 },
            exit: { opacity: 0 },
            transition: { duration: 0.3 },
            className: "absolute inset-0 bg-black"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_framer_motion.motion.div,
          {
            initial: { scale: 0, opacity: 0 },
            animate: { scale: 2, opacity: 0.6 },
            exit: { scale: 3, opacity: 0 },
            transition: { duration: 1.5 },
            className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full",
            style: {
              background: `radial-gradient(circle, rgba(80,80,80,0.8) 0%, rgba(60,60,60,0.4) 50%, transparent 100%)`
            }
          }
        ),
        Array.from({ length: 30 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_framer_motion.motion.div,
          {
            initial: { x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800), y: typeof window !== "undefined" ? window.innerHeight : 600, scale: 0.3 + Math.random() * 1 },
            animate: { y: -100, x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800), rotate: 360 },
            transition: { duration: 1 + Math.random() * 2, delay: Math.random() * 0.3, ease: "linear" },
            className: "absolute",
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-400 text-sm opacity-60", children: "\u{1F4A8}" })
          },
          i
        )),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          import_framer_motion.motion.div,
          {
            initial: { scale: 0, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 1.5, opacity: 0 },
            transition: { duration: 0.3 },
            className: "absolute top-1/3 left-1/2 -translate-x-1/2 text-center bg-black/50 backdrop-blur-sm px-6 py-3 rounded-2xl",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-red-500 font-bold text-xl", children: [
                "+",
                co2Amount,
                " \u043A\u0433 CO\u2082"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-white/80 text-sm mt-1", children: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0432 \u0430\u0442\u043C\u043E\u0441\u0444\u0435\u0440\u0443" })
            ]
          }
        )
      ]
    }
  );
};
var categories = [
  { value: "transport", label: "category_transport", icon: import_lucide_react2.Car, color: categoryColors.transport },
  { value: "energy", label: "category_energy", icon: import_lucide_react2.Zap, color: categoryColors.energy },
  { value: "food", label: "category_food", icon: import_lucide_react2.Utensils, color: categoryColors.food },
  { value: "shopping", label: "category_shopping", icon: import_lucide_react2.ShoppingBag, color: categoryColors.shopping },
  { value: "home", label: "category_home", icon: import_lucide_react2.Home, color: categoryColors.home },
  { value: "lifestyle", label: "category_lifestyle", icon: import_lucide_react2.Coffee, color: categoryColors.lifestyle }
];
var CO2Calculator = ({
  supabase,
  t,
  onEntryAdded,
  onEntryDeleted,
  onError,
  className = ""
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
    handleValueChange
  } = useCO2Calculator({ supabase, t, onError });
  const categoriesWithLabels = categories.map((cat) => ({
    ...cat,
    label: t(cat.label)
  }));
  const getActivityName3 = (category, activity) => {
    return t(`emission_${category}_${activity}_name`);
  };
  const getActivityUnit3 = (category, activity) => {
    return t(`emission_${category}_${activity}_unit`);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: `bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${className}`, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { className: "pb-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-3 text-2xl text-zinc-900 dark:text-white", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react2.Leaf, { className: "text-emerald-600" }),
        t("carbon_footprint_calculator")
      ] }) }),
      loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react2.Loader2, { className: "w-8 h-8 animate-spin text-emerald-600" }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "pt-0 space-y-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-5 p-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-sm font-medium", children: t("category") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              Select,
              {
                value: currentEntry.category,
                onValueChange: handleCategoryChange,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { className: "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-10", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { className: "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700", children: categoriesWithLabels.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    SelectItem,
                    {
                      value: cat.value,
                      className: "hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
                      children: cat.label
                    },
                    cat.value
                  )) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-sm font-medium", children: t("activity") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              Select,
              {
                value: currentEntry.activity,
                onValueChange: handleActivityChange,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { className: "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-10", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { className: "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700", children: activityOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    SelectItem,
                    {
                      value: opt.value,
                      className: "hover:bg-emerald-50 dark:hover:bg-emerald-950/30",
                      children: opt.name
                    },
                    opt.value
                  )) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { className: "text-sm font-medium", children: [
              t("value"),
              " (",
              activityOptions.find((a) => a.value === currentEntry.activity)?.unit || t("unit"),
              ")"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: currentEntry.value,
                onChange: (e) => handleValueChange(Number(e.target.value)),
                className: "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-10"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-4 space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-sm text-muted-foreground bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-lg text-center", children: t("forecast", { co2: previewCO2 }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: addEntry, className: "w-full h-11 bg-emerald-600 hover:bg-emerald-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react2.Plus, { className: "mr-2 h-4 w-4" }),
              " ",
              t("add")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex gap-2 justify-end", children: ["week", "month", "all"].map((range) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "button",
          {
            type: "button",
            onClick: () => setDateRange(range),
            className: `px-3 py-1 text-sm rounded-lg transition-all ${dateRange === range ? "bg-emerald-600 text-white" : "bg-muted hover:bg-muted/80"}`,
            children: range === "all" ? t("all_time") : t(range)
          },
          range
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-lg", children: t("emissions_by_category") }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: categoryData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_recharts.ResponsiveContainer, { width: "100%", height: 320, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_recharts.BarChart,
            {
              data: categoryData,
              layout: "vertical",
              margin: { left: 80, right: 30, top: 20, bottom: 20 },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_recharts.CartesianGrid, { strokeDasharray: "3 3", strokeOpacity: 0.3, stroke: "#888888" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_recharts.XAxis,
                  {
                    type: "number",
                    fontSize: 12,
                    tickFormatter: (value) => `${value} ${t("kg")}`,
                    stroke: "#888888",
                    tickLine: true,
                    axisLine: true
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_recharts.YAxis,
                  {
                    type: "category",
                    dataKey: "name",
                    fontSize: 12,
                    tickLine: true,
                    axisLine: true,
                    width: 100,
                    stroke: "#888888"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_recharts.Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}), wrapperStyle: { zIndex: 40 } }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_recharts.Bar, { dataKey: "value", radius: [0, 8, 8, 0], children: categoryData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_recharts.Cell, { fill: entry.color }, `cell-${index}`)) })
              ]
            }
          ) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[320px] flex items-center justify-center text-muted-foreground", children: t("no_data") }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
          trendData.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "text-lg flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react2.TrendingUp, { className: "w-5 h-5" }),
              t("emissions_trend_chart")
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_recharts.ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_recharts.LineChart, { data: trendData, margin: { top: 20, right: 30, left: 20, bottom: 60 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_recharts.CartesianGrid, { strokeDasharray: "3 3", strokeOpacity: 0.3, stroke: "#888888" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_recharts.XAxis,
                {
                  dataKey: "date",
                  fontSize: 11,
                  tickLine: true,
                  axisLine: true,
                  angle: -45,
                  textAnchor: "end",
                  height: 60,
                  interval: 0,
                  stroke: "#888888"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_recharts.YAxis,
                {
                  fontSize: 12,
                  tickLine: true,
                  axisLine: true,
                  tickFormatter: (value) => `${value} ${t("kg")}`,
                  stroke: "#888888"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_recharts.Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}), wrapperStyle: { zIndex: 40 } }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_recharts.Line,
                {
                  type: "monotone",
                  dataKey: "co2e",
                  stroke: "#10b981",
                  strokeWidth: 3,
                  dot: { fill: "#10b981", strokeWidth: 2, r: 4 },
                  activeDot: { r: 6 },
                  name: "CO\u2082e"
                }
              )
            ] }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-lg", children: t("footprint_structure") }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: categoryData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_recharts.ResponsiveContainer, { width: "100%", height: 260, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_recharts.PieChart, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_recharts.Pie,
                  {
                    data: categoryData,
                    cx: "50%",
                    cy: "50%",
                    innerRadius: 50,
                    outerRadius: 80,
                    dataKey: "value",
                    label: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                    labelLine: false,
                    children: categoryData.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_recharts.Cell, { fill: CHART_COLORS[index % CHART_COLORS.length] }, `cell-${index}`))
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_recharts.Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}), wrapperStyle: { zIndex: 40 } })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap justify-center gap-3 mt-4", children: categoryData.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "div",
                  {
                    className: "w-3 h-3 rounded-full",
                    style: { backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xs", children: [
                  item.name,
                  " (",
                  Math.round(item.value),
                  " ",
                  t("kg"),
                  ")"
                ] })
              ] }, index)) })
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[260px] flex items-center justify-center text-muted-foreground", children: t("no_data") }) })
          ] })
        ] }),
        tips.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold mb-2 flex items-center gap-2", children: t("tips_to_reduce") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "space-y-1 text-sm", children: tips.map((tip, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tip }, i)) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-emerald-50 dark:bg-emerald-950/50 p-8 rounded-3xl text-center border border-emerald-100 dark:border-emerald-900", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-zinc-600 dark:text-zinc-400", children: t("total_footprint_period", {
            period: dateRange === "week" ? t("week").toLowerCase() : dateRange === "month" ? t("month").toLowerCase() : t("all_time").toLowerCase()
          }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-6xl font-bold text-emerald-600 mt-3", children: [
            totalCO2.toFixed(1),
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-3xl", children: t("kg_co2e") })
          ] }),
          filteredEntries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-muted-foreground mt-2", children: t("average_per_entry", { avg: averageCO2.toFixed(1), count: filteredEntries.length }) })
        ] }),
        sortedEntries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold mb-4 text-zinc-900 dark:text-white", children: t("your_records", { count: sortedEntries.length }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-3 max-h-96 overflow-auto", children: sortedEntries.map((entry) => {
            const category = categoriesWithLabels.find((c) => c.value === entry.category);
            const activityName = getActivityName3(entry.category, entry.activity);
            const activityUnit = getActivityUnit3(entry.category, entry.activity);
            return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: "flex justify-between items-center bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "font-medium capitalize", children: [
                      category?.label,
                      " \u2014 ",
                      activityName || entry.activity
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-1", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react2.Calendar, { className: "w-3 h-3" }),
                      new Date(entry.date).toLocaleDateString("ru-RU")
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-right font-mono", children: [
                      entry.value,
                      " ",
                      activityUnit || t("unit"),
                      " \u2192",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-emerald-600 font-semibold ml-1", children: [
                        entry.co2e.toFixed(1),
                        " ",
                        t("kg")
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        onClick: () => {
                          deleteEntry(entry.id);
                          onEntryDeleted?.(entry.id);
                        },
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react2.Trash2, { className: "w-4 h-4 text-red-500 hover:text-red-600" })
                      }
                    )
                  ] })
                ]
              },
              entry.id
            );
          }) })
        ] })
      ] })
    ] }),
    showPollution && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      PollutionEffect,
      {
        co2Amount: lastCO2Amount,
        onComplete: () => {
          setShowPollution(false);
          setLastCO2Amount(0);
        }
      }
    )
  ] });
};
var CO2Calculator_default = CO2Calculator;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CHART_COLORS,
  CO2Calculator,
  calculateCO2,
  calculateCategoryData,
  calculateTrendData,
  categoryColors,
  emissionFactors,
  filterEntriesByDate,
  getActivityName,
  getActivityOptions,
  getActivityUnit,
  getCategoryIcon,
  getCategoryLabel,
  getEmissionFactor,
  getTips,
  useCO2Calculator
});
