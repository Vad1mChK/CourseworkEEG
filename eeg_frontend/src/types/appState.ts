import type {EEGAnalysisResponse, EEGPreviewResponse } from "./communicationTypes.ts";

export type AppState =
    | { status: 'IDLE' }
    | { status: 'LOADING' }
    | { status: 'SUCCESS'; response: EEGAnalysisResponse }
    | { status: 'ERROR'; message: string };

export type PreviewState =
    | { status: 'IDLE' }
    | { status: 'LOADING' }
    | { status: 'SUCCESS'; response: EEGPreviewResponse }
    | { status: 'ERROR'; message: string };