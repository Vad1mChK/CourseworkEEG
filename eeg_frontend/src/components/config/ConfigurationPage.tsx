import React, {useEffect, useState} from "react";
import type { AnalysisMode, EEGFileConfig, EEGAnalysisFormData } from "../../types/configTypes.ts";
import { useTranslation } from "react-i18next";
import {
    Box,
    Button,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material"; // Added FormHelperText

import ModeConfigurationBlock from "./ModeConfigurationBlock.tsx";
import ConfigurationBlock from "./ConfigurationBlock.tsx";
import { Activity, Play, Upload } from "lucide-react";
import FileDropzone from "./FileDropzone.tsx";
import FileItem from "./FileItem.tsx";
import {
    ALL_BRAIN_ZONES,
    ALL_RHYTHM_TYPES,
    DEFAULT_RHYTHM_BANDS,
    RHYTHM_TYPES_BY_BRAIN_ZONE
} from '../../types/eegTypes.ts';
import type { BrainZone, RhythmType } from '../../types/eegTypes.ts';
import PreviewWindow from "../preview/PreviewWindow.tsx";
import type {ApiClient} from "../../communication/apiClient.ts";

interface ConfigurationPageProps {
    apiClient?: ApiClient;
    onRunAnalysis?: (data: EEGAnalysisFormData) => void;
}

const ConfigurationPage = ({
                               onRunAnalysis = (_) => {},
                               apiClient
}: ConfigurationPageProps) => {
    const [mode, setMode] = useState<AnalysisMode>("GROUP");
    const { t } = useTranslation();
    const [files, setFiles] = useState<EEGFileConfig[]>([]);

    // Configuration parameters
    const [brainZone, setBrainZone] = useState<BrainZone>("FRONTAL");
    const [selectedRhythms, setSelectedRhythms] = useState<RhythmType[]>(
        [RHYTHM_TYPES_BY_BRAIN_ZONE["FRONTAL"][0]]
    );
    const [filterMin, setFilterMin] = useState<number>(14);
    const [filterMax, setFilterMax] = useState<number>(40);
    const [filterOrder, setFilterOrder] = useState<number>(1);
    const [filterNperseg, setFilterNperseg] = useState<number>(1024);
    const [filterNOverlap, setFilterNOverlap] = useState<number>(512);

    const handleFileUpload = (fileList: FileList) => {
        if (fileList.length === 0) return;

        const newFiles = Array.from(fileList).map(f => ({
            id: Math.random().toString(36).substr(2, 9),
            filename: f.name,
            experimentName: f.name.replace(/\.(csv|txt)$/i, ''), // Regex matches both extensions case-insensitive
            timeColumn: 'Time',
            amplitudeColumn: 'A0',
            rawFile: f,
            serverId: null,
        }));

        if (mode === 'SINGLE') {
            // In Single mode, we only keep the NEWEST file if multiple were dropped, or just the one.
            // (Previous logic was a bit ambiguous if fileList had >1 items)
            setFiles([newFiles[0]]);
        } else {
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const updateFile = (id: string, field: keyof EEGFileConfig, value: any) => {
        setFiles(files.map(f => f.id === id ? { ...f, [field]: value } : f));
    };

    const removeFile = (id: string) => {
        setFiles(files.filter(f => f.id !== id));
    };

    const handleBrainZoneChange = (newBrainZone: BrainZone) => {
        setBrainZone(newBrainZone);
        // Reset rhythms to the default for this zone when zone changes
        // This is good UX so users don't see 'Occipital' with 'Frontal' rhythms selected
        handleRhythmsChange(RHYTHM_TYPES_BY_BRAIN_ZONE[newBrainZone]);
    };

    const runAnalysis = () => {
        if (files.length === 0) return;

        // Validation logic
        if (mode === 'GROUP') {
            // Strict check: Group mode must have exactly 1 rhythm
            const targetRhythm = selectedRhythms[0];
            if (!targetRhythm) return;

            const formData: EEGAnalysisFormData = {
                analysisMode: 'GROUP',
                files: files,
                brainZone: brainZone,
                rhythm: targetRhythm,
                filterParams: {
                    filterMin,
                    filterMax,
                    filterOrder,
                    nPerSeg: filterNperseg,
                    nOverlap: filterNOverlap
                }
            };
            onRunAnalysis(formData);

        } else {
            // Single mode validation
            if (selectedRhythms.length === 0) return;

            const formData: EEGAnalysisFormData = {
                analysisMode: 'SINGLE',
                file: files[0],
                brainZone: brainZone,
                rhythms: selectedRhythms,
                filterParams: {
                    filterMin,
                    filterMax,
                    filterOrder,
                    nPerSeg: filterNperseg,
                    nOverlap: filterNOverlap
                }
            };
            onRunAnalysis(formData);
        }
    }

    const handleRhythmsChange = (newRhythms: RhythmType[]) => {
        setSelectedRhythms(newRhythms);
        if (newRhythms.length > 0) {
            const firstRhythm = newRhythms[0];
            setFilterMin(DEFAULT_RHYTHM_BANDS[firstRhythm][0]);
            setFilterMax(DEFAULT_RHYTHM_BANDS[firstRhythm][1]);
        }
    }

    return (
        <>
            <ModeConfigurationBlock mode={mode} onModeChange={setMode}/>

            <ConfigurationBlock
                headerText={t('config_file_upload')}
                headerIcon={<Upload size={18} />}
            >
                <FileDropzone
                    isMultiple={mode === "GROUP"}
                    onFileUpload={handleFileUpload}
                    accept={".txt,.csv"}
                />

                <Box sx={{ mt: 2, maxHeight: 300, overflowY: 'auto' }}>
                    {files.map(f => (
                        <FileItem
                            key={f.id}
                            file={f}
                            onUpdate={updateFile}
                            onRemove={removeFile}
                        />
                    ))}
                    {files.length === 0 && (
                        <Box p={2} textAlign="center" color="text.secondary">
                            {t('config_file_noFilesSelected')}
                        </Box>
                    )}
                </Box>
            </ConfigurationBlock>

            <ConfigurationBlock
                headerText={t('config_rhythm')}
                headerIcon={<Activity size={18} />}
            >
                <Stack spacing={3}>
                    {/* 2-Column Layout for Parameters and Preview */}
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">

                        {/* Left Column: Configuration Parameters */}
                        <Stack spacing={2} sx={{ flex: 1, width: '100%' }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>{t('config_rhythm_brainZone')}</InputLabel>
                                <Select
                                    value={brainZone}
                                    label={t('config_rhythm_brainZone')}
                                    onChange={(e) => handleBrainZoneChange(e.target.value as BrainZone)}
                                >
                                    {ALL_BRAIN_ZONES.map(z => <MenuItem key={z} value={z}>{t(`misc_brainZone_${z}`)}</MenuItem>)}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel id="rhythm-select-label">
                                    {(mode === "GROUP") ? t('config_rhythm_targetRhythm') : t('config_rhythm_targetRhythms')}
                                </InputLabel>
                                <Select
                                    labelId="rhythm-select-label"
                                    multiple={(mode === "SINGLE")}
                                    value={(mode === "GROUP") ? (selectedRhythms[0] || '') : selectedRhythms}
                                    label={(mode === "GROUP") ? t('config_rhythm_targetRhythm') : t('config_rhythm_targetRhythms')}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        handleRhythmsChange(typeof val === 'string' ? [val as RhythmType] : val as RhythmType[]);
                                    }}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {(Array.isArray(selected) ? selected : [selected]).map((value) => (
                                                value && <Chip key={value} label={t(`misc_rhythm_${value}`)} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {ALL_RHYTHM_TYPES.map(r => <MenuItem key={r} value={r}>{t(`misc_rhythm_${r}`)}</MenuItem>)}
                                </Select>
                            </FormControl>

                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                                    {t('config_filter_header') || "Butterworth Filter Configuration"}
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label={t('config_filter_filterMin')}
                                        type="number"
                                        size="small"
                                        sx={{ flex: 1 }}
                                        value={filterMin}
                                        onChange={(e) => setFilterMin(parseFloat(e.target.value) || 0)}
                                        InputProps={{
                                            inputProps: {min: 0, max: 50, step: 0.1 }
                                        }}
                                    />
                                    <TextField
                                        label={t('config_filter_filterMax')}
                                        type="number"
                                        size="small"
                                        sx={{ flex: 1 }}
                                        value={filterMax}
                                        onChange={(e) => setFilterMax(parseFloat(e.target.value) || 0)}
                                        InputProps={{
                                            inputProps: {min: 0, max: 50, step: 0.1 }
                                        }}
                                    />
                                    <TextField
                                        label={t('config_filter_filterOrder')}
                                        type="number"
                                        size="small"
                                        sx={{ flex: 1 }}
                                        value={filterOrder}
                                        onChange={(e) => setFilterOrder(parseInt(e.target.value) || 1)}
                                        InputProps={{
                                            inputProps: {min: 1, max: 10, step: 1 }
                                        }}
                                    />
                                </Stack>
                            </Box>

                            <Box>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label={t('config_filter_filterNperseg')}
                                        type="number"
                                        size="small"
                                        sx={{ flex: 1 }}
                                        value={filterNperseg}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value) || 0;
                                            setFilterNperseg(val);
                                            setFilterNOverlap(~~(val / 2));
                                        }}
                                        InputProps={{
                                            inputProps: {min: 256, max: 4096, step: 16 }
                                        }}
                                    />
                                    <TextField
                                        label={t('config_filter_filterNOverlap')}
                                        type="number"
                                        size="small"
                                        sx={{ flex: 1 }}
                                        value={filterNOverlap}
                                        onChange={(e) =>
                                            setFilterNOverlap(parseFloat(e.target.value) || 0)}
                                        InputProps={{
                                            inputProps: {min: 128, max: 2048, step: 8 }
                                        }}
                                    />
                                </Stack>
                            </Box>
                        </Stack>

                        {/* Right Column: Preview Window Widget */}
                        <Box sx={{ flex: 1.5, width: '100%', mt: { xs: 2, md: 0 } }}>
                            <PreviewWindow
                                apiClient={apiClient}
                                previewFormData={{
                                    file: (files.length > 0 ? files[0] : null),
                                    rhythm: (selectedRhythms.length > 0 ? selectedRhythms[0] : 'ALPHA'),
                                    filterParams: {
                                        filterMin,
                                        filterMax,
                                        filterOrder,
                                        nPerSeg: filterNperseg,
                                        nOverlap: filterNOverlap
                                    }
                                }}
                            />
                        </Box>
                    </Stack>

                    {/* Full-width Submit Button */}
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={
                            files.length === 0 ||
                            selectedRhythms.length === 0 ||
                            (mode === 'GROUP' && selectedRhythms.length !== 1) ||
                            (mode === 'SINGLE' && files.length !== 1) ||
                            filterMin >= filterMax
                        }
                        onClick={runAnalysis}
                        startIcon={<Play />}
                    >
                        {t('config_submit')}
                    </Button>
                </Stack>
            </ConfigurationBlock>
        </>
    );
}

export default ConfigurationPage;