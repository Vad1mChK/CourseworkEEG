import type {BrainZone, RhythmType} from "./eegTypes.ts";
import type {AnalysisMode, EEGFileConfig} from "./configTypes.ts";
import type {EEGPlotPair} from "./vizTypes.ts";
import {sumBy} from "../util/mathUtils.ts";

interface EEGBaseAnalysisRequest {
    analysisId: string; // e.g. generated UUID
    brainZone?: BrainZone;
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

export const EEGAnalysisResponseUtils = {
    getPlotPairCount: (response: EEGAnalysisResponse): number => (
        response.analysisMode == 'GROUP' ?
            Object.keys(response.dataByExperiment).length :
            Object.keys(response.dataByRhythm).length
    ),
    getPlotPairDataPointCount: (plotPair: EEGPlotPair): number => {
        const psdPlotLineCount = plotPair.psdPlot.data.length > 0 ?
            (Object.values(plotPair.psdPlot.data[0]).length - 1) :
            0;
        const signalPlotLineCount = plotPair.signalPlot.data.length > 0 ?
            (Object.values(plotPair.signalPlot.data[0]).length - 1) :
            0;
        return plotPair.psdPlot.data.length * psdPlotLineCount +
            plotPair.signalPlot.data.length * signalPlotLineCount;
    },
    getTotalDataPointCount: (response: EEGAnalysisResponse): number => {
        const powersDataPointCount = (response.absolutePowers.length + response.relativePowers.length);
        const plotPairDataPointCount = response.analysisMode === 'GROUP' ?
            sumBy(Object.values(response.dataByExperiment), EEGAnalysisResponseUtils.getPlotPairDataPointCount) :
            sumBy(Object.values(response.dataByRhythm), EEGAnalysisResponseUtils.getPlotPairDataPointCount);
        return powersDataPointCount + plotPairDataPointCount;
    }
};

export type {
    EEGAnalysisRequest,
    EEGAnalysisResponse
};