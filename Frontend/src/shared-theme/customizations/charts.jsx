import { axisClasses, legendClasses, chartsGridClasses } from '@mui/x-charts';

import { gray } from '../../shared-theme/themePrimitives';

export const chartsCustomizations = {
  MuiChartsAxis: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${axisClasses.line}`]: {
          stroke: theme.palette.divider,
        },
        [`& .${axisClasses.tick}`]: { stroke: theme.palette.divider },
        [`& .${axisClasses.tickLabel}`]: {
          fill: theme.palette.text.secondary,
          fontWeight: 500,
        },
      }),
    },
  },
  MuiChartsTooltip: {
    styleOverrides: {
      mark: ({ theme }) => ({
        ry: 6,
        boxShadow: 'none',
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
      }),
      table: ({ theme }) => ({
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        background: 'hsl(0, 0%, 100%)',
      }),
    },
  },
  MuiChartsLegend: {
    styleOverrides: {
      root: {
        [`& .${legendClasses.mark}`]: {
          ry: 6,
        },
      },
    },
  },
  MuiChartsGrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${chartsGridClasses.line}`]: {
          stroke: theme.palette.divider,
          strokeDasharray: '4 2',
          strokeWidth: 0.8,
        },
      }),
    },
  },
};
