import { useMemo } from "react";
import type { ForecastData } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Line,
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";

interface HourlyTemperatureProps {
  data: ForecastData;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Temperature</span>
            <span className="font-bold">{payload[0].value}°</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">Feels Like</span>
            <span className="font-bold">{payload[1].value}°</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const HourlyTemperature = ({ data }: HourlyTemperatureProps) => {
  const chartData = useMemo(
    () =>
      data.list.slice(0, 8).map((item) => ({
        time: format(new Date(item.dt * 1000), "ha"),
        temp: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like),
      })),
    [data]
  );

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Today's Temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2562eb" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#2562eb" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />

              <XAxis
                dataKey="time"
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}°`}
              />
              <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />

              <Line
                type="natural"
                dataKey="temp"
                stroke="#2562eb"
                strokeWidth={2.5}
                fill="url(#tempGradient)"
                dot={false}
                isAnimationActive
                animationDuration={250}
                animationEasing="ease-in-out"
              />
              <Line
                type="natural"
                dataKey="feels_like"
                stroke="#64748b"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 4"
                isAnimationActive
                animationDuration={250}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyTemperature;
