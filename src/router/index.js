import { createBrowserRouter } from 'react-router-dom'

import Login from '@/pages/Login'
import GreekLayout from '@/pages/Layout'
import { AuthRoute } from '@/components/AuthRoute'
import { lazy, Suspense } from 'react'
// import Home from '@/pages/Home'
// import Article from '@/pages/Article'
// import Publish from '@/pages/Publish'

// 1. lazy函数 引入组件
const Home = lazy(() => import('@/pages/Home'))
const Article = lazy(() => import('@/pages/Article'))
const Publish = lazy(() => import('@/pages/Publish'))
// 2. 使用内置的 Suspense 组件 渲染路由组件  异步渲染 

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthRoute><GreekLayout /></AuthRoute>,
    children: [{
      index: true,      // index: true 表示默认子路由，不需要 path
      element: <Suspense fallback={'加载中'}><Home /></Suspense>
    },
    {
      path: 'article',  // 使用相对路径，不要加前导斜杠
      element: <Suspense fallback={'加载中'}> <Article /> </Suspense>
    },
    {
      path: 'publish',
      element: <Suspense fallback={'加载中'}><Publish /></Suspense>
    }]
  },
  {
    path: '/login',
    element: <Login />,
  },
])

export default router