import { ThemeProvider as MuiProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { FC, ReactNode } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const theme = createTheme({
    typography: {
      fontFamily: 'inherit',
    }, // Para poder configurar el "Family font" a nivel global dentro de MUI, la fuente esta cargada en el archivo App.css
    palette: {
      primary: {
        light: '#6573c3',
        main: '#3f51b5',
        dark: '#2c387e',
        contrastText: '#fff',
      },
      secondary: {
        light: '#aa90d7',
        main: '#9575cd',
        dark: '#68518f',
        contrastText: '#fff',
      },
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiProvider theme={theme}>
        {children}
      </MuiProvider>
    </LocalizationProvider>
  )
}

export default ThemeProvider
