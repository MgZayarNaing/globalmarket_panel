import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';


const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const UserList = Loadable(lazy(() => import('pages/users/UserList')));
const ImageSlider = Loadable(lazy(() => import('pages/imageslider/ImageSlider')));
const Future = Loadable(lazy(() => import('pages/future/Future')));
const CoinType = Loadable(lazy(() => import('pages/cointype/CoinType')));
const Networks = Loadable(lazy(() => import('pages/networks/Networks')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'userslist',
      element: <UserList />
    },
    {
      path: 'imageslider',
      element: <ImageSlider />
    },
    {
      path: 'future',
      element: <Future />
    },
    {
      path: 'cointype',
      element: <CoinType />
    },
    {
      path: 'networks',
      element: <Networks />
    },

  ]
};

export default MainRoutes;
