"use client"
import { useState, useEffect } from "react";

import { Add, Edit, Delete } from "@mui/icons-material"
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { reactToastify } from "@/utils/toastify";
import DeleteModal from "./delete";
import AddEditModal from "./addEdit";
import { StructureInfo, StructureInfoSet } from "../locationTypes";


export default function ViewLocation(props: { structureInfo: StructureInfo, setStructureInfo: StructureInfoSet }) {
    const { structureInfo, setStructureInfo } = props

    const [rows, setRows] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [isAddEdit, setIsAddEdit] = useState<{ active: boolean, info: any }>({ active: false, info: null })
    const [isDelete, setIsDelete] = useState<{ active: boolean, info: any }>({ active: false, info: null })
    const columns = [
        { field: "id", headerName: "شناسه", width: 50 },
        { field: "name", headerName: "نام", width: 100 },
        { field: "description", headerName: "توضیحات", width: 100 },
        { field: "pathId", headerName: "شناسه مسیر", width: 100 },
        {
            field: "actionBtn",
            headerName: "عملیات",
            width: 80,
            renderCell: (params: any) => {
                return (
                    <Box display={"flex"} alignItems={"center"} height={"100%"} gap={1}>
                        <Delete
                            color="error"
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                                if (loading || structureInfo.paths.mode !== "view") {
                                    reactToastify({
                                        type: "warning",
                                        message: "حالت افزودن یا ویرایش مسیر فعال است"
                                    })
                                    return
                                }
                                setIsDelete({ active: true, info: params.row })
                            }}
                        />
                        <Edit
                            color="info"
                            sx={{ cursor: "pointer" }}
                            onClick={() => {
                                if (loading || structureInfo.paths.mode !== "view") {
                                    reactToastify({
                                        type: "warning",
                                        message: "حالت افزودن یا ویرایش مسیر فعال است"
                                    })
                                    return
                                }
                                setIsAddEdit({ active: true, info: params.row })
                            }}
                        />
                    </Box>
                )
            }
        },
    ];

    async function getData() {
        setLoading(true)
        fetch("/api/locations")
            .then((res) => res.json())
            .then((res) => {
                setRows(res)
                setLoading(false)
            })
            .catch((err) => {
                reactToastify({
                    type: "error",
                    message: "خطایی رخ داده است دوباره تلاش کنید"
                })
                setLoading(false)
            })
    }

    function actionBtn() {
        return (
            <Box component={"div"} width={"100%"} display={"flex"} gap={2} mb={1}>
                <Button
                    disabled={loading || structureInfo.paths.mode !== "view" || structureInfo.loading}
                    size="small"
                    variant="contained"
                    onClick={() => {

                        setStructureInfo((prevState) => {
                            return {
                                ...prevState,
                                locations: {
                                    ...prevState.locations,
                                    mode: isAddEdit.active ? "view" : "add",
                                    latLng: []
                                }
                            }
                        })


                        setIsAddEdit({ active: !isAddEdit.active, info: null })
                    }}
                    color={isAddEdit.active ? "error" : "success"}
                >{isAddEdit.active ? "انصراف" : "افزودن"}</Button>
                {!isAddEdit.active && (
                    <Button
                        disabled={loading || structureInfo.paths.mode !== "view"}
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => {
                            getData()
                        }}
                    >دریافت لیست</Button>
                )}
            </Box>
        )
    }

    function dataGrid() {
        return (
            <DataGrid
                loading={loading}
                sx={{ width: "100%", minHeight: 0, flex: 1 }}
                rows={rows}
                columns={columns}
                rowSelection={false}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
                localeText={{
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
        )
    }

    function addEditModal() {

        return (
            <AddEditModal
                data={{
                    active: isAddEdit.active,
                    info: isAddEdit.info,
                    structureInfo: structureInfo,
                    setStructureInfo: setStructureInfo
                }}
                onClose={(done) => {
                    setIsAddEdit({
                        active: false,
                        info: null
                    })
                    setStructureInfo((prevState) => {
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
                    if (done) {
                        getData()
                    }
                }}
            />
        )
    }

    function deleteModal() {

        return (
            <DeleteModal
                data={{
                    active: isDelete.active,
                    info: isDelete.info
                }}
                onClose={(done) => {
                    setIsDelete({
                        active: false,
                        info: null
                    })
                    if (done) {
                        getData()
                    }
                }}
            />
        )
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <Box sx={{ width: "100%", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
            {actionBtn()}
            {/* {addEditModal()} */}
            {deleteModal()}
            {isAddEdit.active ? addEditModal() : dataGrid()}
        </Box>
    )
}