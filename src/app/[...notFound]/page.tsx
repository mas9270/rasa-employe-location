
import Link from "next/link";
import { Box, Typography } from "@mui/material";

export default function NotFoundPage() {


    return (
        <Box width={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"}>
            <Typography variant="h4">
                صفحه ای با این مشخصات یافت نشد
            </Typography>
            <Link href={"/"}>خانه</Link>
        </Box>
    )
}