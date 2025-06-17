"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { resolvedTheme } from "@/lib/theme" // Import resolvedTheme
import { cn } from "@/lib/utils"

// Chart container component
const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <div
      data-chart={chartId}
      ref={ref}
      className={cn(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
        className,
      )}
      {...props}
    >
      <ChartStyle id={chartId} config={config} />
      <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
    </div>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(([_, config]) => config.theme || config.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(config)
          .filter(([_, config]) => config.theme || config.color)
          .map(([key, itemConfig]) => {
            const color = itemConfig.theme?.[resolvedTheme] || itemConfig.color
            return color ? `  --color-${key}: ${color};` : null
          })
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
      config,
      ...props
    },
    ref,
  ) => {
    // Declare config variable
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value = !labelKey && typeof label === "string" ? config[label]?.label || label : itemConfig?.label

      if (labelFormatter) {
        return labelFormatter(label, payload)
      }

      return value
    }, [label, labelFormatter, payload, hideLabel, labelKey, config])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className,
        )}
        {...props}
      >
        {!nestLabel ? (
          <div className={cn("grid gap-1.5", !hideLabel && "pb-1.5")}>
            {tooltipLabel && <div className={cn("font-medium", labelClassName)}>{tooltipLabel}</div>}
            <div className="grid gap-1.5">
              {payload.map((item, index) => {
                const key = `${nameKey || item.name || item.dataKey || "value"}`
                const itemConfig = getPayloadConfigFromPayload(config, item, key)
                const indicatorColor = color || item.payload.fill || item.color

                return (
                  <div
                    key={item.dataKey}
                    className={cn(
                      "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                      indicator === "dot" && "items-center",
                    )}
                  >
                    {formatter && item?.value !== undefined && item.name ? (
                      formatter(item.value, item.name, item, index, item.payload)
                    ) : (
                      <>
                        {itemConfig?.icon ? (
                          <itemConfig.icon />
                        ) : (
                          !hideIndicator && (
                            <div
                              className={cn("shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]", {
                                "h-2.5 w-2.5": indicator === "dot",
                                "w-1": indicator === "line",
                                "w-0 border-[1.5px] border-solid border-[--color-bg]": indicator === "dashed",
                              })}
                              style={{
                                "--color-bg": indicatorColor,
                                "--color-border": indicatorColor,
                              }}
                            />
                          )
                        )}
                        <div
                          className={cn(
                            "flex flex-1 justify-between leading-none",
                            nestLabel ? "items-end" : "items-center",
                          )}
                        >
                          <div className="grid gap-1.5">
                            {nestLabel ? tooltipLabel : null}
                            <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
                          </div>
                          {item.value && (
                            <span className="font-mono font-medium tabular-nums text-foreground">
                              {item.value.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex basis-full items-center justify-between leading-none">
            <span className="text-muted-foreground">{tooltipLabel}</span>
            {payload[0].value && (
              <span className="font-mono font-medium tabular-nums text-foreground">
                {payload[0].value.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey, config, ...props }, ref) => {
    // Declare config variable
    if (!payload?.length) {
      return null
    }

    return (
      <ul
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" && "pb-3",
          verticalAlign === "bottom" && "pt-3",
          className,
        )}
        {...props}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <li
              key={item.value}
              className={cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                !hideIcon && (
                  <div
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                )
              )}
              {itemConfig?.label}
            </li>
          )
        })}
      </ul>
    )
  },
)
ChartLegendContent.displayName = "ChartLegendContent"

// Helper function to get payload config
const getPayloadConfigFromPayload = (config, payload, key) => {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload = payload.payload

  if (payloadPayload && typeof payloadPayload === "object" && "fill" in payloadPayload) {
    return getPayloadConfigFromPayload(config, payloadPayload, key)
  }

  const configLabelKey = Object.keys(config).find((configKey) => {
    return config[configKey]?.label === key
  })

  if (configLabelKey) {
    return config[configLabelKey]
  }

  return config[key]
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent }
