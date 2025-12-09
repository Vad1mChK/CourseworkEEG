const AnalysisMode = {
    GROUP: 'GROUP',
    SINGLE: 'SINGLE'
} as const;
type AnalysisMode = (typeof AnalysisMode)[keyof typeof AnalysisMode];

export {AnalysisMode};