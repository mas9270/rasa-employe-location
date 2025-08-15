import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Stack, Modal, Divider, Box, CircularProgress, InputAdornment, Autocomplete } from '@mui/material';
import * as z from 'zod';
import { reactToastify } from '@/utils/toastify';
import { LocationPin, MapRounded } from '@mui/icons-material';
import { StructureInfo, StructureInfoSet } from "../locationTypes";
import { getPathLength } from 'geolib';


const schema = z.object({
    name: z.string().min(1, 'نام حداقل باید 1 کاراکتر باشد'),
    description: z.string(),
});

interface AddEdit {
    data: {
        active: boolean,
        info: any,
        structureInfo: StructureInfo,
        setStructureInfo: StructureInfoSet
    },
    onClose: (done?: boolean) => void
}


export default function AddEdit(props: AddEdit) {
    const { data, onClose } = props
    const [loading, setLoading] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm({
        defaultValues: {
            name: data.info?.name ? `${data.info.name}` : "",
            description: data.info?.description ? `${data.info.description}` : "",
        },
        resolver: zodResolver(schema),
    });

    function buidPathKilometr(path: any) {
        const convertPath = path.map((item: any) => ({ lat: item[1], lng: item[1] }))
        const distanceInMeters = getPathLength(convertPath);
        const distanceInKm = (distanceInMeters / 1000).toFixed(2);
        return `${distanceInKm} کیلومتر`
    }

    function onSubmit(dataForm: any) {

        if (data.structureInfo.paths.pathList.length === 0) {
            reactToastify({
                type: "warning",
                message: "مسیر ایجاد نشده است"
            })
            return
        }
        data.setStructureInfo((prevState) => {
            return {
                ...prevState,
                loading: true
            }
        })
        setLoading(true)
        fetch("/api/paths")
            .then((res) => res.json())
            .then((res) => {

                if (data.info) {
                    const allPaths = res
                    const findPath = allPaths.find((item: any) => item.name === dataForm?.name)
                    if (findPath && (findPath.name !== dataForm.name)) {
                        reactToastify({
                            type: "warning",
                            message: "نام تکراری است"
                        })
                        data.setStructureInfo((prevState) => {
                            return {
                                ...prevState,
                                loading: false
                            }
                        })
                        setLoading(false)
                    }
                    else {
                        fetch(`/api/paths/${dataForm.id}`, {
                            method: "PUT",
                            body: JSON.stringify({
                                name: dataForm.name.trim(),
                                description: dataForm.description.trim(),
                                path: JSON.stringify(data.structureInfo.paths.pathList),
                            }),
                        })
                            .then(() => {
                                reactToastify({
                                    type: "success",
                                    message: "عملیات با موفقیت انجام شد"
                                })
                                onClose(true)
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
                    const allPaths = res
                    const findPath = allPaths.find((item: any) => item.name === dataForm.name)
                    if (findPath) {
                        reactToastify({
                            type: "warning",
                            message: "نام تکراری است"
                        })
                        data.setStructureInfo((prevState) => {
                            return {
                                ...prevState,
                                loading: false
                            }
                        })
                        setLoading(false)
                    }
                    else {

                        const model = {
                            name: dataForm.name.trim(),
                            description: dataForm.description.trim(),
                            path: JSON.stringify(data.structureInfo.paths.pathList)
                        }
                        fetch("/api/paths", {
                            method: "POST",
                            body: JSON.stringify(model),
                        })
                            .then(() => {
                                reactToastify({
                                    type: "success",
                                    message: "عملیات با موفقیت انجام شد"
                                })
                                onClose(true)
                                setLoading(false)
                            })
                            .catch(() => {
                                reactToastify({
                                    type: "error",
                                    message: "خطایی رخ داده است دوباره تلاش کنید"
                                })
                                data.setStructureInfo((prevState) => {
                                    return {
                                        ...prevState,
                                        loading: false
                                    }
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
                data.setStructureInfo((prevState) => {
                    return {
                        ...prevState,
                        loading: false
                    }
                })
                setLoading(false)
            })
    }

    useEffect(() => {
        if (data.info) {
            data.setStructureInfo((prevState) => {
                return {
                    ...prevState,
                    paths: {
                        ...prevState.paths,
                        pathList: data.info?.path ? JSON.parse(data.info?.path) : []
                    }
                }
            })
        }
    }, [])


    return (
        <Box sx={{ width: "100%", height: "100%", overflowY: "auto" }} pr={1} pl={1}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2} mt={1}>
                    <TextField
                        disabled={loading}
                        size='small'
                        label="نام"
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        fullWidth
                    />
                    <TextField
                        disabled={loading}
                        size='small'
                        type="text"
                        label="توضیحات"
                        {...register("description")}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        fullWidth
                        multiline
                        rows={2}
                    />
                    <Button type="submit" variant="contained" loading={loading}>
                        ذخیره
                    </Button>
                </Stack>
            </form>

            <Box sx={{ width: "100%" }}>
                {buidPathKilometr(data.structureInfo.paths.pathList)}
            </Box>
        </Box>
    )
}
