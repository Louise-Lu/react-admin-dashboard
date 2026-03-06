import { Layout, Menu, Popconfirm } from 'antd'
import {
    HomeOutlined,
    DiffOutlined,
    EditOutlined,
    LogoutOutlined,
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { clearUserInfo, fetchUserInfo } from '@/store/modules/user'

const { Header, Sider } = Layout

const items = [
    {
        label: '首页',
        key: '/',
        icon: <HomeOutlined />,
    },
    {
        label: '文章管理',
        key: '/article',
        icon: <DiffOutlined />,
    },
    {
        label: '创建文章',
        key: '/publish',
        icon: <EditOutlined />,
    },
]

const GeekLayout = () => {
    // 获取个人profile 
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchUserInfo())
    }, [dispatch])

    const { userInfo } = useSelector(state => state.user)
    // console.log(userInfo);

    const onConfirm = () => {
        dispatch(clearUserInfo())
        navigate('/login')
    }
    const navigate = useNavigate()
    const onMenuClick = (path) => {
        // 根据路由路径跳转
        navigate(path.key)
    }

    // 获取当前url的路由路径
    const location = useLocation()
    const selectedLoaction = location.pathname
    return (
        <Layout>
            <Header className="header">
                <div className="logo" />
                <div className="user-info">
                    <span className="user-name">{userInfo.name}</span>
                    <span className="user-logout">
                        <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={onConfirm}>
                            <LogoutOutlined /> 退出
                        </Popconfirm>
                    </span>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        theme="dark"
                        selectedKeys={[selectedLoaction]}
                        onClick={onMenuClick}
                        items={items}
                        style={{ height: '100%', borderRight: 0 }}>
                    </Menu>
                </Sider>
                <Layout className="layout-content" style={{ padding: 20 }}>
                    <Outlet />
                </Layout>
            </Layout>
        </Layout>
    )
}
export default GeekLayout