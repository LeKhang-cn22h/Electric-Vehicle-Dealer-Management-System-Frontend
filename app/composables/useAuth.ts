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

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        serverSuccess.value = "Đăng nhập thành công! Đang chuyển hướng...";
        return { success: true, data };
      }

      throw new Error("Không tìm thấy access_token trong phản hồi");
    } catch (err: any) {
      serverError.value = err.message || "Lỗi kết nối đến máy chủ";
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

  return {
    isSubmitting,
    serverError,
    serverSuccess,
    login,
    register,
  };
}
