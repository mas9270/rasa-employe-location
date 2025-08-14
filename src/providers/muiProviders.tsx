"use client"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import React, { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Box, CssBaseline } from '@mui/material';
import { changeTheme } from '../store/slices/appTheme';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import CircularProgress from '@mui/material/CircularProgress';


export default function MuiProviders(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <AppRouterCacheProvider>
            <ThemeConfig >
                {children}
            </ThemeConfig>
        </AppRouterCacheProvider>
    )
}


function ThemeConfig(props: { children: React.ReactNode }) {
    const { children } = props
    const dispatch = useAppDispatch()
    const appTheme = useAppSelector(state => state.appTheme.theme)
    const [theme, setTheme] = useState<any>(null)


    useEffect(() => {
        if (appTheme) {
            localStorage.setItem("theme", appTheme)
            themeConfig(appTheme, (currentTheme) => {
                setTheme(currentTheme)
            })
        }
        else {
            const localtheme = localStorage.getItem("theme")
            if (localtheme === "dark" || localtheme === "light") {
                dispatch(changeTheme(localtheme))
            }
            else {
                dispatch(changeTheme("light"))
            }
        }
    }, [appTheme])


    if (theme) {
        const rtlCache = createCache({
            key: 'muirtl',
            stylisPlugins: [prefixer, rtlPlugin]
            ,
        });

        return (
            <CacheProvider value={rtlCache}>
                <ThemeProvider theme={theme}>
                    {children}
                </ThemeProvider>
            </CacheProvider>
        )
    }

    return (
        <>
            <CssBaseline />
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh" }}><CircularProgress /></Box>
        </>
    )
}

function themeConfig(theme: string, callback: (theme: any) => void) {

    switch (theme) {
        case "dark":
            const dark = createTheme({
                direction: "rtl",
                palette: {
                    mode: 'dark',
                    // primary: {
                    //     main: '#90caf9', // آبی روشن
                    // },
                    // secondary: {
                    //     main: '#f48fb1', // صورتی کم‌رنگ
                    // },
                    // background: {
                    //     default: '#121212',
                    //     paper: '#1e1e1e',
                    // },
                    // text: {
                    //     primary: '#ffffff',
                    //     secondary: '#b0bec5',
                    // },
                },
                typography: {
                    fontFamily: [
                        'IRANSansX'
                    ].join(','),
                },
            });
            callback(dark)
            break;
        case "light":
            const light = createTheme({
                direction: "rtl",
                palette: {
                    mode: 'light',
                    // primary: {
                    //     main: '#1976d2', // آبی اصلی MUI
                    // },
                    // secondary: {
                    //     main: '#ff4081', // صورتی زنده
                    // },
                    // background: {
                    //     default: '#f5f5f5',
                    //     paper: '#ffffff',
                    // },
                },
                typography: {
                    fontFamily: [
                        'IRANSansX'
                    ].join(','),
                },
            });
            callback(light)
            break;
        default:
            break;
    }
}