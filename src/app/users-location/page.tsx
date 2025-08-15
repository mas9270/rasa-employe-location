"use client";
import { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { ColoredMarker } from "@/utils/leafletConfig";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { reactToastify } from "@/utils/toastify";
import { DataGrid } from "@mui/x-data-grid";
import CustomFieldSet from "@/components/ui/customFieldset";
import { getPathLength } from "geolib";
import L from "leaflet";
import "leaflet-polylinedecorator";


export default function UsersLocation() {
    const [locationInfo, setLocationInfo] = useState<any>(null)

    return (
        <Box sx={{ width: "100%", flex: 1 }} display={"flex"} gap={1} >

            <Box sx={{ width: "50%", flex: 1 }} display={"flex"}>
                <CustomFieldSet title="مسیرها وجایگاه ها" width="100%" height="100%">
                    <Locations
                        locationInfo={locationInfo}
                        setLocationInfo={setLocationInfo}
                    />
                </CustomFieldSet>
            </Box>

            <Box sx={{ width: "50%", flex: 1 }} display={"flex"}>
                <CustomFieldSet title={`${locationInfo?.name ? `کاربران : ${locationInfo?.name}` : "همه کاربران"}`} width="100%" height="100%">
                    <UserByLocation locationInfo={locationInfo} setLocationInfo={setLocationInfo} />
                </CustomFieldSet>
            </Box>

        </Box>
    )
}


function Locations(props: { locationInfo: any, setLocationInfo: any }) {
    const { locationInfo, setLocationInfo } = props
    const [allLocations, setAllLocations] = useState<any>(null)
    const [allPath, setAppPath] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedPath, setSelectedPath] = useState<{ pathInfo: any, locations: any[] }>({ pathInfo: null, locations: [] })


    async function getLocationList() {
        setLoading(true)
        const paths = await fetch("/api/paths")
        const locations = await fetch("/api/locations")
        setAppPath(await paths.json())
        setAllLocations(await locations.json())
        setLoading(false)
    }

    useEffect(() => {
        getLocationList()
    }, [])

    useEffect(() => {
        setLocationInfo(null)
    }, [selectedPath.pathInfo])

    return (
        <Box sx={{ width: "100%", height: "100%", position: "relative" }} display={"flex"} flexDirection={"column"}>
            <Box display={"flex"} justifyContent={"end"} gap={2} mb={2}>
                <Button
                    disabled={loading}
                    loading={loading}
                    size={"small"}
                    variant="contained"
                    onClick={() => {
                        getLocationList()
                    }}
                >
                    دریافت اطلاعات
                </Button>
                <Button
                    disabled={loading || (!locationInfo)}
                    loading={loading}
                    size={"small"}
                    variant="contained"
                    onClick={() => {
                        setLocationInfo(null)
                    }}
                >
                    {locationInfo ? `حذف فیلر ${locationInfo.name}` : "حذف فیلتر کاربران"}
                </Button>
            </Box>
            <Box width={"100%"} sx={{ display: "flex", flex: 1 }}>
                <MapContainer
                    center={[36.3206, 59.5600]}
                    zoom={12} // زوم پیشنهادی برای دیدن کامل شهر
                    style={{ width: "100%", height: "100%" }}
                >
                    {/* لایه نقشه */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />

                    {allPath && (allPath.map((item: any, index: number) =>
                        <ViewPath
                            key={index}
                            item={item}
                            selectedPath={selectedPath}
                            setSelectedPath={setSelectedPath}
                            allLocations={allLocations}
                            locationInfo={locationInfo}
                            setLocationInfo={setLocationInfo}
                        />))}

                </MapContainer>
            </Box>
        </Box >
    )
}

function ViewPath(props: { item: any, selectedPath: any, setSelectedPath: any, allLocations: any, locationInfo: any, setLocationInfo: any }) {
    const { item, selectedPath, setSelectedPath, allLocations, locationInfo, setLocationInfo } = props


    return (
        <>
            {selectedPath.locations && selectedPath.locations.length !== 0 &&
                selectedPath.locations.map((item: any) => {
                    return (
                        <Marker
                            position={[item.lat, item.lng]}
                            icon={ColoredMarker(locationInfo?.id === item.id ? "red" : "green")}
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
                                    <Box mt={1}>نام : {item?.name}</Box>
                                    <Box mt={1}>توضیحات : {item?.description}</Box>
                                    <Box mt={1}>عرض جعرافیایی : {item.lat}</Box>
                                    <Box mt={1}>طول جفرافیایی: {item.lng}</Box>
                                    <Box sx={{ width: "100%" }} display={"flex"} gap={1} mt={1}>
                                        <Box sx={{ width: "100%" }} display={"flex"} justifyContent={"center"}>
                                            <Button variant="contained" onClick={() => { setLocationInfo(item) }} color="success" fullWidth size="small">
                                                انتخاب
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Popup>
                        </Marker>
                    )
                })
            }
            <Polyline
                pathOptions={{ color: selectedPath?.pathInfo?.id === item.id ? "green" : '#0074D9', weight: 5, opacity: 0.8 }}
                positions={item.path ? JSON.parse(item.path) : []}
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
                        <Box mt={1}>نام : {item?.name}</Box>
                        <Box mt={1}>توضیحات : {item?.description}</Box>
                        <Box mt={1}>طول مسیر : {buidPathKilometr(item.path ? JSON.parse(item.path) : [])}</Box>
                        <Box sx={{ width: "100%" }} display={"flex"} gap={1} mt={1}>
                            <Box sx={{ width: "100%" }} display={"flex"} justifyContent={"center"}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setSelectedPath(() => {
                                            const pathLocation = allLocations.filter((item1: any) => item1.pathId === item.id)
                                            return {
                                                pathInfo: item,
                                                locations: pathLocation
                                            }
                                        })
                                    }}
                                    color="success"
                                    fullWidth
                                    size="small"
                                >
                                    نمایش جایگاه ها
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Popup>
            </Polyline>
            <PolylineWithArrows positions={item.path ? JSON.parse(item.path) : []} />
        </>
    )
}

function buidPathKilometr(path: any) {
    const convertPath = path.map((item: any) => ({ lat: item[1], lng: item[1] }))
    const distanceInMeters = getPathLength(convertPath);
    const distanceInKm = (distanceInMeters / 1000).toFixed(2);
    return `${distanceInKm} کیلومتر`
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

function UserByLocation(props: { locationInfo: any, setLocationInfo: any }) {
    const { locationInfo, setLocationInfo } = props
    const [rows, setRows] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const columns = [
        { field: "id", headerName: "شناسه", width: 150 },
        { field: "name", headerName: "نام", width: 200 },
        { field: "nationalCode", headerName: "کدملی", width: 200 },
        { field: "locationId", headerName: "شناسه منطقه", width: 100 },
    ];

    async function getData() {
        setLoading(true)
        const res = await fetch("/api/users");
        const res1 = await res.json()
        if (locationInfo) {
            setRows(() => {
                const filter = res1.filter((item: any) => item.locationId === locationInfo?.id)
                return filter
            })
        }
        else {
            setRows(res1);
        }
        setLoading(false)
    }

    useEffect(() => {
        getData()
    }, [locationInfo])

    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <Box width={"100%"} display={"flex"} flexGrow={1}>
                <DataGrid
                    loading={loading}
                    sx={{ minHeight: "400px", height: "100" }}
                    rows={rows}
                    columns={columns}
                    // checkboxSelection
                    rowSelection={false}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5, page: 0 } },
                    }}
                    localeText={{
                        // filterOperatorDoesNotContain: "wwww",
                        // filterOperatorDoesNotEqual: "wwww",
                        // filterPanelLogicOperator: "Ww",
                        filterPanelOperator: "شامل",
                        filterOperatorDoesNotContain: "شامل نیست",
                        filterOperatorDoesNotEqual: "برابر نیست",
                        // pivotMenuColumns: "ُستون ها",
                        columnMenuSortAsc: "مرتب سازی کم به زیاد",
                        columnMenuSortDesc: "مرتب سازی زیاد به کم",
                        columnMenuFilter: "فیلتر",
                        columnMenuHideColumn: "مخفی کردن ستون",
                        columnMenuManageColumns: "مدیرت ستون",
                        // columnMenuManagePivot :"ww",
                        // filterPanelRemoveAll:"eee",
                        // filterValueAny :"wwww",
                        // filterValueFalse:"شامل",
                        // filterValueTrue:"ewww",
                        // headerFilterClear :"Eeee",
                        // headerFilterOperatorDoesNotContain:"!!11",

                        noRowsLabel: "هیچ داده‌ای وجود ندارد",
                        // errorOverlayDefaultLabel: "خطایی رخ داده است.",
                        toolbarDensity: "چگالی",
                        toolbarDensityLabel: "تنظیم چگالی",
                        toolbarDensityCompact: "فشرده",
                        toolbarDensityStandard: "استاندارد",
                        toolbarDensityComfortable: "راحت",
                        toolbarColumns: "ستون‌ها",
                        toolbarColumnsLabel: "انتخاب ستون‌ها",
                        toolbarFilters: "فیلترها",
                        toolbarFiltersLabel: "نمایش فیلترها",
                        toolbarFiltersTooltipHide: "پنهان کردن فیلترها",
                        toolbarFiltersTooltipShow: "نمایش فیلترها",
                        toolbarExport: "خروجی",
                        toolbarExportLabel: "خروجی گرفتن",
                        // columnsPanelTextFieldLabel: "جستجوی ستون",
                        // columnsPanelTextFieldPlaceholder: "عنوان ستون",
                        // columnsPanelDragIconLabel: "جابجایی ستون",
                        // columnsPanelShowAllButton: "نمایش همه",
                        // columnsPanelHideAllButton: "مخفی کردن همه",
                        filterPanelAddFilter: "افزودن فیلتر",
                        filterPanelDeleteIconLabel: "حذف",
                        // filterPanelOperators: "اپراتورها",
                        filterPanelOperatorAnd: "و",
                        filterPanelOperatorOr: "یا",
                        filterPanelColumns: "ستون‌ها",
                        filterPanelInputLabel: "مقدار",
                        filterPanelInputPlaceholder: "مقدار فیلتر",
                        filterOperatorContains: "شامل",
                        filterOperatorEquals: "برابر با",
                        filterOperatorStartsWith: "شروع با",
                        filterOperatorEndsWith: "پایان با",
                        filterOperatorIs: "است",
                        filterOperatorNot: "نیست",
                        filterOperatorAfter: "بعد از",
                        filterOperatorOnOrAfter: "در یا بعد از",
                        filterOperatorBefore: "قبل از",
                        filterOperatorOnOrBefore: "در یا قبل از",
                        filterOperatorIsEmpty: "خالی است",
                        filterOperatorIsNotEmpty: "خالی نیست",
                        filterOperatorIsAnyOf: "هر کدام از",
                        // paginationNext: "صفحه بعد",
                        // paginationPrevious: "صفحه قبل",
                        paginationRowsPerPage: "ردیف در هر صفحه:",
                        // paginationOf: "از",
                        footerRowSelected: (count) =>
                            count !== 1
                                ? `${count.toLocaleString()} ردیف انتخاب شده`
                                : `${count.toLocaleString()} ردیف انتخاب شده`,
                        footerTotalRows: "مجموع ردیف‌ها:",
                        footerTotalVisibleRows: (visibleCount, totalCount) =>
                            `${visibleCount.toLocaleString()} از ${totalCount.toLocaleString()}`,
                        checkboxSelectionHeaderName: "انتخاب",
                        booleanCellTrueLabel: "بله",
                        booleanCellFalseLabel: "خیر",
                        columnHeaderSortIconLabel: "مرتب‌سازی",
                    }}
                />
            </Box>
        </Box>
    )
}

