"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";

export default function SearchLocation(props: {
  onSearch: (latLng?: any[] | null, searchText?: string | null) => void;
}) {
  const { onSearch } = props;
  const [query, setQuery] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await res.json();
    setLoading(false);
    if (data.length > 0) {
      const { lat, lon } = data[0];
      onSearch([parseFloat(lat), parseFloat(lon)], query);
    } else {
      onSearch(null);
    }
  };

  const handleClear = () => {
    setQuery("");
  };

  useEffect(() => {
    setLoading(true);
    if (!query) {
      setDebouncedValue("");
      setLoading(false);
      onSearch(null);
      return () => {};
    }

    const handler = setTimeout(() => {
      setDebouncedValue(query);
    }, 1000); // ۲ ثانیه تأخیر

    return () => {
      clearTimeout(handler); // هر بار تایپ جدید، تایمر قبلی پاک میشه
    };
  }, [query]);

  useEffect(() => {
    if (debouncedValue) {
      handleSearch();
    } else {
      setLoading(false);
    }
  }, [debouncedValue]);

  return (
    <Box
      sx={{
        width: "auto",
        display: "flex",
        alignItems: "center",
        flexDirection: {
          xs: "column",
          sm: "column",
          md: "row",
          lg: "row",
          xl: "row",
        },
      }}
      gap={2}
    >
      <TextField
        variant="outlined"
        sx={{ width: "300px" }}
        size="small"
        fullWidth
        placeholder="مورد جستجو را وارد کنید"
        value={query}
        onChange={(e) => {
          setQuery(e.target?.value);
        }}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClear}
                  edge="end"
                  sx={{ visibility: debouncedValue ? "visible" : "hidden" }}
                >
                  <CloseIcon />
                </IconButton>
                {loading ? (
                  <IconButton edge="end">
                    <CircularProgress size={20} />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleSearch} edge="end">
                    <SearchIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          },
        }}
      />
      {/* <Box >{debouncedValue}</Box> */}
    </Box>
  );
}
