import { alpha } from '@mui/material/styles';
import { gray } from '../themePrimitives';

export const feedbackCustomizations = {
  MuiDialog: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiDialog-paper': {
          borderRadius: '10px',
          border: '1px solid',
          borderColor: (theme.vars || theme).palette.divider,
        },
      }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 8,
        borderRadius: 8,
        backgroundColor: alpha(theme.palette.success.main, 0.1)
      }),
    },
  },
};
