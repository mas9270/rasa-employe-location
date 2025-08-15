"use client"
import * as React from "react";
import { Box, styled, useTheme } from "@mui/material";

const CustomFieldset = styled("fieldset")(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    padding: theme.spacing(2),
    margin: 0,
    minWidth: 0,
    color: theme.palette.text.primary,
    // backgroundColor:
    //     theme.palette.mode === "dark"
    //         ? theme.palette.grey[900]
    //         : theme.palette.grey[50],
    "& > legend": {
        padding: `0 ${theme.spacing(1)}`,
        fontSize: "0.9rem",
        color: theme.palette.text.secondary,
    },
}));

export default function CustomFieldSet(props: { children?: React.ReactNode, width?: string, title?: string, height?: string, flex?: number }) {
    const { children, width, height, title, flex } = props
    const theme = useTheme();

    return (
        <CustomFieldset sx={{ width: width ? width : "auto", height: height ? height : "auto", padding: "10px", flex: flex, display: 'flex', flexDirection: "column" }} >
            <legend>{title ? title : ""}</legend>
            {children}
        </CustomFieldset>
    );
}