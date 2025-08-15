"use client"
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Stack, Modal, Divider, Box, CircularProgress, InputAdornment } from '@mui/material';
import * as z from 'zod';
import { reactToastify } from '../../../utils/toastify';
import { LocationCity, LocationCityOutlined, LocationPin } from '@mui/icons-material';
import CustomModal from '@/components/ui/customModal';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import { ColoredMarker } from '@/utils/leafletConfig';


const schema = z.object({
    name: z.string().min(1, 'نام حداقل باید 1 کاراکتر باشد'),
    nationalCode: z.string().min(10, 'کد ملی باید 10 کاراکتر باشد').max(10, "کد ملی باید 10 کاراکتر باشد"),
    description: z.string(),
    location: z.string().min(1, 'شناسه جایگاه را وارد کنید')
});

export default function AddEditModal(props: { data: { active: boolean, info: any }, onClose: (done?: boolean) => void }) {
    const { data, onClose } = props
    const [loading, setLoading] = useState<boolean>(false)



    return (
        <CustomModal
            active={data.active}
            title={`${data?.info ? "ویرایش" : "افزودن"} کاربر ${data?.info ? `(${data?.info.nationalCode})` : ""}`}
            loading={loading}
            onClose={() => {
                onClose(false)
            }}
        >
            <Form
                info={data.info}
                done={() => {
                    onClose(true)
                }}
                loading={loading}
                setLoading={setLoading}
            />
        </CustomModal>

    );
}

function Form(props: { info: any, done: () => void, setLoading: any, loading: boolean }) {
    const { info, done, setLoading, loading } = props
    const [locationModalInfo, setLocationModalInfo] = useState<{ active: boolean, info: any }>({ active: false, info: null })
    const [locationName, setLocationName] = useState<any>("")
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            name: info?.name ? `${info.name}` : "",
            nationalCode: info?.nationalCode ? `${info.nationalCode}` : "",
            description: info?.description ? `${info.description}` : "",
            location: info?.locationId ? info.locationId : 0
        },
        resolver: zodResolver(schema),
    });
    const currentLocationForm = watch("location")


    function onSubmit(data: any) {

        setLoading(true)
        fetch("/api/users")
            .then((res) => res.json())
            .then((res) => {

                if (info) {
                    const allUsers = res
                    const findNationalCode = allUsers.find((item: any) => item.nationalCode === data.nationalCode)
                    if (findNationalCode && (findNationalCode.nationalCode !== info.nationalCode)) {
                        reactToastify({
                            type: "warning",
                            message: "کد ملی تکراری است"
                        })
                        setLoading(false)
                    }
                    else {
                        fetch(`/api/users/${info.id}`, {
                            method: "PUT",
                            body: JSON.stringify({
                                name: data.name.trim(),
                                nationalCode: data.nationalCode.trim(),
                                description: data.description.trim(),
                                locationId: +data.location
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
                    const allUsers = res
                    const findNationalCode = allUsers.find((item: any) => item.nationalCode === data.nationalCode)
                    if (findNationalCode) {
                        reactToastify({
                            type: "warning",
                            message: "کد ملی تکراری است"
                        })
                        setLoading(false)
                    }
                    else {
                        fetch("/api/users", {
                            method: "POST",
                            body: JSON.stringify({
                                name: data.name.trim(),
                                nationalCode: data.nationalCode.trim(),
                                description: data.description.trim(),
                                locationId: +data.location
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

            })
            .catch(() => {
                reactToastify({
                    type: "error",
                    message: "خطایی رخ داده است دوباره تلاش کنید"
                })
                setLoading(false)
            })

    }


    useEffect(() => {
        setLoading(true)
        fetch("/api/locations")
            .then((res) => res.json())
            .then((res) => {
                const findName = res.find((item: any, inedx: number) => item.id === currentLocationForm)?.name
                setLocationName(findName)
                setLoading(false)
            })
    }, [currentLocationForm])

    return (
        <Box sx={{ width: { xs: "300px", sm: "400px" } }}>
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
                        label="کد ملی"
                        {...register("nationalCode")}
                        error={!!errors.nationalCode}
                        helperText={errors.nationalCode?.message}
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
                    <Box width={"100%"} display={"flex"}>
                        <TextField
                            onClick={(e) => {
                                setLocationModalInfo({ active: true, info: info })
                            }}
                            sx={{ cursor: "pointer" }}
                            label="شناسه جایگاه"
                            type='text'
                            slotProps={{
                                input: {
                                    startAdornment: <InputAdornment position="start"><LocationPin /></InputAdornment>,
                                    // readOnly: true,
                                },
                            }}
                            {...register("location")}
                            fullWidth
                        />
                        <TextField
                            disabled={true}
                            value={locationName}
                            sx={{ cursor: "pointer" }}
                            // label="نام منطقه"
                            type='text'
                            fullWidth
                        // slotProps={{
                        //     input: {
                        //         readOnly: true,
                        //     },
                        // }}
                        />
                    </Box>
                    <Button type="submit" variant="contained" loading={loading}>
                        ذخیره
                    </Button>
                </Stack>
            </form>
            <GetLocation
                currentLocationForm={currentLocationForm}
                locationModalInfo={locationModalInfo}
                onClose={(locationId) => {
                    if (locationId) {
                        setValue("location", locationId)
                    }
                    setLocationModalInfo({ active: false, info: null })
                }}
            />
        </Box>
    )
}

function GetLocation(props: { locationModalInfo: any, onClose: (locationId?: any) => void, currentLocationForm: any }) {
    const { locationModalInfo, onClose, currentLocationForm } = props
    const [loading, setLoading] = useState<boolean>(false)
    const [allLocations, setAllLocations] = useState<any>(null)


    function getLocationList() {
        setLoading(true)
        fetch("/api/locations")
            .then((res) => res.json())
            .then((res) => {
                setAllLocations(res)
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

    useEffect(() => {
        getLocationList()
    }, [])

    function currentMap() {
        return (
            <Box
                sx={{ width: { xs: "300px", sm: "400px", md: "600px", lg: "700px" }, height: "400px", position: "relative" }}
            >
                <MapContainer
                    center={[36.3206, 59.6168]}
                    zoom={12} // زوم پیشنهادی برای دیدن کامل شهر
                    style={{ width: "600px", height: "400px" }}
                >
                    {/* لایه نقشه */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />

                    {allLocations && (
                        allLocations.map((item: any, index: number) => {
                            return (
                                <Marker
                                    key={index}
                                    position={[item.lat, item.lng]}
                                    icon={ColoredMarker(+currentLocationForm === item.id ? "blue" : "green")}
                                >
                                    <Popup>
                                        <Box
                                            width={"100%"}
                                            display={"flex"}
                                            flexDirection={"column"}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                            sx={{ direction: "rtl", fontFamily: "IRANSansX" }}
                                        >
                                            <Box mt={1}>
                                                نام : {item?.name}
                                            </Box>
                                            <Box mt={1}>
                                                توضیحات : {item?.description}
                                            </Box>
                                            <Box mt={1}>
                                                عرض جعرافیایی : {item.lat}
                                            </Box>
                                            <Box mt={1}>
                                                طول جفرافیایی: {item.lng}
                                            </Box>

                                            <Box sx={{ width: "100%" }} display={"flex"} justifyContent={"center"} gap={1} mt={1}>
                                                <Button variant="contained" onClick={() => { onClose(item.id) }} color="success" fullWidth>
                                                    انتخاب
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Popup>
                                </Marker>
                            )
                        })
                    )}

                </MapContainer>
                {loading && (
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        left: 0,
                        top: 0,
                        zIndex: 100000,
                        backgroundColor: "rgba(0,0,0,0.4)"
                    }}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        )
    }

    return (
        <CustomModal
            active={locationModalInfo.active}
            onClose={() => (onClose())}
        >
            {currentMap()}
        </CustomModal>
    )
}
