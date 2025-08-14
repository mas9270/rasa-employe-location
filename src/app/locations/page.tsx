"use client"
import { reactToastify } from "@/utils/toastify";
import { Box, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, Polyline } from "react-leaflet";
import AddEditModal from "./components/addEdit";
import DeleteModal from "./components/delete";
import { DefaultIcon1, ColoredMarker } from "@/utils/leafletConfig";
import PathLocation from "./components/pathLocation";

export default function LocationsPage() {
    const [currentLocation, setCurrentLocation] = useState<any>(null)
    const [allLocations, setAllLocations] = useState<any>(null)
    const [addEditLocation, setAddEditLocation] = useState<{ active: boolean, info: any, currentLocation: any }>({ active: false, info: null, currentLocation: null })
    const [deleteLocation, setDeleteLocation] = useState<{ active: boolean, info: any, }>({ active: false, info: null })
    const [pathLocation, setPathLocation] = useState<{ active: boolean, info: any, }>({ active: false, info: null })
    const [loading, setLoading] = useState<boolean>(false)
    const [currentLocationInfo, setCurrentLocationInfo] = useState<any>(null)


    function addAction() {
        setAddEditLocation({
            active: true,
            info: null,
            currentLocation: currentLocation
        })
    }

    function editAction(info: any) {
        setAddEditLocation({
            active: true,
            info: info,
            currentLocation: null
        })
    }

    function deleteAction(info: any) {
        setDeleteLocation({
            active: true,
            info: info
        })
    }

    function actionBtn() {
        return (
            <Box component={"div"} width={"100%"} paddingBottom={"20px"} display={"flex"} gap={2}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                        getLocationList()
                    }}
                >دریافت منطقه ها</Button>
                {currentLocationInfo && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            setCurrentLocationInfo(null)
                        }}
                    >حذف نمایش مسیر {currentLocationInfo?.name}</Button>
                )}
            </Box>
        )
    }

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

    function newLocation() {

        return (
            <Marker position={currentLocation} icon={ColoredMarker("blue")} >
                <Popup>
                    <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} sx={{ direction: "rtl" }}>
                        <Box >
                            عرض جعرافیایی : {currentLocation[0]}
                        </Box>
                        <Box >
                            طول جفرافیایی: {currentLocation[1]}
                        </Box>

                        <Button sx={{ marginTop: "15px" }} variant="contained" onClick={() => { addAction() }} color="success" fullWidth>
                            افزودن
                        </Button>

                    </Box>
                </Popup>
            </Marker>
        )
    }

    function pathAction(item: any) {
        setPathLocation({ active: true, info: item })
    }

    function allLocationsFu(item: any, index: number) {

        return (
            <Marker key={index} position={[item.lat, item.lng]} icon={ColoredMarker("green")}>
                <Popup>
                    <Box width={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} sx={{ direction: "rtl" }}>
                        <Box >
                            نام : {item?.name}
                        </Box>
                        <Box >
                            توضیحات : {item?.description}
                        </Box>
                        <Box >
                            عرض جعرافیایی : {item.lat}
                        </Box>
                        <Box >
                            طول جفرافیایی: {item.lng}
                        </Box>

                        <Box sx={{ width: "100%" }} display={"flex"} flexDirection={"column"} justifyContent={"center"} gap={1} mt={3}>
                            <Box sx={{ width: "100%" }} display={"flex"} justifyContent={"center"} gap={1}>
                                <Button
                                    sx={{ textWrap: "nowrap" }}
                                    variant="contained"
                                    color="info"
                                    fullWidth size="small"
                                    onClick={() => {
                                        if (!item.path || (item.path && JSON.parse(item.path).length === 0)) {
                                            reactToastify({
                                                type: "warning",
                                                message: `مسیری برای ${item?.name} تعیین نشده است`
                                            })
                                        }
                                        else {
                                            setCurrentLocationInfo(item)
                                        }
                                    }}
                                >
                                    نمایش مسیر
                                </Button>
                                <Button sx={{ textWrap: "nowrap" }} variant="contained" onClick={() => { pathAction(item) }} color="info" fullWidth size="small">
                                    ویرایش مسیر
                                </Button>
                            </Box>
                            <Box sx={{ width: "100%" }} display={"flex"} justifyContent={"center"} gap={1}>
                                <Button variant="contained" onClick={() => { editAction(item) }} color="success" fullWidth size="small">
                                    ویرایش
                                </Button>
                                <Button variant="contained" onClick={() => { deleteAction(item) }} color="error" fullWidth size="small">
                                    حذف
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Popup>
            </Marker>
        )
    }

    function loadingFu() {
        return (
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
        )
    }

    useEffect(() => {
        getLocationList()
    }, [])

    return (
        <Box sx={{ width: "100%", position: "relative" }}>

            {actionBtn()}

            <AddEditModal
                data={addEditLocation}
                onClose={(done) => {
                    if (done) {
                        getLocationList()
                        setCurrentLocation(null)
                        setCurrentLocationInfo(null)
                    }
                    setAddEditLocation({ active: false, info: null, currentLocation: null })
                }}
            />

            <DeleteModal
                data={deleteLocation}
                onClose={(done) => {
                    if (done) {
                        getLocationList()
                        setCurrentLocationInfo(null)
                    }
                    setDeleteLocation({ active: false, info: null })
                }}
            />

            <PathLocation
                data={pathLocation}
                onClose={(done) => {
                    if (done) {
                        getLocationList()
                        setCurrentLocationInfo(null)
                    }
                    setPathLocation({ active: false, info: null })
                }}
            />

            <MapContainer
                center={[36.3206, 59.6168]}
                zoom={12} // زوم پیشنهادی برای دیدن کامل شهر
                style={{ width: "100%", height: "calc(100vh - 200px)" }}
            >
                {/* لایه نقشه */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {currentLocation && newLocation()}

                {allLocations && (allLocations.map((item: any, index: number) => allLocationsFu(item, index)))}

                {currentLocationInfo && (
                    <Polyline
                        pathOptions={{ color: 'black' }}
                        positions={currentLocationInfo.path ? JSON.parse(currentLocationInfo.path) : []} />
                )}

                <ClickHandler
                    rightClick={(location) => {
                        setCurrentLocation([location.lat, location.lng])
                    }}
                    middleClick={() => {

                    }}
                />

            </MapContainer>

            {loading && loadingFu()}
        </Box >
    )
}

function ClickHandler({ rightClick, middleClick }: { rightClick: (location: any) => void, middleClick: (location: any) => void }) {
    useMapEvents({
        click(e) {
            // callback(e.latlng)
        },
        contextmenu(e) {
            rightClick(e.latlng)
        },
        mousedown(e) {
            if (e.originalEvent.button === 1) {
                middleClick(e.latlng);
            }
        },
    });
    return null;
}