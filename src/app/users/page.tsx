"use client"
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material"
import AddEditModal from "./components/addEdit";
import DeleteModal from "./components/delete";






export default function UsersPage() {

    const [rows, setRows] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [isModal, setIsModal] = useState<{ active: boolean, info: any }>({ active: false, info: null })
    const [isDelete, setIsDelete] = useState<{ active: boolean, info: any }>({ active: false, info: null })
    const columns = [
        { field: "id", headerName: "شناسه", width: 150 },
        { field: "name", headerName: "نام", width: 200 },
        { field: "nationalCode", headerName: "کدملی", width: 300 },
        { field: "locationName", headerName: "نام جایگاه", width: 300 },
        {
            field: "actionBtn",
            headerName: "عملیات",
            width: 80,
            renderCell: (params: any) => {

                return (
                    <Box display={"flex"} alignItems={"center"} height={"100%"} gap={1}>
                        {/* <Button
                            variant="contained"
                            onClick={() => { setIsDelete({ active: true, info: params.row }) }}
                            color='error'
                            size="small"
                        > */}
                        <Delete
                            color="error"
                            sx={{ cursor: "pointer" }}
                            onClick={() => { setIsDelete({ active: true, info: params.row }) }}
                        />
                        {/* </Button> */}
                        {/* <Button
                            variant="contained"
                            onClick={() => { setIsModal({ active: true, info: params.row }) }}
                            color='info'
                            size="small"
                        > */}
                        <Edit
                            color="info"
                            sx={{ cursor: "pointer" }}
                            onClick={() => { setIsModal({ active: true, info: params.row }) }}
                        />
                        {/* </Button> */}
                    </Box>
                )
            }
        },
    ];

    async function getData() {
        setLoading(true)
        const res = await fetch("/api/users",{method :"PUT"});
        setRows(await res.json());
        setLoading(false)
        // setTimeout(() => {
        // api.get("/users")
        //     .then((res) => {
        //         setRows(res.data)
        //         setLoading(false)
        //     })
        //     .catch((err) => {
        //         setRows([])
        //         setLoading(false)
        //     })
        // // }, 2000);
    }

    function actionBtn() {
        return (
            <Box component={"div"} width={"100%"} paddingBottom={"20px"} display={"flex"} gap={2}>
                <Button
                    variant="contained"
                    onClick={() => {
                        setIsModal({ active: true, info: null })
                    }}
                >افزودن</Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                        getData()
                    }}
                >دریافت لیست کاربران</Button>
            </Box>
        )
    }

    function dataGrid() {
        return (
            // <Box sx={{ width: "100%", flex: 1, minHeight: 0 }}>
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
            // </Box >  
        )
    }

    function addEditModal() {

        return (
            <AddEditModal
                data={{
                    active: isModal.active,
                    info: isModal.info
                }}
                onClose={(done) => {
                    setIsModal({
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
            {addEditModal()}
            {deleteModal()}
            {dataGrid()}
        </Box>
    );
}