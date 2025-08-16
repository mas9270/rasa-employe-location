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
        fetch(`/api/paths/${data.info.id}`, { method: "DELETE" })
            .then((res) => res.json())
            .then((res) => {
                if (res?.done) {
                    reactToastify({
                        type: "success",
                        message: "عملیات با موفقیت انجام شد"
                    })
                    onClose(true)
                }
                else {
                    reactToastify({
                        type: "warning",
                        message: res?.message
                    })
                }
                setLoading(false)
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
                width: { xs: "300px", sm: "400px" },
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
                            loading={loading}
                            sx={{ width: "100%" }}
                            variant="contained"
                            onClick={() => {
                                deleteAction()
                            }}
                            color='success'
                        >ذخیره</Button>
                        <Button
                            loading={loading}
                            sx={{ width: "100%" }}
                            variant="contained"
                            onClick={handleClose}
                            color='error'
                        >انصراف</Button>
                    </Box>
                </Box>
            </Box>
        </Modal >
    );
}

