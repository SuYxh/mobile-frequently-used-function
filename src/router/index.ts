import { createRouter, createWebHashHistory } from 'vue-router'

export const constantRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
  },
  // pinia 测试
  {
    path: '/pinia',
    name: 'PiniaPage',
    component: () => import('@/views/test-page/PiniaTest.vue'),
  },
   // http 测试
   {
    path: '/http',
    name: 'HttpPage',
    component: () => import('@/views/test-page/HttpTest.vue'),
  },
  // 404 路由
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/404/index.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

export default router
