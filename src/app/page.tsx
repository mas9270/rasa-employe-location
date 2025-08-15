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

  const [loading, setLoading] = useState<boolean>(false)
  const [loginOrRegister, setLoginOrRegister] = useState<boolean>(false)



  function isLogin() {
    return (
      <Box sx={{ width: "100%" }} mt={1} mb={1}>
        <Button
          variant="contained"
          loading={loading}
          color="info"
          fullWidth
          onClick={() => {
            setLoginOrRegister((presState) => !presState)
          }}
        >
          {!loginOrRegister ? "ثبت نام " : "فرم ورود"}
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ width: "100%", flexGrow: 1 }} display={"flex"} justifyContent={"center"} alignItems={"center"} gap={1}>
      <CustomFieldSet width={"400px"} title={loginOrRegister ? "ثبت نام" : "ورود"}>

        {loginOrRegister
          ? <Register loading={loading} setLoading={setLoading} setLoginOrRegister={setLoginOrRegister} />
          : <Login loading={loading} setLoading={setLoading} />
        }

        {isLogin()}

      </CustomFieldSet>
    </Box>
  )
}

function Login(props: { loading: any, setLoading: any }) {
  const { loading, setLoading } = props

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      password: ""
    },
    resolver: zodResolver(schema),
  });

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
        <Button type="submit" variant="contained" loading={loading} color={"success"}>
          ذخیره
        </Button>
      </Stack>
    </form>
  )
}

function Register(props: { loading: any, setLoading: any, setLoginOrRegister: any }) {
  const { loading, setLoading, setLoginOrRegister } = props

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      username: "",
      password: ""
    },
    resolver: zodResolver(schema),
  });

  function onSubmit(data: any) {

    setLoading(true)

    fetch("/api/auth/register", {
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
          setLoading(false)
          setLoginOrRegister(false)
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
          type="text"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth
          disabled={loading}
        />
        <Button type="submit" variant="contained" loading={loading} color={"success"}>
          ذخیره
        </Button>
      </Stack>
    </form>
  )
}

