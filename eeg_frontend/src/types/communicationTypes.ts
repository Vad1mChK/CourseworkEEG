import type {BrainZone, RhythmType} from "./eegTypes.ts";
import type {AnalysisMode, EEGFileConfig} from "./configTypes.ts";

interface EEGSingleAnalysisRequest {
    analysisId: string;  // e.g. generated UUID
    analysisMode: typeof AnalysisMode.SINGLE; // or AnalysisMode values
    file: EEGFileConfig;
    brainZone?: BrainZone;
    rhythms: RhythmType[];
}
interface EEGGroupAnalysisRequest {
    analysisId: string;
    analysisMode: typeof AnalysisMode.GROUP;
    files: EEGFileConfig[];
    brainZone?: BrainZone;
    rhythm: RhythmType;
}
type EEGAnalysisRequest = EEGSingleAnalysisRequest | EEGGroupAnalysisRequest;

type EEGDataPoint = [number, number];
interface EEGLineCurve {
    legend?: string | null;
    preferredColor?: string;
    area?: boolean;
    dataPoints: EEGDataPoint[]; // It may be reasonable to limit the amount of data points sent back for interactive viz
}
interface EEGLinePlot {
    xMin?: number | null;
    xMax?: number | null;
    yMin?: number | null;
    yMax?: number | null;
    showLegend?: boolean;
    curves: EEGLineCurve[];
}
interface EEGPlotPair {
    psdPlot: EEGLinePlot;
    signalPlot: EEGLinePlot;
}
interface EEGGroupAnalysisResponse {
    analysisId: string;
    analysisMode: typeof AnalysisMode.GROUP;
    experimentNames: string[],
    rhythm: RhythmType;
    absolutePowers: [string, number][];
    relativePowers: [string, number][];
    dataByExperiment: Record<string, EEGPlotPair>;
}
interface EEGSingleAnalysisResponse {
    analysisId: string;
    analysisMode: typeof AnalysisMode.SINGLE;
    experimentName: string,
    rhythms: RhythmType[];
    absolutePowers: [RhythmType, number][];
    relativePowers: [RhythmType, number][];
    dataByRhythm: Record<RhythmType, EEGPlotPair>;
}
type EEGAnalysisResponse = EEGGroupAnalysisResponse | EEGSingleAnalysisResponse;

export type { EEGAnalysisRequest, EEGAnalysisResponse };