"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { ColoredMarker } from "@/utils/leafletConfig";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { reactToastify } from "@/utils/toastify";
import { DataGrid } from "@mui/x-data-grid";
import CustomFieldSet from "@/components/ui/customFieldset";

import L from "leaflet";
import "leaflet-polylinedecorator";
import SearchLocation from "@/components/ui/searchLocation";
import { buildPathKilometr } from "@/utils/leafletConfig";
import SearchEmploye from "@/components/ui/searchEmploye";

export default function UsersLocation() {
  const [locationInfo, setLocationInfo] = useState<any>(null);

  return (
    <Box
      sx={{
        width: "100%",
        flex: 1,
        flexDirection: {
          xs: "column",
          sm: "column",
          md: "row",
          lg: "row",
          xl: "row",
        },
      }}
      display={"flex"}
      gap={1}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "50%", lg: "50%", xl: "50%" },
          height: {
            xs: "500px",
            sm: "500px",
            md: "auto",
            lg: "auto",
            xl: "auto",
          },
          flex: { xs: "auto", sm: "auto", md: 1, lg: 1, xl: 1 },
        }}
        display={"flex"}
      >
        <CustomFieldSet title="مسیرها و جایگاه ها" width="100%" height="100%">
          <Locations
            locationInfo={locationInfo}
            setLocationInfo={setLocationInfo}
          />
        </CustomFieldSet>
      </Box>

      {/* <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "50%", lg: "50%", xl: "50%" },
          height: {
            xs: "500px",
            sm: "500px",
            md: "auto",
            lg: "auto",
            xl: "auto",
          },
          flex: { xs: "auto", sm: "auto", md: 1, lg: 1, xl: 1 },
        }}
        display={"flex"}
      >
        <CustomFieldSet
          title={`${
            locationInfo?.name
              ? `کارمندان : ${locationInfo?.name}`
              : "همه کارمندان"
          }`}
          width="100%"
          height="100%"
        >
          <UserByLocation
            locationInfo={locationInfo}
            setLocationInfo={setLocationInfo}
          />
        </CustomFieldSet>
      </Box> */}
    </Box>
  );
}

function Locations(props: { locationInfo: any; setLocationInfo: any }) {
  const { locationInfo, setLocationInfo } = props;
  const [users, setUsers] = useState<any>(null);
  const [searchUser, setSearchUser] = useState<any>(null);
  const [allPath, setAppPath] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [seachLocation, setSearchLocation] = useState<{
    latLng: any;
    text: string;
  }>({ latLng: [], text: "" });
  const [pathInfo, setPathInfo] = useState<any>(null);

  async function getLocationList() {
    setLoading(true);
    const paths = await fetch("/api/paths");
    const currentUsers = await fetch("/api/users");
    setAppPath(await paths.json());
    setUsers(await currentUsers.json());
    setLoading(false);
  }

  function actions() {
    return (
      <Box
        display={"flex"}
        justifyContent={"between"}
        gap={2}
        mb={2}
        flexDirection={{
          xs: "column",
          SM: "column",
          md: "column",
          lg: "row",
          xl: "row",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            width: "100%",
            flexWrap: "wrap",
          }}
          gap={2}
        >
          <SearchLocation
            onSearch={(searchLatLng, text) => {
              setSearchLocation({
                latLng: searchLatLng ? searchLatLng : [],
                text: text ? text : "",
              });
            }}
          />
          <SearchEmploye
            onSearch={(userInfo) => {
              setSearchUser(userInfo);
            }}
          />
          <Autocomplete
            sx={{ width: "300px" }}
            id="free-solo-demo"
            freeSolo
            size="small"
            value={pathInfo}
            options={allPath}
            getOptionLabel={
              (option) => `${option.id} - ${option.name}` // ترکیبی برای نمایش
            }
            isOptionEqualToValue={(option, value) => option.id === value.id} // مقایسه بر اساس کلید خاص
            renderInput={(params) => <TextField {...params} label="نام مسیر" />}
            onChange={(_event, newValue, a, b) => {
              setPathInfo(newValue);
            }}
          />
          <Button
            disabled={loading}
            loading={loading}
            size={"small"}
            variant="contained"
            color="success"
            onClick={() => {
              getLocationList();
            }}
          >
            دریافت اطلاعات
          </Button>
        </Box>
      </Box>
    );
  }

  function mapContent() {
    return (
      <Box width={"100%"} sx={{ display: "flex", flex: 1 }}>
        <MapContainer
          center={[36.3206, 59.56]}
          zoom={12} // زوم پیشنهادی برای دیدن کامل شهر
          style={{ width: "100%", height: "100%" }}
        >
          {/* لایه نقشه */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* {allPath &&
            allPath.map((item: any, index: number) => (
              <ViewPath
                key={index}
                item={item}
                selectedPath={selectedPath}
                setSelectedPath={setSelectedPath}
                users={users}
                locationInfo={locationInfo}
                setLocationInfo={setLocationInfo}
              />
            ))} */}

          {!pathInfo &&
            !searchUser &&
            users?.map((item: any, index: number) => {
              return (
                <Marker
                  key={index}
                  position={[item.lat, item.lng]}
                  icon={ColoredMarker("purple")}
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
                    </Box>
                  </Popup>
                </Marker>
              );
            })}

          {/*  برای جستجو جایگاه */}
          {seachLocation.latLng?.length !== 0 && (
            <Marker position={seachLocation.latLng} icon={ColoredMarker("red")}>
              <Popup>
                <Box
                  width={"100%"}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  sx={{
                    direction: "rtl",
                    fontFamily: "IRANSansX",
                  }}
                >
                  <Box>{seachLocation.text}</Box>
                </Box>
              </Popup>
            </Marker>
          )}

          {pathInfo && (
            <ViewPath
              item={pathInfo}
              users={users}
              locationInfo={locationInfo}
              setLocationInfo={setLocationInfo}
            />
          )}

          {/* برای جستجو کارمند */}
          {searchUser &&
            searchUser?.length !== 0 &&
            searchUser.map((item: any, index: number) => {
              return (
                <Marker
                  key={index}
                  position={{ lat: item.lat, lng: item.lng }}
                  icon={ColoredMarker("blue")}
                >
                  <Popup>
                    <Box
                      width={"100%"}
                      display={"flex"}
                      flexDirection={"column"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      sx={{
                        direction: "rtl",
                        fontFamily: "IRANSansX",
                      }}
                    >
                      <Box>نام : {item.name}</Box>
                      <Box>توضیحات : {item.description}</Box>
                    </Box>
                  </Popup>
                </Marker>
              );
            })}

          <FlyToPosition position={seachLocation.latLng} />
        </MapContainer>
      </Box>
    );
  }

  //   useEffect(() => {
  //     if (searchUser) {
  //       setPathInfo(null);
  //     }
  //   }, [searchUser]);

  //   useEffect(() => {
  //     if (pathInfo) {
  //       setSearchUser(null);
  //     }
  //   }, [pathInfo]);

  useEffect(() => {
    getLocationList();
  }, []);

  useEffect(() => {
    console.log(searchUser);
  }, [searchUser]);

  return (
    <Box
      sx={{ width: "100%", height: "100%", position: "relative" }}
      display={"flex"}
      flexDirection={"column"}
    >
      {actions()}
      {mapContent()}
    </Box>
  );
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

function ViewPath(props: {
  item: any;
  users: any;
  locationInfo: any;
  setLocationInfo: any;
}) {
  const { item, users, locationInfo } = props;
  const [selectedPath, setSelectedPath] = useState<{
    pathInfo: any;
    locations: any[];
  }>({ pathInfo: null, locations: [] });

  useEffect(() => {
    const pathLocation = users.filter(
      (item1: any) => item1.pathId === +item.id
    );
    setSelectedPath({
      pathInfo: item,
      locations: pathLocation,
    });
  }, [item]);

  return (
    <>
      {selectedPath.locations &&
        selectedPath.locations.length !== 0 &&
        selectedPath.locations.map((item: any) => {
          return (
            <Marker
              position={[item.lat, item.lng]}
              icon={ColoredMarker(
                locationInfo?.id === item.id ? "red" : "green"
              )}
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
                </Box>
              </Popup>
            </Marker>
          );
        })}
      <Polyline
        pathOptions={{
          color: selectedPath?.pathInfo?.id === item.id ? "green" : "#0074D9",
          weight: 5,
          opacity: 0.8,
        }}
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
            <Box mt={1}>
              طول مسیر :{" "}
              {buildPathKilometr(item.path ? JSON.parse(item.path) : [])}
            </Box>
          </Box>
        </Popup>
      </Polyline>
      <PolylineWithArrows positions={item.path ? JSON.parse(item.path) : []} />
    </>
  );
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

  return null;
}

function UserByLocation(props: { locationInfo: any; setLocationInfo: any }) {
  const { locationInfo, setLocationInfo } = props;
  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const columns = [
    { field: "id", headerName: "شناسه", width: 70 },
    { field: "name", headerName: "نام", width: 200 },
    { field: "nationalCode", headerName: "کدملی", width: 200 },
    { field: "locationName", headerName: "نام جایگاه", width: 200 },
  ];

  async function getData() {
    setLoading(true);
    const res = await fetch("/api/users", { method: "PUT" });
    const res1 = await res.json();
    if (locationInfo) {
      setRows(() => {
        const filter = res1.filter(
          (item: any) => item.locationId === locationInfo?.id
        );
        return filter;
      });
    } else {
      setRows(res1);
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, [locationInfo]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
  );
}
