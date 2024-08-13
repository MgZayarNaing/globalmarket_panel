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
    title: '',
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
      {
        id: 'withdraw',
        title: 'Withdraw',
        type: 'item',
        url: '/withdraw',
        icon: icons.AntDesignOutlined,
      },
      {
        id: 'round',
        title: 'Round',
        type: 'item',
        url: '/round',
        icon: icons.AntDesignOutlined,
      },
      {
        id: 'roundview',
        title: 'Roundview',
        type: 'item',
        url: '/roundview',
        icon: icons.AntDesignOutlined,
      },
    ]
};

export default pages;
