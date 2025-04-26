import React, { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/store/authStore";

interface GoogleAuthProps {
  buttonText?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: () => void;
  useOneTap?: boolean;
}

// Interface for Google credential response
interface GoogleCredentialResponse {
  credential: string;
}

// Interface for decoded JWT from Google
interface GoogleJwtPayload {
  iss: string;
  nbf: number;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
  family_name?: string;
  iat: number;
  exp: number;
  jti: string;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({
  buttonText = "Sign in with Google",
  className = "",
  onSuccess,
  onError,
  useOneTap = true,
}) => {
  const { loginWithGoogle } = useAuthStore();

  useEffect(() => {
    // Check for stored google token on component mount
    const storedData = sessionStorage.getItem("google_user_data");
    if (storedData) {
      try {
        const userData = JSON.parse(storedData);
        loginWithGoogle(userData);
      } catch (error) {
        console.error("Error parsing stored Google user data:", error);
        sessionStorage.removeItem("google_user_data");
      }
    }
  }, [loginWithGoogle]);

  // Function to handle credential response from Google
  const handleCredentialResponse = (response: GoogleCredentialResponse) => {
    try {
      // Decode the JWT token
      const decodedToken = jwtDecode<GoogleJwtPayload>(response.credential);

      // Store the credential for future use
      sessionStorage.setItem("google_token", response.credential);

      // Login with Google using our authStore
      loginWithGoogle(decodedToken);

      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error handling Google credential response:", error);
      if (onError) onError();
    }
  };

  // Use Google login hook for token-based flow
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info with the access token
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = await userInfoResponse.json();

        // Login with Google using our authStore
        loginWithGoogle(userInfo);

        // Call onSuccess callback if provided
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Error fetching Google user info:", error);
        if (onError) onError();
      }
    },
    onError: () => {
      console.error("Google login failed");
      if (onError) onError();
    },
  });

  return (
    <button
      onClick={() => login()}
      className={`flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors ${className}`}
    >
      <svg
        width="18"
        height="18"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        ></path>
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        ></path>
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        ></path>
      </svg>
      <span>{buttonText}</span>
    </button>
  );
};

export default GoogleAuth;
