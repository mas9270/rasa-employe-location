"use client"
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Menu } from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import { reactToastify } from '@/utils/toastify';


type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function SwipeableTemporaryDrawer() {

  const pathname = usePathname()
  const [isVerify, setIsVeryfy] = useState<boolean>(false)

  function verify() {
    fetch("/api/auth/verify-token", {
      method: "GET",
      credentials: "include"
    })
      .then((res) => res.json())
      .then((res: any) => {
        if (res.verify) {
          setIsVeryfy(true)
        }
        else {
          setIsVeryfy(false)
        }
      })
      .catch(() => {
        setIsVeryfy(false)
      })
  }

  useEffect(() => {
    verify()
  }, [pathname])

  return (
    <>
      {isVerify && <SwipeableTemporaryDrawerContent />}
    </>
  )

}


function SwipeableTemporaryDrawerContent() {

  const [state, setState] = useState<boolean>(false);
  const anchor = "left"
  const theme = useTheme();
  const currentPath = usePathname()


  const currentList = [
    { path: "/users-location", text: "جایگاه کاربران" },
    { path: "/users", text: "کاربران" },
    { path: "/locations", text: "جایگاه ها" },
  ]

  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSmUp = useMediaQuery(theme.breakpoints.only('sm'));
  const isMdDown = useMediaQuery(theme.breakpoints.only('md'));

  const toggleDrawer = (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState(open);
    };


  const menuOnDrawer = () => {

    return (
      <>
        <Menu
          sx={{ fontSize: "24px", cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={(e) => {
            e.stopPropagation()
            setState(true)
          }}
        />
        <SwipeableDrawer
          anchor={anchor}
          open={state}
          onClose={toggleDrawer(anchor, false)}
          onOpen={toggleDrawer(anchor, true)}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
          >
            <List>
              {currentList.map((item, index) => {
                return (
                  <Link key={index} href={item.path} style={{ textDecoration: "none", color: "inherit" }}>
                    <ListItem disablePadding >
                      {/* onClick={() => { router.push(item.path) }} */}
                      <ListItemButton >
                        {/* <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon> */}
                        <ListItemText >
                          <Box sx={{ color: item.path === currentPath ? "red" : "" }}>{item.text}</Box>
                        </ListItemText>
                      </ListItemButton>
                    </ListItem>
                  </Link>
                )
              })}
            </List>
            {/* <Divider /> */}
          </Box>
        </SwipeableDrawer>
      </>
    )
  }

  const menuOnList = () => {
    return (
      <Box display={"flex"}>
        {currentList.map((item, index) => {
          return (
            <Link key={index} href={item.path} style={{ textDecoration: "none", color: "inherit" }}>
              <Box
                px={2}
                sx={{ cursor: "pointer", color: item.path === currentPath ? "red" : "" }}
              >
                {item.text}
              </Box>
            </Link>
          )
        })}
      </Box>
    )
  }

  return (
    <>
      {isXs || isSmUp || isMdDown ? menuOnDrawer() : menuOnList()}
    </>
  );
}