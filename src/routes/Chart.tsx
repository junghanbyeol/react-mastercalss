import { useQuery } from "react-query";
import { fetchCoinHistory } from "./api";
import ApexChart from "react-apexcharts";
import Price from "./Price";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
interface ChartProps {
    coinId: string;
}
interface IHistorical {
    time_open: number;
    time_close: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}
function Chart({coinId}: ChartProps) {
    const {isLoading, data} = useQuery<IHistorical[]>(["ohlcv", coinId], () => fetchCoinHistory(coinId));
    const isDark = useRecoilValue(isDarkAtom);
    return <div>
        {isLoading ? (
            "loadingChart"
        ) : (
            <ApexChart 
                type="line" 
                series={[
                    {
                        name: "가격",
                        data: data?.map(price => price.close) as number[]
                    }
                ]}
                options={{
                    theme: {
                        mode: isDark ? "dark" : "light"
                    },
                    chart: {
                        height: 500, 
                        width: 500,
                        toolbar: {
                            show: false
                        },
                        background: "transparent",
                    },
                    grid: {
                        show: false
                    },
                    stroke: {
                        curve: "smooth",
                        width: 4
                    },
                    yaxis: {
                        show: false
                    },
                    xaxis: {
                        labels:{
                            show: false
                        },
                        axisTicks: {show: false},
                        axisBorder: {show: false},
                        type: "datetime",
                        categories: data?.map(price => new Date(price.time_close * 1000).toUTCString() )
                    },
                    fill: {
                        type: "gradient",
                        gradient: {
                            gradientToColors: ["blue"],
                            stops: [0, 100]
                        },
                        colors: ["red"],
                    },
                    tooltip: {
                        y: {
                            formatter: (value) => `$${value.toFixed(3)}`
                        }
                    }
                }}
            />
        )}
        </div>;
  }
  
  export default Chart;