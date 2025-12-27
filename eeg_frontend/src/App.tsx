import React from "react";
import {darkTheme} from "./theme/theme.ts";
import {ThemeProvider, CssBaseline} from "@mui/material";
import RootContainer from "./components/toplevel/RootContainer.tsx";
import AppHeader from "./components/toplevel/AppHeader.tsx";
import AppFooter from "./components/toplevel/AppFooter.tsx";
import AppMainContainer from "./components/toplevel/AppMainContainer.tsx";
import {useTranslation} from "react-i18next";
import ConfigurationPage from "./components/config/ConfigurationPage.tsx";
import ResultsPage from "./components/result/ResultsPage.tsx";
import UselessComponent from "./components/common/UselessComponent.tsx";

export default function App(){
    const { t, i18n } = useTranslation();

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <RootContainer>
                <AppHeader headerText={t('header_appName')} resetText={t('header_resetBtn')}/>
                <AppMainContainer>
                    {/*<ConfigurationPage />*/}
                    <ResultsPage analysis={{
                        analysisId: 'uuid0',
                        analysisMode: "SINGLE",
                        experimentName: 'игра в mega man 4',
                        rhythms: ['ALPHA', 'BETA', 'DELTA', 'THETA'],
                        absolutePowers: [['ALPHA', 1], ['BETA', 9], ['DELTA', 7], ['THETA', 6]],
                        relativePowers: [['ALPHA', 0.2], ['BETA', 0.45], ['DELTA', 0.3], ['THETA', 0.15]],
                        dataByRhythm: {
                            'ALPHA': {
                                psdPlot: {
                                    data: [
                                        {x: 0, psd: 1},
                                        {x: 1, psd: 0.5},
                                        {x: 2, psd: 0.2},
                                        {x: 3, psd: 0.1}
                                    ]
                                },
                                signalPlot: {
                                    data: [
                                        {x: 0, raw: 2, filtered: 0},
                                        {x: 1, raw: 3, filtered: 1},
                                        {x: 2, raw: 2, filtered: 0},
                                        {x: 3, raw: 1, filtered: -1},
                                        {x: 4, raw: 2, filtered: 0},
                                    ]
                                }
                            }
                        }
                    }}/>
                    {/*<UselessComponent />*/}
                </AppMainContainer>
                <AppFooter footerText={t('footer_copyrightText')} />
            </RootContainer>
        </ThemeProvider>
    );
}