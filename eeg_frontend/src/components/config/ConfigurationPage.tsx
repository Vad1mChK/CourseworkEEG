import React, { useState } from "react";
import type { AnalysisMode } from "../../types/configTypes.ts";
import type { EEGFileConfig } from "../../types/configTypes.ts";
import { useTranslation } from "react-i18next";
import {Box, Chip, FormControl, InputLabel, MenuItem, Select, Stack} from "@mui/material";

import ModeConfigurationBlock from "./ModeConfigurationBlock.tsx";
import ConfigurationBlock from "./ConfigurationBlock.tsx";
import {Activity, Upload} from "lucide-react";
import FileDropzone from "./FileDropzone.tsx";
import FileItem from "./FileItem.tsx";
import {ALL_BRAIN_ZONES, ALL_RHYTHM_TYPES, RHYTHM_TYPES_BY_BRAIN_ZONE} from '../../types/eegTypes.ts';
import type {BrainZone, RhythmType} from "../../types/eegTypes.ts";


const ConfigurationPage = () => {
    const [mode, setMode] = useState<AnalysisMode>("GROUP");
    const { t } = useTranslation();
    const [files, setFiles] = useState<EEGFileConfig[]>([]);
    const [brainZone, setBrainZone] = useState<BrainZone>("FRONTAL");
    const [selectedRhythms, setSelectedRhythms] = useState<RhythmType[]>(
        RHYTHM_TYPES_BY_BRAIN_ZONE[brainZone]
    );

    // 🚨 FIX 1: Change the function signature to accept a FileList 🚨
    const handleFileUpload = (fileList: FileList) => {
        // No need to check for e.target.files, the FileDropzone ensures we get a FileList
        if (fileList.length === 0) return;
        // Convert FileList to Array and map to EEGFileConfig
        const newFiles = Array.from(fileList).map(f => ({
            id: Math.random().toString(36).substr(2, 9),
            filename: f.name,
            experimentName: f.name.replace('.csv', '').replace('.txt', ''), // Handle both extensions
            timeColumn: 'Time',
            amplitudeColumn: 'A0',
            rawFile: f,
            serverId: null,
        }));
        if (mode === 'SINGLE' && newFiles.length > 0) {
            // SINGLE mode: Replace all files with the first new one
            setFiles([newFiles[0]]);
        } else {
            // GROUP mode: Append new files
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
        setSelectedRhythms(RHYTHM_TYPES_BY_BRAIN_ZONE[newBrainZone]);
    };

    return (
        <>
            <ModeConfigurationBlock mode={mode} onModeChange={setMode}/>
            <ConfigurationBlock
                headerText={t('config_file_upload')}
                headerIcon={<Upload size={18} />}
            >
                <FileDropzone
                    isMultiple={mode === "GROUP"}
                    onFileUpload={handleFileUpload} // Passes the FileList
                    accept={".txt,.csv"}
                />

                <Box sx={{ mt: 2, maxHeight: 300, overflowY: 'auto' }}>
                    { files.map(f => ( // 🚨 FIX 2: Use parentheses () instead of curly braces {}
                        <FileItem
                            key={f.id}
                            file={f}
                            onUpdate={updateFile}
                            onRemove={removeFile}
                        />
                    ))}
                </Box>
            </ConfigurationBlock>
            <ConfigurationBlock
                headerText={t('config_rhythm')}
                headerIcon={<Activity size={18} />}
            >
                <Stack spacing={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>{t('config_rhythm_brainZone')}</InputLabel>
                        <Select
                            value={brainZone}
                            label={t('config_rhythm_brainZone')}
                            onChange={(e) => handleBrainZoneChange(e.target.value as BrainZone)}
                        >
                            {ALL_BRAIN_ZONES.map(z =>
                                <MenuItem key={z} value={z}>{t(`config_rhythm_brainZone_${z}`)}</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel>{(mode === "GROUP") ?
                            t('config_rhythm_targetRhythm') :
                            t('config_rhythm_targetRhythms')}</InputLabel>
                        <Select
                            multiple={(mode === "SINGLE")}
                            value={(mode === "GROUP") ? (selectedRhythms[0] || '') : selectedRhythms}
                            label={(mode === "GROUP") ?
                                t('config_rhythm_targetRhythm') :
                                t('config_rhythm_targetRhythms')}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedRhythms(typeof val === 'string' ? [val as RhythmType] : val as RhythmType[]);
                            }}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(Array.isArray(selected) ? selected : [selected]).map((value) => (
                                        <Chip key={value} label={value} size="small" />
                                    ))}
                                </Box>
                            )}
                        >
                            {ALL_RHYTHM_TYPES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Stack>
            </ConfigurationBlock>
        </>
    );
}

export default ConfigurationPage;