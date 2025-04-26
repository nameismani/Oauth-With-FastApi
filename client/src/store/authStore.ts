import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  sub?: string; // Added for Google OAuth
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (code: string) => Promise<void>;
  logout: () => void;
  // fetchUser: () => Promise<void>;
  getGoogleAuthUrl: () => Promise<string>;
  loginWithGoogle: (userData: any) => void; // New method for client-side auth
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // New method for client-side Google authentication
      loginWithGoogle: (userData: any) => {
        if (!userData) {
          return;
        }

        try {
          // Format user data from Google OAuth
          const user = {
            id: userData.sub || userData.id,
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            sub: userData.sub,
          };

          set({
            user,
            isAuthenticated: true,
            error: null,
          });

          // Store in session storage for persistence
          sessionStorage.setItem("google_user_data", JSON.stringify(user));
        } catch (error) {
          console.error("Error logging in with Google:", error);
          set({ error: "Failed to login with Google" });
        }
      },

      login: async (code: string) => {
        set({ isLoading: true, error: null });

        try {
          console.log(code, "asdfsfda");
          const response = await axios.post(`${API_URL}/auth/google/callback`, {
            code,
          });

          if (response.data.success) {
            const { access_token, user } = response.data;

            // Store token in cookie
            Cookies.set("token", access_token, { expires: 1 }); // 1 day

            // Set axios default header
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${access_token}`;

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              error: response.data.message || "Login failed",
              isLoading: false,
            });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
        }
      },

      logout: () => {
        // Remove token from cookie
        Cookies.remove("token");

        // Remove authorization header
        delete axios.defaults.headers.common["Authorization"];

        // Clear any Google auth data
        sessionStorage.removeItem("google_user_data");
        sessionStorage.removeItem("google_token");

        set({
          user: null,
          isAuthenticated: false,
        });
      },

      // fetchUser: async () => {
      //     const token = Cookies.get('token');

      //     if (!token) {
      //         set({ isAuthenticated: false });
      //         return;
      //     }

      //     set({ isLoading: true });

      //     try {
      //         // Set axios default header
      //         axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      //         const response = await axios.get(`${API_URL}/auth/me`);

      //         if (response.data.success) {
      //             set({
      //                 user: response.data.user,
      //                 isAuthenticated: true,
      //                 isLoading: false
      //             });
      //         } else {
      //             // Token might be invalid
      //             Cookies.remove('token');
      //             delete axios.defaults.headers.common['Authorization'];

      //             set({
      //                 user: null,
      //                 isAuthenticated: false,
      //                 isLoading: false
      //             });
      //         }
      //     } catch (error) {
      //         // Token might be invalid
      //         Cookies.remove('token');
      //         delete axios.defaults.headers.common['Authorization'];

      //         set({
      //             user: null,
      //             isAuthenticated: false,
      //             isLoading: false
      //         });
      //     }
      // },

      getGoogleAuthUrl: async () => {
        try {
          const response = await axios.get(`${API_URL}/auth/google/url`);
          console.log(response, "sdafdasf");
          return response.data.url;
        } catch (error) {
          set({ error: "Failed to get authentication URL" });
          return "";
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
