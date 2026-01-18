import React, {useEffect, useState} from 'react';
import {Box, Typography, Chip, Stack, ToggleButtonGroup, ToggleButton} from "@mui/material";
import { Activity, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import ResultsBlock from "../result/ResultsBlock.tsx";
import LinePlotVisualizer from "../result/LinePlotVisualizer.tsx";
import type { EEGPreviewResponse } from "../../types/communicationTypes.ts";
import type {PreviewMode} from "../../types/configTypes.ts";
import {t} from "i18next"; // Adjusted paths

interface PreviewPlotProps {
    previewData: EEGPreviewResponse;
    headerText?: string;
    height?: number;
}

const PreviewPlot = ({
                         previewData,
                         headerText,
                         height = 256
                     }: PreviewPlotProps) => {
    const { t } = useTranslation();
    const { experimentName, rhythm, plot } = previewData;

    const [ previewMode, setPreviewMode] = useState<PreviewMode>('SIGNAL');

    useEffect(() => {
        console.log(previewData.plot)
    }, [previewData]);

    useEffect(() => {
        console.log(`Preview mode set to: ${previewMode}`)
    }, [previewMode]);

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            {/* Metadata Row: Experiment and Rhythm Info */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    gap: 2, // Adds a consistent gutter between the three groups
                    mb: 2
                }}
            >
                {/* 1. Toggle Group - Sized to its buttons */}
                <ToggleButtonGroup
                    value={previewMode}
                    exclusive
                    onChange={(_, next) => next && setPreviewMode(next)}
                    size="small"
                    color="primary"
                    sx={{ flexShrink: 0 }} // Prevents buttons from squishing
                >
                    <ToggleButton value="SIGNAL" sx={{ gap: 1, whiteSpace: 'nowrap' }}>
                        <Activity size={16} /> {t('preview_mode_signal')}
                    </ToggleButton>
                    <ToggleButton value="PSD" sx={{ gap: 1, whiteSpace: 'nowrap' }}>
                        <Zap size={16} /> {t('preview_mode_psd')}
                    </ToggleButton>
                </ToggleButtonGroup>

                {/* 2. Experiment Info - Centered and non-wrapping */}
                <Box sx={{ textAlign: 'center', whiteSpace: 'nowrap', minWidth: 'fit-content' }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                        {t('preview_experiment')}: {experimentName}
                    </Typography>
                </Box>

                {/* 3. Rhythm Chip - Pushed to the far right */}
                <Chip
                    label={t(`misc_rhythm_${rhythm}`)}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ flexShrink: 0 }}
                />
            </Box>

            {/* The Core Visualizer */}
            <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0, height: '100%' }}>
                {previewMode === 'PSD' ? (
                    <LinePlotVisualizer
                        { ...plot.psdPlot }
                        seriesMetadata={[
                            {
                                dataKey: 'psd',
                                legend: t('results_linePlotPair_legend_psd'),
                                preferredColor: 'secondary'
                            }
                        ]}
                        yLogarithmic
                        width="100%"
                        showLegend={true}
                    />
                ) : (
                    <LinePlotVisualizer
                        { ...plot.signalPlot }
                        seriesMetadata={[
                            {dataKey: 'raw', legend: t('results_linePlotPair_legend_raw')},
                            {
                                dataKey: 'filtered',
                                legend: t('results_linePlotPair_legend_filtered'),
                                preferredColor: 'primary'
                            }
                        ]}
                        width="100%"
                        showLegend={true}
                    />
                )}
            </Box>
        </Stack>
    );
};

export default PreviewPlot;