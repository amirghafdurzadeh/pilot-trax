"use client";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { getSellingGrowthDummyData } from "@/actions/sales";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Locale } from "@/lib/locales";

interface SellingChartProps {
  title: string;
  description: string;
  lang: Locale;
  chartLabel: string;
}

export function SellingChart({
  title,
  description,
  lang,
  chartLabel,
}: SellingChartProps) {
  const chartConfig = {
    income: {
      label: chartLabel,
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const sellingGrowthData = await getSellingGrowthDummyData(lang);
      setData(sellingGrowthData);
      setLoading(false);
    }
    fetchData();
  }, [lang]);

  if (loading) {
    return <Skeleton className="w-full h-80" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-income)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="income"
              type="natural"
              fill="url(#fillIncome)"
              fillOpacity={0.4}
              stroke="var(--color-income)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
