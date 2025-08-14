"use client"
import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import CustomModal from '@/components/ui/customModal';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { reactToastify } from '@/utils/toastify';


export default function PathLocation(props: { data: { active: boolean, info: any }, onClose: (done?: boolean) => void }) {
    const { data, onClose } = props
    const [loading, setLoading] = useState<boolean>(false)
    return (
        <CustomModal active={data.active} title={`ایجاد مسیر : ${data.info?.name}`} onClose={() => { onClose(false) }} loading={loading}>
            <ModalContent data={data} onClose={onClose} loading={loading} setLoading={setLoading} />
        </CustomModal>
    )
}

function ModalContent(props: { data: { active: boolean, info: any }, onClose: (done?: boolean) => void, loading: any, setLoading: any }) {
    const { data, onClose, loading, setLoading } = props
    const [pathList, setPathlist] = useState<any>([])



    function onSave() {
        setLoading(true)
        fetch(`/api/locations/${data.info.id}`, {
            method: "PUT",
            body: JSON.stringify({
                name: data.info.name,
                description: data.info.description,
                lat: data.info.lat,
                lng: data.info.lng,
                path: JSON.stringify(pathList),
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


    useEffect(() => {

        if (data.info?.path) {
            setPathlist(JSON.parse(data.info.path))
        }
    }, [data])


    return (
        <Box sx={{ width: "calc(100vw - 100px)", height: "calc(100vh - 250px)" }} display={"flex"} flexDirection={"column"}>
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


                <ClickHandler
                    onAdd={(location) => {
                        if (!loading) {
                            setPathlist((prevState: any) => {
                                const finalState = [...prevState, [location.lat, location.lng]]
                                return finalState
                            })
                        }
                    }}
                    onDelete={() => {
                        if (!loading) {
                            setPathlist((prevState: any) => {
                                if (prevState.length !== 0) {
                                    const finalPath = prevState.slice(0, -1)
                                    return finalPath
                                }
                                else {
                                    return []
                                }
                            })
                        }
                    }}
                />

                <Polyline pathOptions={{ color: 'black' }} positions={pathList} />
                <ChangeCursor />
            </MapContainer>
            
            <Box width={"100%"} pt={1} pb={1}>
                <Button variant="contained" onClick={() => { onSave() }} loading={loading} fullWidth>
                    ذخیره
                </Button>
            </Box>
        </Box>
    )
}

function ClickHandler({ onAdd, onDelete }: { onAdd: (location: any) => void, onDelete: () => void }) {
    useMapEvents({
        click(e) {
            onAdd(e.latlng)
        },
        contextmenu(e) {
            onDelete()
        },
    });
    return null;
}

function ChangeCursor() {
    const map = useMap();

    useEffect(() => {
        const container = map.getContainer();
        container.style.cursor = "crosshair"; // انواع: pointer, grab, crosshair, ...

        return () => {
            container.style.cursor = ""; // برگرداندن به حالت پیش‌فرض
        };
    }, [map]);

    return null;
}