"use client"
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Box } from '@mui/material'

export default function Main(props: { children: React.ReactNode }) {
    const { children } = props
    const pathname = usePathname();
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
            <AnimatePresence mode="wait">
                <motion.div
                    key={pathname} // هر مسیر جدید یک key جدید می‌دهد
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        flex: 1,        // پر کردن فضای والد
                        display: 'flex', // ضروری برای flex-direction در children
                        flexDirection: 'column', // اگر children نیاز به column داشته باشد
                        minHeight: 0,   // جلوگیری از overflow در flex
                    }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </Box>
    )
}


