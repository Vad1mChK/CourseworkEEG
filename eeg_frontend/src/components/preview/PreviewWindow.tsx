import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, CircularProgress, Stack,
    ToggleButton, ToggleButtonGroup, Paper, IconButton, Button
} from "@mui/material";
import { Activity, Zap, AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import PreviewPlot from "./PreviewPlot.tsx";
import {type ApiClient, createApiClient} from "../../communication/apiClient.ts";
import type { EEGPreviewFormData } from "../../types/configTypes.ts";
import type { EEGPreviewRequest, EEGPreviewResponse } from "../../types/communicationTypes.ts";
import type { PreviewMode } from "../../types/configTypes.ts";
import {generateUUID} from "../../util/uuidUtils.ts";

interface PreviewWindowProps {
    /** Encapsulated configuration data needed for the preview */
    previewFormData: EEGPreviewFormData;
    apiClient?: ApiClient;
}

type InternalPreviewState =
    | { status: 'IDLE' }
    | { status: 'LOADING' }
    | { status: 'SUCCESS'; response: EEGPreviewResponse }
    | { status: 'ERROR'; message: string };

const PreviewWindow = ({
                           previewFormData,
                           apiClient = createApiClient({
                               baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
                           })
                       }: PreviewWindowProps) => {
    const { t } = useTranslation();

    // Internal State: Mode is managed here, not by the parent
    const [previewMode, setPreviewMode] = useState<PreviewMode>('SIGNAL');
    const [previewState, setPreviewState] = useState<InternalPreviewState>({ status: 'IDLE' });

    // Refs for cancellation and debouncing
    const abortControllerRef = useRef<AbortController | null>(null);

    const performFetch = async () => {
        if (!apiClient || !(apiClient.preview)) {
            setPreviewState({ status: 'IDLE' });
            return;
        }

        const { file, filterParams, rhythm} = previewFormData;

        if (!file) {
            setPreviewState({ status: 'IDLE' });
            return;
        }

        // Cancel previous fetch
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setPreviewState({ status: 'LOADING' });

        const request: EEGPreviewRequest = {
            previewId: generateUUID(),
            file: file,
            experimentName: file?.experimentName ?? "",
            rhythm: rhythm,
            filterParams
        };

        // apiClient.preview(request, controller.signal)
        //     .then(response => setPreviewState({ status: 'SUCCESS', response: response }))
        //     .catch(e => {
        //         if (e.name === 'AbortError') return;
        //         setPreviewState({ status: 'ERROR', message: e?.message ?? t('error_unknown') });
        //     })
        //     .finally(() => {
        //         if (abortControllerRef.current === controller) {
        //             abortControllerRef.current = null;
        //         }
        //     });

        try {
            // Replace with actual apiClient.preview(request, controller.signal)
            const response = await apiClient.preview(request, controller.signal);
            setPreviewState({ status: 'SUCCESS', response: response });
        } catch (e: any) {
            if (e.name === 'AbortError') return;
            setPreviewState({ status: 'ERROR', message: e?.message ?? t('error_unknown') });
        } finally {
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
        }
    };

    const handleModeChange = (newMode: PreviewMode) => {
        setPreviewMode(newMode);
        // We don't need to call performFetch() manually here because
        // 'previewMode' is in the useEffect dependency array.
    };

    useEffect(() => {
        performFetch();

        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [
        previewFormData.file,
        previewFormData.file?.experimentName,
        previewFormData.rhythm,
        previewFormData.filterParams.filterMin,
        previewFormData.filterParams.filterMax,
        previewFormData.filterParams.filterOrder,
        previewFormData.filterParams.nPerSeg,
        previewFormData.filterParams.nOverlap
    ]);

    // ... Render Logic (Same as before, simplified for brevity) ...
    return (
        <Paper
            variant="outlined"
            sx={{
                mt: 2, minHeight: 320,
                bgcolor: 'background.default', borderRadius: 2,
                borderStyle: !previewFormData.file ? 'dashed' : 'solid',
                // display: 'flex',
                // flexDirection: 'column',
                // alignItems: 'stretch'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 256, flexGrow: 1, width: "100%" }}>
                {previewState.status === 'IDLE' && (
                    <Typography variant="body2" color="text.secondary">
                        {t('config_file_noFilesSelected')}
                    </Typography>
                )}

                {previewState.status === 'LOADING' && (
                    <Stack alignItems="center" spacing={1}>
                        <CircularProgress size={32} thickness={5} />
                        <Typography variant="caption">{t('preview_loading')}</Typography>
                    </Stack>
                )}

                {previewState.status === 'ERROR' && (
                    <Stack alignItems="center" spacing={1} sx={{ color: 'error.main', p: 2 }}>
                        <AlertCircle size={32} />
                        <Typography variant="body2" textAlign="center">{previewState.message}</Typography>
                    </Stack>
                )}

                {previewState.status === 'SUCCESS' && (
                    <PreviewPlot previewData={previewState.response} />
                )}
            </Box>
            {/*<Button*/}
            {/*    size="small"*/}
            {/*    startIcon={<RefreshCw size={14} />}*/}
            {/*    onClick={performFetch}*/}
            {/*    disabled={!previewFormData.file || previewState.status === 'LOADING'}*/}
            {/*>*/}
            {/*    {t('preview_update')}*/}
            {/*</Button>*/}
        </Paper>
    );
};

export default PreviewWindow;