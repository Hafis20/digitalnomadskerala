"use client";

import { Button } from "./ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import axiosInstance from "@/utils/axiosInstance";
import { useContext, useState } from "react";
import GlobalContext from "@/app/provider/GlobalContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ToastStyles } from "@/lib/utils";
import NavbarProfile from "./NavbarProfile";

export default function GoogleSignin() {
  const { isLoggedIn, user, setUser, setIsLoggedIn } =
    useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const googleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      setLoading(true);
      try {
        const response = await axiosInstance.post("/auth/signin", {
          access_token: tokenResponse.access_token,
        });
        console.log(response.data);
        setUser(response.data.user);
        setIsLoggedIn(true);
        toast.success(
          <p className="text-white font-bold">Login Successful</p>,
          ToastStyles.success
        );
      } catch (error) {
        console.log(error);
        toast.error(
          <p className="text-white font-bold">Login Failed</p>,
          ToastStyles.error
        );
      } finally {
        setLoading(false);
      }
    },
  });
  const signoutHandler = async () => {
    try {
      const response = await axiosInstance.get("/auth/signout");
      console.log(response.data);
      setUser(null);
      setIsLoggedIn(false);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoggedIn) {
    return (
      <NavbarProfile user={user} onSignOut={signoutHandler}/>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      // whileHover={{ scale: 1.03 }}
      className="flex justify-center"
    >
      <Button
        disabled={loading}
        onClick={() => googleSignIn()}
        size="sm"
        className="bg-emerald-600 hover:bg-emerald-700 px-5 shadow-lg flex items-center justify-center gap-3 transition-all duration-300 group cursor-pointer"
      >
        <div className="bg-white p-0.5 rounded-full group-hover:bg-emerald-50 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </div>
        <span className="text-white">Join Now</span>
      </Button>
    </motion.div>
  );
}
