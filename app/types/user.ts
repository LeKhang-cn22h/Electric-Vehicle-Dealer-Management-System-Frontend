export type UserMe = {
  id: string;
  fullName?: string;
  full_name?: string;
  email: string;
  role?: string;
  phone?: string;
  user_metadata?: {
    full_name?: string;
    username?: string;
    phone?: string;
    role?: string;
  };
  [key: string]: any;
};
