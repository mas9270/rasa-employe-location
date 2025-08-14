"use client"
import { Box, Button, useTheme } from "@mui/material";
import { LoginOutlined } from "@mui/icons-material"
import { reactToastify } from "@/utils/toastify";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogOutBtn() {
    const theme = useTheme()
    const router = useRouter()
    const pathname = usePathname()
    const [isVerify, setIsVeryfy] = useState<boolean>(false)

    function logout() {
        fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({})
        })
            .then((res) => {
                reactToastify({
                    type: "success",
                    message: "خروج با موفقیت انجام شد"
                })
                router.push("/")
            })
            .catch(() => {
                reactToastify({
                    type: "error",
                    message: "خطایی رخ داده است دوباره تلاش کنید"
                })
            })
    }

    function verify() {
        fetch("/api/auth/verify-token", {
            method: "GET",
            credentials: "include"
        })
            .then((res) => res.json())
            .then((res: any) => {
                if (res.verify) {
                    setIsVeryfy(true)
                }
                else {
                    setIsVeryfy(false)
                }
            })
            .catch(() => {
                setIsVeryfy(false)
            })
    }

    useEffect(() => {
        verify()
    }, [pathname])

    return (
        <>
            {isVerify && (
                <Box gap={1}>
                    <Button onClick={() => { logout() }} color={"error"}>
                        <LoginOutlined />
                    </Button>
                </Box>
            )}
        </>
    )
}