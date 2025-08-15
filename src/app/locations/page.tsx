"use client"
import { useEffect, useState } from "react";
import { reactToastify } from "@/utils/toastify";
import { Box, Button, CircularProgress } from "@mui/material";
import CustomFieldSet from "@/components/ui/customFieldset";
import ViewMap from "./mapCo/viewMap";
import ViewPath from "./pathCo/viewPath";
import ViewLocation from "./locationCo/viewLocation";
import { StructureInfo } from "./locationTypes";
// import { MapContainer, TileLayer, useMapEvents, Marker, Popup, Polyline, useMap } from "react-leaflet";
// import AddEditModal from "./components/addEdit";
// import DeleteModal from "./components/delete";
// import { DefaultIcon1, ColoredMarker } from "@/utils/leafletConfig";
// import PathLocation from "./components/pathLocation";
// import { getPathLength } from "geolib";
// import L from "leaflet";
// import "leaflet-polylinedecorator";






export default function LocationsPage() {
    const [structureInfo, setStructureInfo] = useState<StructureInfo>({
        loading: false,
        paths: {
            mode: "view",
            pathList: [],
            clickPathInfo: null
        },
        locations: {
            mode: "view",
            pathList: [],
            latLng: []
        },
    })

    useEffect(() => {
        console.log(structureInfo)
    }, [structureInfo])


    return (
        <Box
            sx={{
                width: "100%",
                position: "relative",
                display: "flex",
                flexDirection: { xs: "column", sm: "column", md: "row", lg: "row", xl: "row" },
                flex: 1,
                minHeight: 0
            }}
        >
            <Box
                sx={{
                    width: { xs: "100%", sm: "100%", md: "500px", lg: "500px", xl: "500px" },
                    display: "flex",
                    flexDirection: { xs: "row", sm: "row", md: "column", lg: "column", xl: "column" },
                    minHeight: 0,
                }}
            >
                <Box sx={{ width: "100%", height: { xs: "500px", sm: "500px", md: "50%", lg: "50%", xl: "50%" } }} p={1}>
                    <CustomFieldSet title="مسیر ها" width="100%" height="100%">
                        <ViewPath
                            structureInfo={structureInfo}
                            setStructureInfo={setStructureInfo}
                        />
                    </CustomFieldSet>
                </Box>
                <Box sx={{ width: "100%", height: { xs: "500px", sm: "500px", md: "50%", lg: "50%", xl: "50%" } }} p={1}>
                    <CustomFieldSet title="جایگاه ها" width="100%" height="100%">
                        <ViewLocation
                            structureInfo={structureInfo}
                            setStructureInfo={setStructureInfo}
                        />
                    </CustomFieldSet>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                    flex: 1
                }}
                p={1}
            >
                <CustomFieldSet title="نقشه" width="100%" flex={1}>
                    <ViewMap
                        structureInfo={structureInfo}
                        setStructureInfo={setStructureInfo}
                    />
                </CustomFieldSet>
            </Box>
        </Box>
    )
}



// export default function LocationsPage() {
//     const [currentLocation, setCurrentLocation] = useState<any>(null)
//     const [allLocations, setAllLocations] = useState<any>(null)
//     const [addEditLocation, setAddEditLocation] = useState<{ active: boolean, info: any, currentLocation: any }>({ active: false, info: null, currentLocation: null })
//     const [deleteLocation, setDeleteLocation] = useState<{ active: boolean, info: any, }>({ active: false, info: null })
//     const [pathLocation, setPathLocation] = useState<{ active: boolean, info: any, }>({ active: false, info: null })
//     const [loading, setLoading] = useState<boolean>(false)
//     const [currentLocationInfo, setCurrentLocationInfo] = useState<any>(null)


//     function addAction() {
//         setAddEditLocation({
//             active: true,
//             info: null,
//             currentLocation: currentLocation
//         })
//     }

//     function editAction(info: any) {
//         setAddEditLocation({
//             active: true,
//             info: info,
//             currentLocation: null
//         })
//     }

//     function deleteAction(info: any) {
//         setDeleteLocation({
//             active: true,
//             info: info
//         })
//     }

//     function actionBtn() {
//         return (
//             <Box component={"div"} width={"100%"} paddingBottom={"20px"} display={"flex"} gap={2}>
//                 <Button
//                     variant="contained"
//                     color="success"
//                     onClick={() => {
//                         getLocationList()
//                     }}
//                 >دریافت منطقه ها</Button>
//                 {currentLocationInfo && (
//                     <Button
//                         variant="contained"
//                         color="error"
//                         onClick={() => {
//                             setCurrentLocationInfo(null)
//                         }}
//                     >حذف نمایش مسیر {currentLocationInfo?.name}</Button>
//                 )}
//             </Box>
//         )
//     }

//     function getLocationList() {
//         setLoading(true)
//         fetch("/api/locations")
//             .then((res) => res.json())
//             .then((res) => {
//                 setAllLocations(res)
//                 setLoading(false)
//             })
//             .catch(() => {
//                 reactToastify({
//                     type: "error",
//                     message: "خطایی رخ داده است دوباره تلاش کنید"
//                 })
//                 setLoading(false)
//             })
//     }

//     function newLocation() {

//         return (
//             <Marker position={currentLocation} icon={ColoredMarker("blue")} >
//                 <Popup>
//                     <Box
//                         width={"100%"}
//                         display={"flex"}
//                         flexDirection={"column"}
//                         justifyContent={"center"}
//                         alignItems={"center"}
//                         sx={{ direction: "rtl", fontFamily: "IRANSansX" }}
//                     >
//                         <Box >
//                             عرض جعرافیایی : {currentLocation[0]}
//                         </Box>
//                         <Box >
//                             طول جفرافیایی: {currentLocation[1]}
//                         </Box>

//                         <Button sx={{ marginTop: "15px" }} variant="contained" onClick={() => { addAction() }} color="success" fullWidth>
//                             افزودن
//                         </Button>

//                     </Box>
//                 </Popup>
//             </Marker>
//         )
//     }

//     function pathAction(item: any) {
//         setPathLocation({ active: true, info: item })
//     }

//     function buidPathKilometr(item: any) {
//         const path = item?.path ? JSON.parse(item?.path) : []
//         const convertPath = path.map((item: any) => ({ lat: item[1], lng: item[1] }))
//         const distanceInMeters = getPathLength(convertPath);
//         const distanceInKm = (distanceInMeters / 1000).toFixed(2);
//         // console.log(distanceInKm, convertPath)
//         return `${distanceInKm} کیلومتر`
//     }

//     function allLocationsFu(item: any, index: number) {

//         return (
//             <Marker key={index} position={[item.lat, item.lng]} icon={ColoredMarker("green")}>
//                 <Popup>
//                     <Box
//                         width={"100%"}
//                         display={"flex"}
//                         flexDirection={"column"}
//                         justifyContent={"center"}
//                         alignItems={"center"}
//                         sx={{ direction: "rtl", fontFamily: "IRANSansX" }}
//                     >
//                         <Box mt={1}>
//                             نام : {item?.name}
//                         </Box>
//                         <Box mt={1}>
//                             توضیحات : {item?.description}
//                         </Box>
//                         <Box mt={1}>
//                             عرض جعرافیایی : {item.lat}
//                         </Box>
//                         <Box mt={1}>
//                             طول جفرافیایی: {item.lng}
//                         </Box >

//                         <Box mt={1}>طول مسیر : {buidPathKilometr(item)}</Box>

//                         <Box sx={{ width: "100%" }} display={"flex"} flexDirection={"column"} justifyContent={"center"} gap={1} mt={1}>
//                             <Box sx={{ width: "100%" }} display={"flex"} justifyContent={"center"} gap={1}>
//                                 <Button
//                                     sx={{ textWrap: "nowrap" }}
//                                     variant="contained"
//                                     color="info"
//                                     fullWidth size="small"
//                                     onClick={() => {
//                                         if (!item.path || (item.path && JSON.parse(item.path).length === 0)) {
//                                             reactToastify({
//                                                 type: "warning",
//                                                 message: `مسیری برای ${item?.name} تعیین نشده است`
//                                             })
//                                         }
//                                         else {
//                                             setCurrentLocationInfo(item)
//                                         }
//                                     }}
//                                 >
//                                     نمایش مسیر
//                                 </Button>
//                                 <Button sx={{ textWrap: "nowrap" }} variant="contained" onClick={() => { pathAction(item) }} color="info" fullWidth size="small">
//                                     ویرایش مسیر
//                                 </Button>
//                             </Box>
//                             <Box sx={{ width: "100%" }} display={"flex"} justifyContent={"center"} gap={1}>
//                                 <Button variant="contained" onClick={() => { editAction(item) }} color="success" fullWidth size="small">
//                                     ویرایش
//                                 </Button>
//                                 <Button variant="contained" onClick={() => { deleteAction(item) }} color="error" fullWidth size="small">
//                                     حذف
//                                 </Button>
//                             </Box>
//                         </Box>
//                     </Box>
//                 </Popup>
//             </Marker>
//         )
//     }

//     function loadingFu() {
//         return (
//             <Box sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 width: "100%",
//                 height: "100%",
//                 position: "absolute",
//                 right: 0,
//                 bottom: 0,
//                 left: 0,
//                 top: 0,
//                 zIndex: 100000,
//                 backgroundColor: "rgba(0,0,0,0.4)"
//             }}>
//                 <CircularProgress />
//             </Box>
//         )
//     }

//     useEffect(() => {
//         getLocationList()
//     }, [])

//     return (
//         <Box sx={{ width: "100%", position: "relative", display: "flex", flexDirection: "column", flex: 1 }}>

//             {actionBtn()}

//             <AddEditModal
//                 data={addEditLocation}
//                 onClose={(done) => {
//                     if (done) {
//                         getLocationList()
//                         setCurrentLocation(null)
//                         setCurrentLocationInfo(null)
//                     }
//                     setAddEditLocation({ active: false, info: null, currentLocation: null })
//                 }}
//             />

//             <DeleteModal
//                 data={deleteLocation}
//                 onClose={(done) => {
//                     if (done) {
//                         getLocationList()
//                         setCurrentLocationInfo(null)
//                     }
//                     setDeleteLocation({ active: false, info: null })
//                 }}
//             />

//             <PathLocation
//                 data={pathLocation}
//                 onClose={(done) => {
//                     if (done) {
//                         getLocationList()
//                         setCurrentLocationInfo(null)
//                     }
//                     setPathLocation({ active: false, info: null })
//                 }}
//             />

//             {loading && loadingFu()}

//             <Box sx={{ width: "100%" }}>
//                 <MapContainer
//                     center={[36.3206, 59.6168]}
//                     zoom={12} // زوم پیشنهادی برای دیدن کامل شهر
//                     style={{ width: "100%", height: "calc(100vh - 160px)" }}
//                 >
//                     {/* لایه نقشه */}
//                     <TileLayer
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//                     />

//                     {currentLocation && newLocation()}

//                     {allLocations && (allLocations.map((item: any, index: number) => allLocationsFu(item, index)))}

//                     {currentLocationInfo && (
//                         <Polyline
//                             pathOptions={{ color: '#0074D9', weight: 5, opacity: 0.8 }}
//                             positions={currentLocationInfo.path ? JSON.parse(currentLocationInfo.path) : []} />
//                     )}

//                     <ClickHandler
//                         rightClick={(location) => {
//                             setCurrentLocation([location.lat, location.lng])
//                         }}
//                         middleClick={() => {

//                         }}
//                     />

//                     <PolylineWithArrows positions={currentLocationInfo} />

//                 </MapContainer>
//             </Box>

//         </Box >
//     )
// }

// function ClickHandler({ rightClick, middleClick }: { rightClick: (location: any) => void, middleClick: (location: any) => void }) {
//     useMapEvents({
//         click(e) {
//             // callback(e.latlng)
//         },
//         contextmenu(e) {
//             rightClick(e.latlng)
//         },
//         mousedown(e) {
//             if (e.originalEvent.button === 1) {
//                 middleClick(e.latlng);
//             }
//         },
//     });
//     return null;
// }

// function PolylineWithArrows({ positions }: { positions: any }) {
//     const map = useMap();



//     useEffect(() => {
//         positions = positions?.path ? JSON.parse(positions.path) : []
//         const decorator = L.polylineDecorator(L.polyline(positions), {
//             patterns: [
//                 {
//                     offset: 0,
//                     repeat: 50, // فاصله بین فلش‌ها (پیکسل)
//                     symbol: L.Symbol.arrowHead({
//                         pixelSize: 10,
//                         polygon: false,
//                         pathOptions: { stroke: true, color: "red" },
//                     }),
//                 },
//             ],
//         });
//         decorator.addTo(map);

//         return () => {
//             map.removeLayer(decorator);
//         };
//     }, [map, positions]);

//     return null
// }