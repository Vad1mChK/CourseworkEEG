import type {BrainZone, RhythmType} from "./eegTypes.ts";
import type {AnalysisMode, EEGFileConfig} from "./configTypes.ts";
import type {EEGPlotPair} from "./vizTypes.ts";

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

export type {
    EEGAnalysisRequest,
    EEGAnalysisResponse
};