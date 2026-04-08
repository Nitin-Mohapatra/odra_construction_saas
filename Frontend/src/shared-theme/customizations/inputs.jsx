import { alpha } from '@mui/material/styles';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { svgIconClasses } from '@mui/material/SvgIcon';
import { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import { toggleButtonClasses } from '@mui/material/ToggleButton';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
// import { gray, brand } from '../themePrimitives';

export const inputsCustomizations = {
  MuiButtonBase: {
    defaultProps: {
      disableTouchRipple: true,
      disableRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        boxSizing: 'border-box',
        transition: 'all 100ms ease-in',
        '&:focus-visible': {
          outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          outlineOffset: '2px',
        },
      }),
    },
  },

  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: 'none',
        borderRadius: (theme.vars || theme).shape.borderRadius,
        textTransform: 'none',
        variants: [
          {
            props: { size: 'small' },
            style: {
              height: '2.25rem',
              padding: '8px 12px',
            },
          },
          {
            props: { size: 'medium' },
            style: {
              height: '2.5rem',
            },
          },

          // ✅ PRIMARY BUTTON (GREEN)
          {
            props: { color: 'primary', variant: 'contained' },
            style: {
              color: '#fff',
              backgroundColor: theme.palette.primary.main,
              border: `1px solid ${theme.palette.primary.dark}`,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              '&:active': {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          },

          // ✅ SECONDARY (DARK GREEN)
          {
            props: { color: 'secondary', variant: 'contained' },
            style: {
              color: '#fff',
              backgroundColor: theme.palette.secondary.main,
              border: `1px solid ${theme.palette.secondary.main}`,
              '&:hover': {
                backgroundColor: '#001f18',
              },
            },
          },

          // ✅ OUTLINED
          {
            props: { variant: 'outlined' },
            style: {
              color: theme.palette.text.primary,
              border: '1px solid',
              borderColor: theme.palette.divider,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.primary.main,
              },
            },
          },

          {
            props: { color: 'secondary', variant: 'outlined' },
            style: {
              color: theme.palette.secondary.main,
              border: '1px solid',
              borderColor: theme.palette.secondary.main,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              },
            },
          },

          // ✅ TEXT BUTTON
          {
            props: { variant: 'text' },
            style: {
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            },
          },

          {
            props: { color: 'secondary', variant: 'text' },
            style: {
              color: theme.palette.secondary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              },
            },
          },
        ],
      }),
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        boxShadow: 'none',
        borderRadius: (theme.vars || theme).shape.borderRadius,
        color: theme.palette.text.primary,
        border: '1px solid',
        borderColor: theme.palette.divider,
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          borderColor: theme.palette.primary.main,
        },
      }),
    },
  },

  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: '10px',
        boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
        [`& .${toggleButtonGroupClasses.selected}`]: {
          color: theme.palette.primary.main,
        },
      }),
    },
  },

  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: '12px 16px',
        borderRadius: '10px',
        fontWeight: 500,
      }),
    },
  },

  MuiCheckbox: {
    defaultProps: {
      disableRipple: true,
      icon: (
        <CheckBoxOutlineBlankRoundedIcon sx={{ color: 'transparent' }} />
      ),
      checkedIcon: <CheckRoundedIcon sx={{ height: 14, width: 14 }} />,
      indeterminateIcon: <RemoveRoundedIcon sx={{ height: 14, width: 14 }} />,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        margin: 10,
        height: 16,
        width: 16,
        borderRadius: 5,
        border: '1px solid',
        borderColor: theme.palette.divider,
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focusVisible': {
          outline: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
        },
        '&.Mui-checked': {
          color: '#fff',
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
      }),
    },
  },

  MuiInputBase: {
    styleOverrides: {
      root: { border: 'none' },
      input: {
        '&::placeholder': {
          opacity: 1,
          color: 'black',
        },
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      input: { padding: 0, },
      root: ({ theme }) => ({
        padding: '8px 12px',
        color: theme.palette.text.primary,
        borderRadius: (theme.vars || theme).shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
        '&:hover': {
          borderColor: theme.palette.primary.main,
        },
        [`&.${outlinedInputClasses.focused}`]: {
          outline: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          borderColor: theme.palette.primary.main,
        },
      }),
      notchedOutline: { border: 'none' },
    },
  },

  MuiInputAdornment: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.text.secondary,
      }),
    },
  },

  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        typography: theme.typography.caption,
        marginBottom: 8,
      }),
    },
  },
};