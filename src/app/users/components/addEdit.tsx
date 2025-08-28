"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Stack,
  Box,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import * as z from "zod";
import { reactToastify } from "../../../utils/toastify";
import {
  LocationCity,
  LocationCityOutlined,
  LocationPin,
} from "@mui/icons-material";
import CustomModal from "@/components/ui/customModal";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { buildPathKilometr, ColoredMarker } from "@/utils/leafletConfig";
import L from "leaflet";

const schema = z.object({
  name: z.string().min(1, "نام حداقل باید 1 کاراکتر باشد"),
  nationalCode: z
    .string()
    .min(10, "کد ملی باید 10 کاراکتر باشد")
    .max(10, "کد ملی باید 10 کاراکتر باشد"),
  description: z.string(),
  pathId: z.string().min(1, "شناسه مسیر را وارد کنید"),
  lat: z.string().min(1, "عرض جغرافیایی را وارد کنید"),
  lng: z.string().min(1, "طول جغرافیایی را وارد کنید"),
});

export default function AddEditModal(props: {
  data: { active: boolean; info: any };
  onClose: (done?: boolean) => void;
}) {
  const { data, onClose } = props;
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <CustomModal
      active={data.active}
      title={`${data?.info ? "ویرایش" : "افزودن"} کارمند ${
        data?.info ? `(${data?.info.nationalCode})` : ""
      }`}
      loading={loading}
      onClose={() => {
        onClose(false);
      }}
    >
      <Form
        info={data.info}
        done={() => {
          onClose(true);
        }}
        loading={loading}
        setLoading={setLoading}
      />
    </CustomModal>
  );
}

function Form(props: {
  info: any;
  done: () => void;
  setLoading: any;
  loading: boolean;
}) {
  const { info, done, setLoading, loading } = props;
  const [pathModalInfo, setPathModalInfo] = useState<{
    active: boolean;
    info: any;
  }>({ active: false, info: null });
  const [locationInfo, setLocationsInfo] = useState<{
    active: boolean;
    info: any;
    lat: string;
    lng: string;
  }>({ active: false, info: null, lat: "", lng: "" });
  const [locationName, setLocationName] = useState<any>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: info?.name ? `${info.name}` : "",
      nationalCode: info?.nationalCode ? `${info.nationalCode}` : "",
      description: info?.description ? `${info.description}` : "",
      pathId: info?.pathId ? `${info.pathId}` : "",
      lat: info?.lat ? `${info.lat}` : "",
      lng: info?.lng ? `${info.lng}` : "",
    },
    resolver: zodResolver(schema),
  });
  const currentLocationForm = watch("pathId");
  const lat = watch("lat");
  const lng = watch("lng");

  function onSubmit(data: any) {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((res) => {
        if (info) {
          const allUsers = res;
          const findNationalCode = allUsers.find(
            (item: any) => item.nationalCode === data.nationalCode
          );
          if (
            findNationalCode &&
            findNationalCode.nationalCode !== info.nationalCode
          ) {
            reactToastify({
              type: "warning",
              message: "کد ملی تکراری است",
            });
            setLoading(false);
          } else {
            fetch(`/api/users/${info.id}`, {
              method: "PUT",
              body: JSON.stringify({
                name: data.name.trim(),
                nationalCode: data.nationalCode.trim(),
                description: data.description.trim(),
                pathId: +data.pathId,
                lat: +data.lat,
                lng: +data.lng,
              }),
            })
              .then(() => {
                reactToastify({
                  type: "success",
                  message: "عملیات با موفقیت انجام شد",
                });
                done();
                setLoading(false);
              })
              .catch(() => {
                reactToastify({
                  type: "error",
                  message: "خطایی رخ داده است دوباره تلاش کنید",
                });
                setLoading(false);
              });
          }
        } else {
          const allUsers = res;
          const findNationalCode = allUsers.find(
            (item: any) => item.nationalCode === data.nationalCode
          );
          if (findNationalCode) {
            reactToastify({
              type: "warning",
              message: "کد ملی تکراری است",
            });
            setLoading(false);
          } else {
            fetch("/api/users", {
              method: "POST",
              body: JSON.stringify({
                name: data.name.trim(),
                nationalCode: data.nationalCode.trim(),
                description: data.description.trim(),
                pathId: +data.pathId,
                lat: +data.lat,
                lng: +data.lng,
              }),
            })
              .then(() => {
                reactToastify({
                  type: "success",
                  message: "عملیات با موفقیت انجام شد",
                });
                done();
                setLoading(false);
              })
              .catch(() => {
                reactToastify({
                  type: "error",
                  message: "خطایی رخ داده است دوباره تلاش کنید",
                });
                setLoading(false);
              });
          }
        }
      })
      .catch(() => {
        reactToastify({
          type: "error",
          message: "خطایی رخ داده است دوباره تلاش کنید",
        });
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    fetch("/api/paths")
      .then((res) => res.json())
      .then((res) => {
        const findName = res.find(
          (item: any) => +item.id === +currentLocationForm
        )?.name;
        setLocationName(findName);
        setLoading(false);
      });
  }, [currentLocationForm]);

  return (
    <Box sx={{ width: { xs: "300px", sm: "400px" } }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2} mt={1}>
          <TextField
            label="نام"
            {...register("name")}
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
          <Box width={"100%"} display={"flex"} gap={1}>
            <TextField
              onClick={(e) => {
                setPathModalInfo({ active: true, info: info });
              }}
              sx={{ cursor: "pointer" }}
              label="شناسه مسیر"
              type="text"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationPin />
                    </InputAdornment>
                  ),
                  readOnly: true,
                },
              }}
              error={!!errors.pathId}
              helperText={errors.pathId?.message}
              {...register("pathId")}
              fullWidth
            />
            <TextField
              disabled={true}
              value={locationName}
              sx={{ cursor: "pointer" }}
              label="نام مسیر"
              type="text"
              fullWidth
              // slotProps={{
              //     input: {
              //         readOnly: true,
              //     },
              // }}
            />
          </Box>
          <Box width={"100%"} display={"flex"} gap={1}>
            <TextField
              disabled={loading}
              size="small"
              label="عرض جغرافیایی"
              {...register("lat")}
              error={!!errors.lat}
              helperText={errors.lat?.message}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationPin />
                    </InputAdornment>
                  ),
                  readOnly: true,
                },
              }}
              onClick={() => {
                setLocationsInfo({
                  active: true,
                  info: info,
                  lat: lat,
                  lng: lng,
                });
              }}
            />
            <TextField
              disabled={loading}
              size="small"
              label="طول جغرافیایی"
              {...register("lng")}
              error={!!errors.lng}
              helperText={errors.lng?.message}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationPin />
                    </InputAdornment>
                  ),
                  readOnly: true,
                },
              }}
              onClick={() => {
                setLocationsInfo({
                  active: true,
                  info: info,
                  lat: lat,
                  lng: lng,
                });
              }}
            />
          </Box>
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
          <Button type="submit" variant="contained" loading={loading}>
            ذخیره
          </Button>
        </Stack>
      </form>
      <GetPath
        pathId={currentLocationForm}
        pathModalInfo={pathModalInfo}
        onClose={(value) => {
          if (value) {
            setValue("pathId", `${value}`);
          }
          setPathModalInfo({ active: false, info: null });
        }}
      />
      <GetLocation
        pathId={currentLocationForm}
        locationInfo={locationInfo}
        latLng={{ lat, lng }}
        onClose={(value) => {
          if (value) {
            setValue("lat", `${value?.lat}`);
            setValue("lng", `${value?.lng}`);
          }
          setLocationsInfo({ active: false, info: null, lat: "", lng: "" });
        }}
      />
      {/* <GetLocation
        currentLocationForm={currentLocationForm}
        pathModalInfo={pathModalInfo}
        onClose={(locationId) => {
          if (locationId) {
            // setValue("location", locationId);
          }
          setPathModalInfo({ active: false, info: null });
        }}
      /> */}
    </Box>
  );
}

function GetPath(props: {
  pathId?: string | number;
  pathModalInfo: any;
  onClose: (pathId?: any) => void;
}) {
  const { pathId, pathModalInfo, onClose } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [allPaths, setAllPath] = useState<any>(null);

  function getPathList() {
    setLoading(true);
    fetch("/api/paths")
      .then((res) => res.json())
      .then((res) => {
        setAllPath(res);
        setLoading(false);
      })
      .catch(() => {
        reactToastify({
          type: "error",
          message: "خطایی رخ داده است دوباره تلاش کنید",
        });
        setLoading(false);
      });
  }

  useEffect(() => {
    getPathList();
  }, [pathModalInfo]);

  useEffect(() => {}, [allPaths]);

  // console.log("pathId", pathId);
  // console.log("allPaths", allPaths);
  // console.log("pathModalInfo", pathModalInfo);

  function currentPath() {
    return (
      <Box
        sx={{
          width: { xs: "300px", sm: "400px", md: "600px", lg: "700px" },
          height: "400px",
          position: "relative",
        }}
      >
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

          {allPaths &&
            allPaths.map((item: any, index: number) => (
              <ViewPath
                pathId={pathId}
                key={index}
                item={item}
                onClose={onClose}
              />
            ))}
        </MapContainer>
      </Box>
    );
  }

  return (
    <CustomModal active={pathModalInfo.active} onClose={() => onClose()}>
      {currentPath()}
    </CustomModal>
  );
}

function GetLocation(props: {
  pathId: string | number;
  latLng: any;
  locationInfo: any;
  onClose: (lng?: any) => void;
}) {
  const { pathId, latLng, onClose, locationInfo } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [path, setPath] = useState<any>(null);
  const [currentLo, setCurrentLo] = useState<any>(latLng);

  function getPath() {
    setLoading(true);
    fetch("/api/paths")
      .then((res) => res.json())
      .then((res) => {
        const current = res.find((item: any) => item.id === +pathId);
        if (current) {
          setPath(current);
        }
        setLoading(false);
      })
      .catch(() => {
        reactToastify({
          type: "error",
          message: "خطایی رخ داده است دوباره تلاش کنید",
        });
        setLoading(false);
      });
  }

  useEffect(() => {}, []);

  useEffect(() => {
    getPath();
    setCurrentLo(latLng ? { ...latLng } : null);
    return () => {
      setCurrentLo(null);
    };
  }, [locationInfo.active]);

  function currentPathLocation() {
    return (
      <Box
        sx={{
          width: { xs: "300px", sm: "400px", md: "600px", lg: "700px" },
          height: "auto",
          position: "relative",
        }}
        display={"flex"}
        flexDirection={"column"}
      >
        <MapContainer
          center={[36.3206, 59.6168]}
          zoom={12} // زوم پیشنهادی برای دیدن کامل شهر
          style={{ width: "100%", height: "400px" }}
        >
          {/* لایه نقشه */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <ViewPath
            pathId={pathId}
            item={path}
            onClose={() => {}}
            type={"location"}
          />
          <ViewLocation
            latLng={currentLo ? currentLo : null}
            // latLng={latLng}
            locationInfo={locationInfo}
            color={"green"}
          />
          {/* <SelectedLocation /> */}
          <ClickHandler
            onClick={(location) => {
              // onClose(location)
              setCurrentLo(location);
            }}
            onContext={() => {
              // mapContext(location);
            }}
          />
          <ChangeCursor />
        </MapContainer>
        <Button
          variant="contained"
          loading={loading}
          color={"success"}
          className="mt-2"
          fullWidth
          onClick={() => {
            onClose(currentLo);
          }}
        >
          ذخیره
        </Button>
      </Box>
    );
  }

  return (
    <CustomModal active={locationInfo.active} onClose={() => onClose()}>
      {currentPathLocation()}
    </CustomModal>
  );
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

function ClickHandler({
  onClick,
  onContext,
}: {
  onClick: (location?: any) => void;
  onContext: (location?: any) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
    contextmenu(e) {
      // onContext(e.latlng);
    },
  });
  return null;
}

function ViewLocation(props: {
  latLng: any;
  locationInfo: any;
  color: "blue" | "green" | "red";
}) {
  const { latLng, locationInfo, color } = props;

  return (
    <Marker
      position={latLng ? latLng : { lat: "", lng: "" }}
      // position={latLng ? [latLng.lat, latLng.lng] : []}
      icon={ColoredMarker(color)}
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
          <Box>نام : {locationInfo?.info?.name}</Box>
          <Box>نام : {locationInfo?.info?.description}</Box>
          <Box>عرض جعرافیایی : {latLng ? latLng[0] : ""}</Box>
          <Box>طول جفرافیایی: {latLng ? latLng[1] : ""}</Box>
        </Box>
      </Popup>
    </Marker>
  );
}

function ViewPath(props: {
  item: any;
  pathId?: string | number;
  type?: "location" | "path";
  onClose: (pathId: any) => void;
}) {
  const { item, pathId, onClose, type } = props;

  if (!item) {
    return null;
  }
  return (
    <>
      <Polyline
        pathOptions={{
          color: pathId && +pathId === item.id ? "green" : "#0074D9",
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
            {type !== "location" && (
              <Box sx={{ width: "100%" }} display={"flex"} gap={1} mt={1}>
                <Box
                  sx={{ width: "100%" }}
                  display={"flex"}
                  justifyContent={"center"}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      onClose(item.id);
                    }}
                    color="success"
                    fullWidth
                    size="small"
                  >
                    انتخاب
                  </Button>
                </Box>
              </Box>
            )}
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
    if (!positions) {
      return () => {};
    }
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

function GetLocation1(props: {
  pathModalInfo: any;
  onClose: (locationId?: any) => void;
  currentLocationForm: any;
}) {
  const { pathModalInfo, onClose, currentLocationForm } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [allLocations, setAllLocations] = useState<any>(null);

  function getLocationList() {
    setLoading(true);
    fetch("/api/locations")
      .then((res) => res.json())
      .then((res) => {
        setAllLocations(res);
        setLoading(false);
      })
      .catch(() => {
        reactToastify({
          type: "error",
          message: "خطایی رخ داده است دوباره تلاش کنید",
        });
        setLoading(false);
      });
  }

  useEffect(() => {
    getLocationList();
  }, []);

  function currentMap() {
    return (
      <Box
        sx={{
          width: { xs: "300px", sm: "400px", md: "600px", lg: "700px" },
          height: "400px",
          position: "relative",
        }}
      >
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

          {allLocations &&
            allLocations.map((item: any, index: number) => {
              return (
                <Marker
                  key={index}
                  position={[item.lat, item.lng]}
                  icon={ColoredMarker(
                    +currentLocationForm === item.id ? "blue" : "green"
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
                      <Box mt={1}>عرض جعرافیایی : {item.lat}</Box>
                      <Box mt={1}>طول جفرافیایی: {item.lng}</Box>

                      <Box
                        sx={{ width: "100%" }}
                        display={"flex"}
                        justifyContent={"center"}
                        gap={1}
                        mt={1}
                      >
                        <Button
                          variant="contained"
                          onClick={() => {
                            onClose(item.id);
                          }}
                          color="success"
                          fullWidth
                        >
                          انتخاب
                        </Button>
                      </Box>
                    </Box>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
        {/* {loading && (
          <Box
            sx={{
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
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            <CircularProgress />
          </Box>
        )} */}
      </Box>
    );
  }

  return (
    <CustomModal active={pathModalInfo.active} onClose={() => onClose()}>
      {currentMap()}
    </CustomModal>
  );
}
