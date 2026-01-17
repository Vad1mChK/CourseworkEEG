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
                         height = 350
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
        <Stack spacing={2}>
            {/* Metadata Row: Experiment and Rhythm Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%" sx={{ mb: 2 }}>
                    <ToggleButtonGroup
                        value={previewMode}
                        exclusive
                        onChange={(_, next) => setPreviewMode(next)}
                        size="small"
                        color="primary"
                    >
                        <ToggleButton value="SIGNAL" sx={{ gap: 1 }}>
                            <Activity size={16} /> {t('preview_mode_signal')}
                        </ToggleButton>
                        <ToggleButton value="PSD" sx={{ gap: 1 }}>
                            <Zap size={16} /> {t('preview_mode_psd')}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                        {t('preview_experiment')}: {experimentName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {previewMode === 'SIGNAL' ? t('preview_mode_signal') : t('preview_mode_psd')}
                    </Typography>
                </Box>
                <Chip
                    label={t(`misc_rhythm_${rhythm}`)}
                    size="small"
                    color="primary"
                    variant="outlined"
                />
            </Box>

            {/* The Core Visualizer */}
            { (previewMode == 'PSD') ?
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
                    height={height}
                    width="100%"
                    showLegend={true}
                /> :
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
                    height={height}
                    width="100%"
                    showLegend={true}
                />
            }
            </Stack>
    );
};

export default PreviewPlot;