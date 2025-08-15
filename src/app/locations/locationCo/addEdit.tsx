import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Stack, Modal, Divider, Box, CircularProgress, InputAdornment, Autocomplete } from '@mui/material';
import * as z from 'zod';
import { reactToastify } from '@/utils/toastify';
import { LocationPin, MapRounded } from '@mui/icons-material';
import { StructureInfo, StructureInfoSet } from "../locationTypes";

const schema = z.object({
    name: z.string().min(1, 'نام حداقل باید 1 کاراکتر باشد'),
    description: z.string(),
    pathId: z.string().min(1, 'شناسه مسیر را  وارد کنید'),
    lat: z.string().min(1, 'عرض جغرافیایی را وارد کنید'),
    lng: z.string().min(1, 'طول جغرافیایی را وارد کنید'),
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
            pathId: data.info?.pathId ? `${data.info.pathId}` : "",
            lat: data.info?.lat ? `${data.info.lat}` : "",
            lng: data.info?.lng ? `${data.info.lng}` : "",
        },
        resolver: zodResolver(schema),
    });

    const [pathInputValue, setPathInputValue] = useState<any>("");
    const [pathOptions, setPathOptions] = useState<{ label: string; value: string }[]>([]);
    const selectedPathId = watch("pathId");



    function onSubmit(formData: any) {
        data.setStructureInfo((prevState) => {
            return {
                ...prevState,
                loading: true
            }
        })
        setLoading(true)
        fetch("/api/locations")
            .then((res) => res.json())
            .then((res) => {
                if (data.info) {
                    const allLocations = res
                    const findLocation = allLocations.find((item: any) => item.name === formData.name)
                    if (findLocation && (findLocation.name !== formData.name)) {
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
                        fetch(`/api/locations/${formData.id}`, {
                            method: "PUT",
                            body: JSON.stringify({
                                name: formData.name.trim(),
                                description: formData.description.trim(),
                                lat: +formData.lat,
                                lng: +formData.lng,
                                pathId: +formData.pathId,
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
                else {
                    const allAlocations = res
                    const findLocation = allAlocations.find((item: any) => item.name === formData.name.trim())
                    if (findLocation) {
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
                            name: formData.name.trim(),
                            description: formData.description.trim(),
                            lat: +formData.lat,
                            lng: +formData.lng,
                            path: +formData.pathId
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
                setLoading(false)
            })
    }

    useEffect(() => {
        // data.setStructureInfo((prevState) => {
        //     return {
        //         ...prevState,
        //         loading: true
        //     }
        // })
        setLoading(true)
        fetch("/api/paths")
            .then((res) => res.json())
            .then((res) => {
                const finalRes = res.map((item: any) => ({ label: `${item.id} - ${item.name}`, value: `${item.id}` }))
                setPathOptions(finalRes)
                setLoading(false)
            })
            .catch(() => {
                reactToastify({
                    type: "error",
                    message: "خطایی رخ داده است دوباره تلاش کنید"
                })
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        if ((data.structureInfo.locations.mode === "add" ||
            data.structureInfo.locations.mode === "edit") &&
            data.structureInfo.locations.latLng &&
            data.structureInfo.locations.latLng.length !== 0
        ) {
            setValue("lat", `${data.structureInfo.locations.latLng[0]}`)
            setValue("lng", `${data.structureInfo.locations.latLng[1]}`)
        }
    }, [data.structureInfo.locations.latLng])

    useEffect(() => {
        if (selectedPathId) {
            data.setStructureInfo((prevState) => {
                return {
                    ...prevState,
                    loading: true
                }
            })
            setLoading(true)
            fetch(`/api/locations/${selectedPathId}`)
                .then((res) => res.json())
                .then((res) => {
                    data.setStructureInfo((prevState) => {
                        return {
                            ...prevState,
                            loading: false,
                            locations: {
                                ...prevState.locations,
                                pathList: JSON.parse(res.path)
                            }
                        }
                    })
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
    }, [selectedPathId])

    useEffect(() => {
        if (data.info) {
            data.setStructureInfo((prevState) => {
                return {
                    ...prevState,
                    locations: {
                        ...prevState.locations,
                        latLng: [data.info.lat, data.info.lng]
                    }
                }
            })
        }

        return () => {
            data.setStructureInfo((prevState) => {
                return {
                    ...prevState,
                    loading: false,
                    locations: {
                        ...prevState.locations,
                        latLng: [],
                        pathList: []
                    }
                }
            })
        }
    }, [data.info])

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
                    <Box width="100%" display="flex" gap={1}>
                        <Autocomplete
                            disabled={loading}
                            fullWidth
                            options={pathOptions}
                            value={pathOptions.find((o) => o.value === selectedPathId) ?? null}
                            onChange={(_, option) => {
                                setValue("pathId", option?.value ?? "", { shouldValidate: true });
                            }}
                            inputValue={pathInputValue}
                            onInputChange={(_, newInputValue) => setPathInputValue(newInputValue)}
                            isOptionEqualToValue={(a, b) => a.value === b.value}
                            getOptionLabel={(o) => o.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    label="شناسه مسیر"
                                    size="small"
                                    error={!!errors.pathId}
                                    helperText={errors.pathId?.message}
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            startAdornment:
                                                <InputAdornment position="start">
                                                    <MapRounded />
                                                </InputAdornment>,
                                        },
                                    }}
                                />
                            )}
                        />
                    </Box>
                    <Box width={"100%"} display={"flex"} gap={1}>
                        <TextField
                            disabled={loading}
                            size='small'
                            label="عرض جغرافیایی"
                            {...register('lat')}
                            error={!!errors.lat}
                            helperText={errors.lat?.message}
                            fullWidth
                            slotProps={{
                                input: {
                                    startAdornment: <InputAdornment position="start"><LocationPin /></InputAdornment>,
                                    readOnly: true,
                                },
                            }}
                        />
                        <TextField
                            disabled={loading}
                            size='small'
                            label="طول جغرافیایی"
                            {...register('lng')}
                            error={!!errors.lng}
                            helperText={errors.lng?.message}
                            fullWidth
                            slotProps={{
                                input: {
                                    startAdornment: <InputAdornment position="start"><LocationPin /></InputAdornment>,
                                    readOnly: true,
                                },
                            }}
                        />
                    </Box>
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
        </Box>
    )
}
