const AnalysisMode = {
    GROUP: 'GROUP',
    SINGLE: 'SINGLE'
} as const;
type AnalysisMode = (typeof AnalysisMode)[keyof typeof AnalysisMode];

interface EEGFileConfig {
    id: string;
    filename: string;
    experimentName: string;
    timeColumn: string;
    amplitudeColumn: string;
    rawFile: File | null;
    serverId: string | null;
}

export type { EEGFileConfig };
export { AnalysisMode };