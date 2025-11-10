export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/auth/reset-password") return;
  return navigateTo("/user/home");
});
