"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface Metric {
  label: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease";
  icon: LucideIcon;
  color: string;
}

interface MetricCardProps {
  metric: Metric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const Icon = metric.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </CardTitle>
        <Icon className={`h-4 w-4 ${metric.color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {typeof metric.value === "number" && metric.value < 100
            ? metric.value.toFixed(1)
            : metric.value.toLocaleString()}
          {metric.label.includes("Time") && "s"}
        </div>
        <div className="flex items-center text-xs">
          {metric.changeType === "increase" ? (
            <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
          )}
          <span
            className={
              metric.changeType === "increase"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {Math.abs(metric.change)}%
          </span>
          <span className="text-muted-foreground ml-1">from last period</span>
        </div>
      </CardContent>
    </Card>
  );
}
