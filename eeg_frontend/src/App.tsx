import React from "react";
import {darkTheme} from "./theme/theme.ts";
import {ThemeProvider, CssBaseline} from "@mui/material";
import RootContainer from "./components/toplevel/RootContainer.tsx";
import AppHeader from "./components/toplevel/AppHeader.tsx";
import AppFooter from "./components/toplevel/AppFooter.tsx";
import AppMainContainer from "./components/toplevel/AppMainContainer.tsx";
import {useTranslation} from "react-i18next";
import ModeConfigurationBlock from "./components/config/ModeConfigurationBlock.tsx";
import ConfigurationBlock from "./components/config/ConfigurationBlock.tsx";
import {Upload, Activity} from "lucide-react";
import {color} from "@mui/system";
import FileDropzone from "./components/config/FileDropzone.tsx";
import ConfigurationPage from "./components/config/ConfigurationPage.tsx";

export default function App(){
    const { t, i18n } = useTranslation();

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <RootContainer>
                <AppHeader headerText={t('header_appName')} resetText={t('header_resetBtn')}/>
                <AppMainContainer>
                    <ConfigurationPage />
                </AppMainContainer>
                <AppFooter footerText={t('footer_copyrightText')} />
            </RootContainer>
        </ThemeProvider>
    );
}