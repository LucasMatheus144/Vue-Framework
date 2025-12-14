import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../services/storageService"

const routes = [
  {
    path: "/home",
    name: "home",
    component: () => import("../view/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path:"/login",
    name:"auth",
    component: () => import("../view/login.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// rota exige autenticação e não está logado
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return false;
  }
  if (to.path === "/" && !auth.isAuthenticated) {
    return "/login";
  }

  return true;
});

export default router;
