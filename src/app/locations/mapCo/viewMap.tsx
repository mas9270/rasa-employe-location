"use client"
import React, { useEffect, useState } from 'react'
import { Box, TextField } from "@mui/material";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { StructureInfo, StructureInfoSet } from '../locationTypes';
import { ColoredMarker } from '@/utils/leafletConfig';
import L from "leaflet";
import "leaflet-polylinedecorator";
import CustomFieldSet from '@/components/ui/customFieldset';
import SearchLocation from '@/components/ui/searchLocation';

export default function ViewMap(props: { structureInfo: StructureInfo, setStructureInfo: StructureInfoSet }) {
    const { structureInfo, setStructureInfo } = props
    const [seachLocation, setSearchLocation] = useState<any>([])

    function mapClick(location: any) {
        if (structureInfo.locations.mode === "add" || structureInfo.locations.mode === "edit") {
            setStructureInfo((prevState) => {
                return {
                    ...prevState,
                    locations: {
                        ...prevState.locations,
                        latLng: [location?.lat, location?.lng]
                    }
                }
            })
        }

        if (structureInfo.paths.mode === "add" || structureInfo.paths.mode === "edit") {
            setStructureInfo((prevState) => {
                return {
                    ...prevState,
                    paths: {
                        ...prevState.paths,
                        pathList: [...prevState.paths.pathList, [location?.lat, location?.lng]]
                    }
                }
            })
        }

    }

    function mapContext(location: any) {
        if (structureInfo.paths.mode === "add" || structureInfo.paths.mode === "edit") {
            setStructureInfo((prevState) => {
                return {
                    ...prevState,
                    paths: {
                        ...prevState.paths,
                        pathList: prevState.paths.pathList.slice(0, -1)
                    }
                }
            })
        }
    }

    function newLocation() {

        const currentLocation: any = structureInfo.locations.latLng ? structureInfo.locations.latLng : []
        if (currentLocation.length !== 2) {
            return null
        }
        return (
            <Marker position={currentLocation} icon={ColoredMarker("green")} >
                <Popup>
                    <Box
                        width={"100%"}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        sx={{ direction: "rtl", fontFamily: "IRANSansX" }}
                    >
                        <Box >
                            عرض جعرافیایی : {currentLocation[0]}
                        </Box>
                        <Box >
                            طول جفرافیایی: {currentLocation[1]}
                        </Box>
                    </Box>
                </Popup>
            </Marker>
        )
    }

    function newLocation1() {
        if (seachLocation.length !== 2) {
            return null
        }

        return (
            <Marker position={seachLocation} icon={ColoredMarker("red")} >
                <Popup>
                    <Box
                        width={"100%"}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        sx={{ direction: "rtl", fontFamily: "IRANSansX" }}
                    >
                        <Box >
                            عرض جعرافیایی : {seachLocation[0]}
                        </Box>
                        <Box >
                            طول جفرافیایی: {seachLocation[1]}
                        </Box>
                    </Box>
                </Popup>
            </Marker>
        )
    }

    return (
        <Box sx={{ width: "100%", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }} >
            <Box width={"100%"} display={"flex"} gap={1} mb={1}>
                <SearchLocation
                    onSearch={(searchLatLng) => {
                        setSearchLocation(searchLatLng ? searchLatLng : [])
                    }} />
            </Box>
            <Box sx={{ width: "100%", display: "flex", flex: 1, minHeight: 0 }}>
                <MapContainer center={[36.3206, 59.5800]} zoom={12} style={{ width: "100%", height: "100%", minHeight: "400px" }} >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />


                    {/* برای جستجو  */}
                    {seachLocation.length !== 0 && newLocation1()}
                    <FlyToPosition position={seachLocation} />

                    {/* برای جایگاه  */}
                    {structureInfo.locations.latLng?.length !== 0 && newLocation()}
                    <PolylineWithArrows positions={structureInfo.locations.pathList ? structureInfo.locations.pathList : []} />
                    {structureInfo.locations.pathList && (
                        <Polyline
                            pathOptions={{ color: '#0074D9', weight: 5, opacity: 0.8 }}
                            positions={structureInfo.locations.pathList}
                        />
                    )}

                    {/* برای مسیر */}
                    {structureInfo.paths.pathList && (
                        <Polyline
                            pathOptions={{ color: '#0074D9', weight: 5, opacity: 0.8 }}
                            positions={structureInfo.paths.pathList}
                        />
                    )}
                    {/* {structureInfo.paths.clickPathInfo?.path && (structureInfo.paths.pathList.length == 0) && (
                        <Polyline
                            pathOptions={{ color: '#0074D9', weight: 5, opacity: 0.8 }}
                            positions={JSON.parse(structureInfo.paths.clickPathInfo?.path)}
                        />
                    )} */}

                    <PolylineWithArrows positions={structureInfo.paths.pathList} />
                    {/* <PolylineWithArrows positions={structureInfo.paths.clickPathInfo?.path ? JSON.parse(structureInfo.paths.clickPathInfo?.path) : []} /> */}

                    {/* تنظمیات عمومی */}
                    <ClickHandler
                        onClick={(location) => {
                            mapClick(location)
                        }}
                        onContext={() => {
                            mapContext(location)
                        }}
                    />
                    <ChangeCursor />
                </MapContainer>
            </Box>
        </Box >
    )
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

function ClickHandler({ onClick, onContext }: { onClick: (location?: any) => void, onContext: (location?: any) => void }) {
    useMapEvents({
        click(e) {
            onClick(e.latlng)
        },
        contextmenu(e) {
            onContext(e.latlng)
        },
    });
    return null;
}

function PolylineWithArrows({ positions }: { positions: any }) {
    const map = useMap();

    useEffect(() => {
        const decorator = L.polylineDecorator(L.polyline(positions), {
            patterns: [
                {
                    offset: 0,
                    repeat: 50, // فاصله بین فلش‌ها (پیکسل)
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 10,
                        polygon: false,
                        pathOptions: { stroke: true, color: "red" },
                    }),
                },
            ],
        });
        decorator.addTo(map);

        return () => {
            map.removeLayer(decorator);
        };
    }, [map, positions]);

    return null
}

function FlyToPosition({ position }: { position: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        if (position && position[0] && position[1]) {
            map.flyTo(position, 13, { duration: 2 }); // duration به ثانیه
        }
    }, [position, map]);

    return null;
}
