import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Stack, Modal, Divider, Box, CircularProgress } from '@mui/material';
import * as z from 'zod';
import { reactToastify } from '@/utils/toastify';




const schema = z.object({
    name: z.string().min(1, 'نام حداقل باید 1 کاراکتر باشد'),
    description: z.string()
});

export default function AddEditModal(props: { data: { active: boolean, info: any, currentLocation: any }, onClose: (done?: boolean) => void }) {
    const { data, onClose } = props
    const [loading, setLoading] = useState<boolean>(false)

    const handleClose = (e: any, reason: any) => {
        if (reason !== 'backdropClick') {
            onClose(false)
        }
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
                    <Box width={"100%"} padding={"10px"}>{data?.info ? "ویرایش" : "افزودن"} مکان {data?.info ? `(${data?.info.name})` : ""}</Box>
                    <Divider />
                </Box>

                <Box padding={"10px"} display={"flex"} flexDirection={"column"} flexGrow={1} sx={{ overflowY: "auto" }}>
                    <Form
                        info={data.info}
                        currentLocation={data.currentLocation}
                        done={() => {
                            onClose(true)
                        }}
                        setLoading={setLoading}
                    />
                </Box>

                <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    <Divider />
                    <Box p={"10px"} display={"flex"} justifyContent={"end"}>
                        <Button
                            sx={{ width: "100%" }}
                            variant="contained"
                            onClick={() => {
                                onClose(false)
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

function Form(props: { info: any, currentLocation: any, done: () => void, setLoading: any }) {
    const { info, done, currentLocation, setLoading } = props

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: info?.name ? `${info.name}` : "",
            description: info?.description ? `${info.description}` : ""
        },
        resolver: zodResolver(schema),
    });


    function onSubmit(data: any) {
        setLoading(true)

        fetch("/api/locations")
            .then((res) => res.json())
            .then((res) => {
                if (info) {
                    const allLocations = res
                    const findLocation = allLocations.find((item: any) => item.name === data.name)
                    if (findLocation && (findLocation.name !== info.name)) {
                        reactToastify({
                            type: "warning",
                            message: "نام تکراری است"
                        })
                        setLoading(false)
                    }
                    else {
                        fetch(`/api/locations/${info.id}`, {
                            method: "PUT",
                            body: JSON.stringify({
                                name: data.name.trim(),
                                description: data.description.trim(),
                                lat: data.lat,
                                lng: data.lng,
                                path: data.path,
                            }),
                        })
                            .then(() => {
                                reactToastify({
                                    type: "success",
                                    message: "عملیات با موفقیت انجام شد"
                                })
                                done()
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
                }
                else {
                    const allAlocations = res
                    const findLocation = allAlocations.find((item: any) => item.name === data.name)
                    if (findLocation) {
                        reactToastify({
                            type: "warning",
                            message: "نام تکراری است"
                        })
                        setLoading(false)
                    }
                    else {

                        const model = {
                            name: data.name.trim(),
                            description: data.description.trim(),
                            lat: currentLocation[0],
                            lng: currentLocation[1],
                            path: JSON.stringify([])
                        }
                        fetch("/api/locations", {
                            method: "POST",
                            body: JSON.stringify(model),
                        })
                            .then(() => {
                                reactToastify({
                                    type: "success",
                                    message: "عملیات با موفقیت انجام شد"
                                })
                                done()
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
                }
            })
            .catch((err) => {
                reactToastify({
                    type: "error",
                    message: "خطایی رخ داده است دوباره تلاش کنید"
                })
                setLoading(false)
            })
    }

    return (
        <Box sx={{ width: "100%", display: "flex", paddingTop: "20px" }}>
            <Box sx={{ width: "400px" }}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="نام"
                            {...register('name')}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            fullWidth
                        />
                        <TextField
                            type="text"
                            label="توضیحات"
                            {...register("description")}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            fullWidth
                            multiline
                            rows={4}
                        />
                        <Button type="submit" variant="contained">
                            ذخیره
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    )
}
