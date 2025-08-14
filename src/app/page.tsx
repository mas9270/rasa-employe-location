"use client";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Stack, Modal, Divider, Box, CircularProgress, InputAdornment } from '@mui/material';
import * as z from 'zod';
import { reactToastify } from "@/utils/toastify";
import CustomFieldSet from "@/components/ui/customFieldset";
import { useRouter } from "next/navigation";


const schema = z.object({
  username: z.string().min(1, 'نام کاربری را وارد کنید'),
  password: z.string().min(1, 'کلمه عبور را وارد کنید')
});

export default function Home() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      username: "",
      password: ""
    },
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  function onSubmit(data: any) {

    setLoading(true)

    fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res?.error) {
          reactToastify({
            type: "error",
            message: res.error
          })
          setLoading(false)
        }
        else {
          reactToastify({
            type: "success",
            message: "عملیات با موفقیت انجام شد"
          })
          router.push("/users-location")
        }

      })
      .catch((err) => {
        console.log(err)
        reactToastify({
          type: "error",
          message: err
        })
        setLoading(false)
      })

  }

  return (
    <Box sx={{ width: "100%", flexGrow: 1 }} display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1}>
      <CustomFieldSet width={"400px"} title="ورود">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2} mt={1}>
            <TextField
              label="نام کاربری"
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="کلمه عبور"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              disabled={loading}
            />
            <Button type="submit" variant="contained" disabled={loading} loading={loading}>
              ذخیره
            </Button>
          </Stack>
        </form>
      </CustomFieldSet>

    </Box>
  )
}

