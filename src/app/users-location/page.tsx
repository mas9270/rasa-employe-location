"use client";
import { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { DefaultIcon1, ColoredMarker } from "@/utils/leafletConfig";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, Polyline } from "react-leaflet";
import { reactToastify } from "@/utils/toastify";
import { DataGrid } from "@mui/x-data-grid";
import CustomFieldSet from "@/components/ui/customFieldset";


export default function UsersLocation() {
    const [locationId, setLocationId] = useState<any>(null)

    return (
        <Box sx={{ width: "100%", height: "800px", minHeight: "400px" }} display={"flex"} gap={1}>
            <Box sx={{ width: "50%", height: "100%" }}>
                <CustomFieldSet title="منطقه ها" width="100%" height="100%">
                    <Locations
                        locationId={locationId}
                        setLocationId={setLocationId}
                    />
                </CustomFieldSet>
            </Box>

            <Box sx={{ width: "50%", height: "100%" }}>
                <CustomFieldSet title={`${locationId?.name ? `کاربران : ${locationId?.name}` : "همه کاربران"}`} width="100%" height="100%">
                    <UserByLocation locationId={locationId} setLocationId={setLocationId} />
                </CustomFieldSet>
            </Box>
        </Box>
    )
}


function Locations(props: { locationId: any, setLocationId: any }) {
    const { locationId, setLocationId } = props
    const [allLocations, setAllLocations] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [currentLocationInfo, setCurrentLocationInfo] = useState<any>(null)

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

    return (
        <Box sx={{ width: "100%", height: "100%", position: "relative" }} display={"flex"} flexDirection={"column"}>
            <Box display={"flex"} justifyContent={"end"} gap={2} mb={2}>
                <Button
                    disabled={currentLocationInfo ? false : true || loading}
                    size={"small"}
                    variant="contained"
                    onClick={() => {
                        setCurrentLocationInfo(null)
                    }}
                >حذف نمایش مسیر {currentLocationInfo?.name}</Button>
            </Box>
            <MapContainer
                center={[36.3206, 59.6168]}
                zoom={12} // زوم پیشنهادی برای دیدن کامل شهر
                style={{ width: "100%", height: "100%" }}
            >
                {/* لایه نقشه */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {allLocations && (
                    allLocations.map((item: any, index: number) => {
                        return (
                            <Marker key={index} position={[item.lat, item.lng]} icon={ColoredMarker(locationId?.id === item.id ? "blue" : "green")}>
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

                                        <Box sx={{ width: "100%" }} display={"flex"} gap={1}>
                                            <Box sx={{ width: "100%" }} display={"flex"} justifyContent={"center"}>
                                                <Button
                                                    sx={{ textWrap: "nowrap" }}
                                                    variant="contained"
                                                    color="info"
                                                    fullWidth
                                                    size="small"
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
                                            </Box>
                                            <Box sx={{ width: "100%" }} display={"flex"} justifyContent={"center"}>
                                                <Button variant="contained" onClick={() => { setLocationId(item) }} color="success" fullWidth size="small">
                                                    انتخاب
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Popup>
                            </Marker>
                        )
                    })
                )}

                {currentLocationInfo && (
                    <Polyline
                        pathOptions={{ color: 'black' }}
                        positions={currentLocationInfo.path ? JSON.parse(currentLocationInfo.path) : []} />
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
        </Box >
    )
}

function UserByLocation(props: { locationId: any, setLocationId: any }) {
    const { locationId, setLocationId } = props
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
        if (locationId) {
            setRows(() => {
                const filter = res1.filter((item: any) => item.locationId === locationId.id)
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
    }, [locationId])

    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            <Box display={"flex"} justifyContent={"end"} gap={2} mb={2}>
                <Button
                    disabled={locationId ? false : true || loading}
                    size={"small"}
                    variant="contained"
                    onClick={() => {
                        setLocationId(null)
                    }}
                >حذف فیلتر</Button>
            </Box>
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
