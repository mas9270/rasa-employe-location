
import { Box, AppBar, Toolbar, Typography } from '@mui/material'

import ThemeSwitch from '../../ui/themeSwitch'
import SwipeableTemporaryDrawer from '../../ui/layoutDrawer'
import LogOutBtn from '@/components/ui/logOutbtn'


export default function Header() {

    return (
        <>
            <AppBar position="static" >
                <Toolbar >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: "start",
                            alignItems: 'center',
                            width: '100%',
                        }}>
                            <Box sx={{ paddingRight: "5px", paddingLeft: "5px" }}>
                                <SwipeableTemporaryDrawer />
                            </Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: "center",
                            alignItems: 'center',
                            width: '100%',
                        }}>
                            <Box sx={{ paddingRight: "5px", paddingLeft: "5px" }}>
                                <Typography variant='h6'>منطقه کارمندان</Typography>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: "end",
                                alignItems: 'center',
                                width: '100%',
                            }}
                            gap={1}
                        >
                            <LogOutBtn />
                            <Box >
                                <ThemeSwitch />
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}