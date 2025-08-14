import type { Metadata } from "next";
import localFont from "next/font/local"
import "./globals.css";
import StoreProvider from "@/providers/storeProvider";
import MuiProviders from "@/providers/muiProviders";
import { CssBaseline, Box } from "@mui/material";
import Header from "@/components/layouts/header/header";
import Main from "@/components/layouts/main/main";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';


const iranSanse = localFont({
  src: [
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Regular.woff2",
      weight: "normal",
      style: "normal",
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Bold.woff2",
      weight: "bold",
      style: "normal"
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Heavy.woff2",
      weight: "1000",
      style: "normal"
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-ExtraBlack.woff2",
      weight: "950",
      style: "normal"
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Black.woff2",
      weight: "900",
      style: "normal"
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-ExtraBold.woff2",
      weight: "800",
      style: "normal"
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-DemiBold.woff2",
      weight: "600",
      style: "normal"
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Medium.woff2",
      weight: "500",
      style: "normal"
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Light.woff2",
      weight: "300",
      style: "normal"
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-UltraLight.woff2",
      weight: "200",
      style: "normal"
    },
    {
      path: "../../public/fonts/IranSansX/Webfonts/fonts/woff2/IRANSansX-Thin.woff2",
      weight: "100",
      style: "normal"
    },
  ],
})


export const metadata: Metadata = {
  title: "رسا جوبولی",
  description: "تعیین منطفه کارکنان",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${iranSanse.className}`}>
      {/* <body > */}
        <StoreProvider>
          <MuiProviders>
            <CssBaseline />
            <Box bgcolor={"background.default"} color={"text.primary"} minHeight={"100vh"} display="flex" flexDirection="column" justifyContent={"space-between"}>
              <Header />
              <Main >
                {children}
              </Main>
              {/* <Footer /> */}
            </Box>
            <ToastContainer />
          </MuiProviders>
        </StoreProvider>
      </body>
    </html>
  );
}
