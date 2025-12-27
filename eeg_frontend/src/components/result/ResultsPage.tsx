import ResultsBlock from "./ResultsBlock.tsx";
import {BrainCircuit} from "lucide-react";
import LinePlotVisualizer from "./LinePlotVisualizer.tsx";
import LinePlotPairBlock from "./LinePlotPairBlock.tsx";

const ResultsPage = () => {
    return (
        <>
            <LinePlotPairBlock headerText={"vnm"} headerIcon={<BrainCircuit size={18} />} plotPair={{
                psdPlot: {
                    xAxisName: 'Time',
                    yAxisName: 'PSD',
                    area: true,
                    yLogarithmic: true,
                    seriesMetadata: [
                            { dataKey: "psd", legend: "PSD", preferredColor: 'secondary' },
                    ],
                    data: [
                        { x: 0, psd: 1e-1 },
                        { x: 1, psd: 3e-2 },
                        { x: 2, psd: 6e-3 },
                        { x: 3, psd: 1e-3 },
                        { x: 4, psd: 1.5e-4 },
                    ]
                },
                signalPlot: {
                    xAxisName: 'Time',
                    yAxisName: 'Signal',
                    area: false,
                    seriesMetadata: [
                        { dataKey: "raw", legend: "Raw", preferredColor: 'secondary' },
                        { dataKey: "filtered", legend: "Filtered", preferredColor: 'warning' }
                    ],
                    data: [
                        { x: 0, raw: 2.5, filtered: 0 },
                        { x: 0.25, raw: 2.4, filtered: -0.1 },
                        { x: 0.5, raw: 2.6, filtered: 0.1 },
                        { x: 0.75, raw: 2.5, filtered: 0 },
                        { x: 1, raw: 2.3, filtered: -0.2 },
                        { x: 1.25, raw: 2.7, filtered: 0.2 },
                        { x: 1.5, raw: 2.0, filtered: -0.5 },
                        { x: 1.75, raw: 3.0, filtered: 0.5 },
                        { x: 2, raw: 2.5, filtered: 0 },
                        { x: 4.75, raw: 2, filtered: -0.5 },
                        { x: 5, raw: 2.5, filtered: -0.1 },
                    ]
                }
            }} />
        </>
    );
}

export default ResultsPage;