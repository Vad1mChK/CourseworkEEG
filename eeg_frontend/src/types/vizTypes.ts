// src/types/vizTypes.ts

type MuiColorName = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
export type PreferredColor = string | MuiColorName;

// --- DEPRECATED/REPLACED: EEGDataPoint and EEGLineCurve ---
// type EEGDataPoint = [number, number];
// interface EEGLineCurve { ... dataPoints: EEGDataPoint[] ... }
// -----------------------------------------------------------

// NEW: Metadata describing a single curve/series (e.g., "Alpha Power")
interface EEGSeriesMetadata {
    dataKey: string;          // The key used in the combined data array (e.g., 'curve0', 'betaPower')
    legend?: string | null;
    preferredColor?: PreferredColor;
}

// NEW: The core aligned data structure (ready for Recharts)
type EEGCombinedDataPoint = {
    x: number;               // The unified X-coordinate (Time or Frequency)
    [key: string]: number;   // Keys are the dataKey strings from EEGSeriesMetadata
};

// NEW: The main plot definition now contains the final data array and series metadata
interface EEGLinePlot {
    xMin?: number | null;
    xMax?: number | null;
    yMin?: number | null;
    yMax?: number | null;
    xAxisName?: string;
    yAxisName?: string;
    xHighlightRange?: [number, number] | null;
    yLogarithmic?: boolean;
    showLegend?: boolean;
    area?: boolean;
    seriesMetadata?: EEGSeriesMetadata[];
    data: EEGCombinedDataPoint[];
}

export interface EEGBarPlot {
    labels: string[];
    values: number[];
    preferredColor?: PreferredColor;
    xAxisName?: string;
    yAxisName?: string;
    yMin?: number | null;
    yMax?: number | null;
}

interface EEGPlotPair {
    psdPlot: EEGLinePlot;
    signalPlot: EEGLinePlot;
}

const EEGPlotUtils = {
    calculateXMinMax(linePlot: EEGLinePlot): { min: number | null, max: number | null } {
        const length = linePlot.data.length;
        const min = linePlot.xMin ?? ((length > 0) ? linePlot.data[0].x : null);
        const max = linePlot.xMax ?? ((length > 0) ? linePlot.data[length - 1].x : null);
        return { min, max };
    }
};

// Exporting the new structure
export type { EEGSeriesMetadata, EEGCombinedDataPoint, EEGLinePlot, EEGPlotPair }
export { EEGPlotUtils };