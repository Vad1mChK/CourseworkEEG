import type {BrainZone, RhythmType} from "./eegTypes.ts";
import {sumBy} from "../util/mathUtils.ts";

const AnalysisMode = {
    GROUP: 'GROUP',
    SINGLE: 'SINGLE'
} as const;
type AnalysisMode = (typeof AnalysisMode)[keyof typeof AnalysisMode];

const PreviewMode = {
    SIGNAL: 'SIGNAL',
    PSD: 'PSD'
} as const;
type PreviewMode = (typeof PreviewMode)[keyof typeof PreviewMode];

interface EEGFileConfig {
    id: string;
    filename: string;
    experimentName: string;
    timeColumn: string;
    amplitudeColumn: string;
    rawFile: File | null;
    serverId: string | null;
}

interface EEGFilterParams {
    filterMin: number;
    filterMax: number;
    filterOrder: number;
    nPerSeg: number;
    nOverlap: number;
}

interface EEGBaseAnalysisFormData {
    analysisMode: AnalysisMode;
    brainZone: BrainZone;
    filterParams?: EEGFilterParams;
}
interface EEGSingleAnalysisFormData extends EEGBaseAnalysisFormData{
    analysisMode: typeof AnalysisMode.SINGLE;
    file: EEGFileConfig;
    rhythms: RhythmType[];
}
interface EEGGroupAnalysisFormData extends EEGBaseAnalysisFormData{
    analysisMode: typeof AnalysisMode.GROUP;
    files: EEGFileConfig[];
    rhythm: RhythmType;
}
type EEGAnalysisFormData = EEGSingleAnalysisFormData | EEGGroupAnalysisFormData;

interface EEGPreviewFormData {
    file: EEGFileConfig | null;
    rhythm: RhythmType;
    filterParams: EEGFilterParams;
}

export const EEGAnalysisFormDataUtils = {
    getFileCount: (formData: EEGAnalysisFormData): number =>
        formData.analysisMode === 'GROUP' ? formData.files.length : 1,

    getFileTotalSize: (formData: EEGAnalysisFormData): number =>
        formData.analysisMode === 'GROUP'
            ? sumBy(formData.files, (f) => f.rawFile?.size ?? 0)
            : formData.file.rawFile?.size ?? 0,

    // You can easily add more helpers later, e.g., for labels or validation
    isGroupMode: (formData: EEGAnalysisFormData): boolean =>
        formData.analysisMode === 'GROUP'
};

export type { EEGFileConfig, EEGAnalysisFormData, EEGPreviewFormData, EEGFilterParams, AnalysisMode, PreviewMode };