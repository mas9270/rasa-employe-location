"use client"
import React from 'react';
import { Button, Modal, Divider, Box, CircularProgress, } from '@mui/material';



export default function CustomModal(props: { children?: React.ReactNode, active: boolean, loading?: boolean, title?: string, onClose: () => void }) {
    const { children, active, loading, title, onClose } = props

    const handleClose = (e: any, reason: any) => {
        if (reason !== 'backdropClick') {
            onClose()
        }
    }

    return (
        <Modal
            open={active}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: "auto",
                height: "auto",
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}>
                <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    <Box width={"100%"} padding={"10px"}>{title ? title : ""}</Box>
                    <Divider />
                </Box>

                <Box padding={"10px"} display={"flex"} flexDirection={"column"} flexGrow={1} sx={{ overflowY: "auto" }}>
                    {active && children}
                </Box>

                <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    <Divider />
                    <Box p={"10px"} display={"flex"} justifyContent={"end"}>
                        <Button
                            loading={loading}
                            sx={{ width: "100%" }}
                            variant="contained"
                            onClick={() => {
                                onClose()
                            }}
                            color='error'
                        >انصراف</Button>
                    </Box>
                </Box>

                {loading &&
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        }}>
                        <CircularProgress />
                    </Box>
                }
            </Box>
        </Modal >
    );
}



