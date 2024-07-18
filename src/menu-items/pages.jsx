// assets
import {
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined
} from '@ant-design/icons';

// icons
const icons = {
    FontSizeOutlined,
    BgColorsOutlined,
    BarcodeOutlined,
    AntDesignOutlined,
    LoadingOutlined,
    AppstoreAddOutlined
};

// ============================== MENU ITEMS - UTILITIES ============================== //

const pages = {
    id: 'User',
    title: 'User',
    type: 'group',
    children: [
      {
        id: 'userlist',
        title: 'UserList',
        type: 'item',
        url: '/userslist',
        icon: icons.AntDesignOutlined,
      },
      {
        id: 'imageslider',
        title: 'ImageSlider',
        type: 'item',
        url: '/imageslider',
        icon: icons.AntDesignOutlined,
      },
      {
        id: 'future',
        title: 'Future',
        type: 'item',
        url: '/future',
        icon: icons.AntDesignOutlined,
      },
      {
        id: 'cointype',
        title: 'CoinType',
        type: 'item',
        url: '/cointype',
        icon: icons.AntDesignOutlined,
      },
      {
        id: 'networks',
        title: 'Networks',
        type: 'item',
        url: '/networks',
        icon: icons.AntDesignOutlined,
      },
      {
        id: 'coin',
        title: 'Coin',
        type: 'item',
        url: '/coin',
        icon: icons.AntDesignOutlined,
      },
      {
        id: 'deposit',
        title: 'Deposit',
        type: 'item',
        url: '/deposit',
        icon: icons.AntDesignOutlined,
      },
    ]
};

export default pages;
