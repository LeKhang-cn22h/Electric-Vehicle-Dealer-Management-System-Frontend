import { ref } from "vue";

export function useAuth() {
  const isSubmitting = ref(false);
  const serverError = ref<string | null>(null);
  const serverSuccess = ref<string | null>(null);
  const login = async (email: string, password: string) => {
    isSubmitting.value = true;
    serverError.value = null;
    serverSuccess.value = null;

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      // Lấy token & user từ BE
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      const user = data.user;
      const role = user?.user_metadata?.role;

      const userId = user?.id;

      if (typeof localStorage !== "undefined") {
        localStorage.setItem("access_token", accessToken);
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
        if (userId) localStorage.setItem("user_id", userId);
      }

      // (Optional) vẫn lưu vào cookie nếu muốn dùng ở SSR
      const tokenCookie = useCookie("access_token", {
        maxAge: 60 * 60 * 24 * 7, // 7 ngày
        path: "/",
      });
      tokenCookie.value = accessToken;

      const roleCookie = useCookie("role");
      roleCookie.value = role;

      return { success: true, role, user };
    } catch (err: any) {
      serverError.value = err.message;
      return { success: false };
    } finally {
      isSubmitting.value = false;
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    isSubmitting.value = true;
    serverError.value = null;
    serverSuccess.value = null;

    try {
      const res = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role: "customer",
          username: email.split("@")[0],
          dealer_id: "",
          phone: "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      serverSuccess.value = "Đăng ký thành công! Đang chuyển hướng...";
      return { success: true, data };
    } catch (err: any) {
      serverError.value = err.message || "Có lỗi xảy ra";
      return { success: false };
    } finally {
      isSubmitting.value = false;
    }
  };

  const forgotPassword = async (email: string) => {
    isSubmitting.value = true;
    serverError.value = null;
    serverSuccess.value = null;

    try {
      const res = await fetch("http://localhost:4000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gửi email thất bại.");
      }

      serverSuccess.value =
        data.message || "Đã gửi link đặt lại mật khẩu đến email của bạn!";
      return { success: true };
    } catch (err: any) {
      serverError.value =
        err?.message || "Gửi email thất bại. Vui lòng thử lại.";
      return { success: false };
    } finally {
      isSubmitting.value = false;
    }
  };
  return {
    isSubmitting,
    serverError,
    serverSuccess,
    login,
    register,
    forgotPassword,
  };
}
