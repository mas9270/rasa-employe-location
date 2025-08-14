
"use client"
import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeTheme } from '../../store/slices/appTheme';

const ThemeSwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                content: '"🌙"',
            },
            '& + .MuiSwitch-track': {
                backgroundColor: '#8796A5',
                opacity: 1,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#FFC107',
        width: 32,
        height: 32,
        '&:before': {
            content: '"☀️"',
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    },
    '& .MuiSwitch-track': {
        borderRadius: 20 / 2,
        backgroundColor: '#aab4be',
        opacity: 1,
    },
}));

const ThemeToggle = () => {

    const theme = useAppSelector(state => state.appTheme.theme)
    const dispatch = useAppDispatch()

    return (
        <ThemeSwitch
            checked={theme === 'light'}
            onChange={() => {
                dispatch(changeTheme(theme === "light" ? "dark" : "light"))
            }} />
    );
};

export default ThemeToggle;