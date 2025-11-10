export async function updateUserProfile(formData: FormData, token: string) {
  const res = await fetch("http://localhost:4000/users/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lưu hồ sơ thất bại");
  return data;
}

export async function changePasswordApi(
  token: string,
  currentPassword: string,
  newPassword: string
) {
  const res = await fetch("http://localhost:4000/auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, currentPassword, newPassword }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Đổi mật khẩu thất bại");
  return data;
}
