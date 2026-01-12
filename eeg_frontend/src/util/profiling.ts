// util/profiling.ts
// util/profiling.ts

type ProfileOperationType = 'COMMUNICATE' | 'RENDER_RESULT';

export interface ProfileEntry {
    timestamp: string;
    durationMs: number;
    operationType: ProfileOperationType;
    status: 'SUCCESS' | 'ERROR';
    // Metadata for correlation
    fileCount?: number;
    totalFileSizeBytes?: number;
    dataPointsCount?: number;
    plotPairsCount?: number;
}

const STORAGE_KEY = 'eegProfilingData';
const MAX_DATA_SIZE = 1024;

export const saveProfilingData = (entry: Omit<ProfileEntry, 'timestamp'>): void => {
    try {
        const rawData = localStorage.getItem(STORAGE_KEY);
        const history: ProfileEntry[] = rawData ? JSON.parse(rawData) : [];

        if (history.length >= MAX_DATA_SIZE) {
            console.warn(`The length of profiling data exceeds ${MAX_DATA_SIZE}, new data won't be saved`);
            return;
        }

        const newEntry: ProfileEntry = {
            ...entry,
            timestamp: new Date().toISOString(),
            durationMs: Number(entry.durationMs.toFixed(3))
        };

        history.push(newEntry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save profiling data", e);
    }
};

export const loadProfilingData = (): ProfileEntry[] => {
    return (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as ProfileEntry[]) ?? [];
}

export const printProfilingData = (): void => {
    const profilingData = loadProfilingData();
    console.table(profilingData, ['timestamp', 'durationMs', 'status', 'operationType'])
}

/**
 * Run this in the browser console to get your data:
 * console.table(JSON.parse(localStorage.getItem('eeg_profiling_data')))
 */
export const clearProfilingData = (): void => localStorage.removeItem(STORAGE_KEY);