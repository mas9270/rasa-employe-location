"use client"
import { useState } from 'react';
import { Button, Modal, Divider, Box, CircularProgress } from '@mui/material';
import { reactToastify } from '../../../utils/toastify';



export default function DeleteModal(props: { data: { active: boolean, info: any }, onClose: (done?: boolean) => void }) {
    const { data, onClose } = props
    const handleClose = () => onClose(false);
    const [loading, setLoading] = useState<boolean>(false)

    function deleteAction() {
        setLoading(true)
        fetch(`/api/locations/${data.info.id}`, { method: "DELETE" })
            .then(() => {
                reactToastify({
                    type: "success",
                    message: "عملیات با موفقیت انجام شد"
                })
                setLoading(false)
                onClose(true)
            })
            .catch(() => {
                reactToastify({
                    type: "error",
                    message: "خطایی رخ داده است دوباره تلاش کنید"
                })
                setLoading(false)
            })
    }

    return (
        <Modal
            open={data.active}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: "400px",
                height: "auto",
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}>
                <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    <Box width={"100%"} padding={"10px"}>حذف مکان {data.info && `(${data.info.name})`}</Box>
                    <Divider />
                </Box>

                <Box padding={"10px"} display={"flex"} flexDirection={"column"} flexGrow={1} sx={{ overflowY: "auto" }}>
                    <Box width={"100"} height={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        آیا از انجام این عملیات اطمینان دارید؟
                    </Box>
                </Box>

                <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    <Divider />
                    <Box p={"10px"} display={"flex"} justifyContent={"end"} gap={2}>
                        <Button
                            sx={{ width: "100%" }}
                            variant="contained"
                            onClick={() => {
                                deleteAction()
                            }}
                            color='success'
                        >ذخیره</Button>
                        <Button
                            sx={{ width: "100%" }}
                            variant="contained"
                            onClick={handleClose}
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

