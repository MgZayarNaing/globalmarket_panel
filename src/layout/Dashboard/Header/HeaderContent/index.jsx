// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

// project import
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// project import
import { GithubOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
    const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
    const location = useLocation();


    return (
        <>
           {location.pathname === "/dashboard/default" && <> </>}
           {location.pathname === "/userslist" && <Search />}
           {location.pathname === "/imageslider" && <Search />}
           {location.pathname === "/future" && <Search />}
           {location.pathname === "/cointype" && <Search />}
           {location.pathname === "/networks" && <Search />}
           {location.pathname === "/coin" && <Search />}
           {location.pathname === "/deposit" && <Search />}
           {location.pathname === "/withdraw" && <Search />}

            {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
            <IconButton
                component={Link}
                href="#"
                target="_blank"
                disableRipple
                color="secondary"
                title=""
                sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
            >
                <GithubOutlined />
            </IconButton>

            <Notification />
            {!downLG && <Profile />}
            {downLG && <MobileSection />}
        </>
    );
}
