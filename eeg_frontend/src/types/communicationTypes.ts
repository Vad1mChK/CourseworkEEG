import type {BrainZone, RhythmType} from "./eegTypes.ts";
import type {AnalysisMode, EEGFileConfig, EEGFilterParams, PreviewMode} from "./configTypes.ts";
import type {EEGLinePlot, EEGPlotPair} from "./vizTypes.ts";
import {sumBy} from "../util/mathUtils.ts";

interface EEGBaseAnalysisRequest {
    analysisId: string; // e.g. generated UUID
    brainZone?: BrainZone;
    filterParams?: EEGFilterParams;
}
interface EEGSingleAnalysisRequest extends EEGBaseAnalysisRequest {
    analysisMode: typeof AnalysisMode.SINGLE; // or AnalysisMode values
    file: EEGFileConfig;
    rhythms: RhythmType[];
}
interface EEGGroupAnalysisRequest extends EEGBaseAnalysisRequest {
    analysisMode: typeof AnalysisMode.GROUP;
    files: EEGFileConfig[];
    rhythm: RhythmType;
}
type EEGAnalysisRequest = EEGSingleAnalysisRequest | EEGGroupAnalysisRequest;

interface EEGBaseAnalysisResponse {
    analysisId: string;
    filterParams?: EEGFilterParams;
}
interface EEGGroupAnalysisResponse extends EEGBaseAnalysisResponse {
    analysisMode: typeof AnalysisMode.GROUP;
    experimentNames: string[],
    rhythm: RhythmType;
    absolutePowers: [string, number][];
    relativePowers: [string, number][];
    dataByExperiment: Record<string, EEGPlotPair>;
}
interface EEGSingleAnalysisResponse extends EEGBaseAnalysisResponse {
    analysisMode: typeof AnalysisMode.SINGLE;
    experimentName: string,
    rhythms: RhythmType[];
    absolutePowers: [RhythmType, number][];
    relativePowers: [RhythmType, number][];
    dataByRhythm: Partial<Record<RhythmType, EEGPlotPair>>;
}
type EEGAnalysisResponse = EEGGroupAnalysisResponse | EEGSingleAnalysisResponse;

interface EEGPreviewRequest {
    previewId: string;
    file: EEGFileConfig;
    // These parameters are needed only for display
    experimentName: string;
    rhythm: RhythmType;
    // Butterworth filter parameters:
    filterParams: EEGFilterParams;
}

interface EEGPreviewResponse {
    previewId: string;
    experimentName: string;
    rhythm: RhythmType;
    plot: EEGPlotPair; // Contains both raw and filtered signals
}

export const EEGAnalysisResponseUtils = {
    getPlotPairCount: (response: Partial<EEGAnalysisResponse>): number => {
        if (response.analysisMode === 'GROUP') {
            return Object.keys(response.dataByExperiment ?? {}).length;
        }
        if (response.analysisMode === 'SINGLE') {
            return Object.keys(response.dataByRhythm ?? {}).length;
        }
        return 0;
    },

    getPlotPairDataPointCount: (plotPair: EEGPlotPair | undefined): number => {
        if (!plotPair) return 0;

        // Count entries in PSD data (length of array * number of keys excluding 'frequency')
        const psdData = plotPair.psdPlot?.data ?? [];
        const psdLineCount = psdData.length > 0 ? (Object.keys(psdData[0]).length - 1) : 0;
        const psdTotal = psdData.length * psdLineCount;

        // Count entries in Signal data (length of array * number of keys excluding 'time')
        const signalData = plotPair.signalPlot?.data ?? [];
        const signalLineCount = signalData.length > 0 ? (Object.keys(signalData[0]).length - 1) : 0;
        const signalTotal = signalData.length * signalLineCount;

        return psdTotal + signalTotal;
    },

    getTotalDataPointCount: (response: Partial<EEGAnalysisResponse>): number => {
        const powersCount = (response.absolutePowers?.length ?? 0) + (response.relativePowers?.length ?? 0);

        const plotPairs = response.analysisMode === 'GROUP'
            ? Object.values(response.dataByExperiment ?? {})
            : (response.analysisMode === 'SINGLE' ? Object.values(response.dataByRhythm ?? {}) : []);

        const plotPairsCount = sumBy(plotPairs, (pair) =>
            EEGAnalysisResponseUtils.getPlotPairDataPointCount(pair as EEGPlotPair)
        );

        return powersCount + plotPairsCount;
    }
};

export type {
    EEGAnalysisRequest,
    EEGAnalysisResponse,
    EEGPreviewRequest,
    EEGPreviewResponse
};