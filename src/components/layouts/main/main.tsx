
import { Box } from '@mui/material'

export default function Main(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <Box
            component={"main"}
            sx={{
                flexGrow: 1,
                p: 2,
                width: '100%',
                boxSizing: 'border-box', // تضمین اینکه padding به ابعاد اضافه نشه
                overflowX: 'hidden',     // جلوگیری از scroll افقی,
                height: "100%",
                display: 'flex',
                flexDirection: "column"
            }}>
            {children}
        </Box>
    )
}


