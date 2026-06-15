"use client";
import Image from "next/image";
import { useState } from "react";
import { OtpInput } from "../../components/OtpInput";
import axios from "axios";
import { useUser } from "@/app/user-provider";
import { showErrorToast, showSuccessToast } from "@/lib/show-app-toast";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const { setAccessToken, setRefreshToken } = useUser();

  const isEmailValid = (email: string) => {
    if (email.trim() === "") {
      return "Мэйл хаягаа оруулна уу.";
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return "Зөв мейл хаяг оруулна уу.";
    }
    return "";
  };
  const handleSignup = async () => {
    const signError = isEmailValid(email);
    setError(signError);
    if (signError !== "") {
      setIsValid(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post("/api/auth", { email });
      setIsValid(true);
      setLoading(false);
      showSuccessToast(
        "Verification code sent",
        response.data.message || "Please check your email.",
      );
    } catch (err) {
      setIsValid(false);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Алдаа гарлаа.");
      } else {
        showErrorToast("Something went wrong", "Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/otp", { email, otp });
      setLoading(false);
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      showSuccessToast(
        "Signed in successfully",
        response.data.message || "Welcome back to NomNom.",
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Something went wrong");
      } else {
        showErrorToast("Something went wrong", "Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (loading) return;
    if (isValid) {
      if (otp.length === 6) {
        handleOtp();
      }
    } else {
      setIsSubmitted(true);
      handleSignup();
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center p-5">
      <div className="w-7xl flex gap-12 items-center h-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-104">
          <button
            type="button"
            disabled={isValid === false}
            onClick={() => {
              setIsValid(false);
              setOtp("");
              setError("");
            }}
            className="flex cursor-pointer items-center justify-center h-9 w-9 border border-[#E4E4E7] rounded-md bg-white disabled:opacity-0 disabled:cursor-auto"
          >
            <Image src="/icons/back.svg" alt="back" width={16} height={16} />
          </button>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-[#09090B] text-2xl">
              {isValid ? "Enter verification code" : "Welcome back"}
            </span>
            <span className="text-base font-normal text-[#71717A]">
              {isValid
                ? `We sent a 6-digit code to your email. Please check your email.`
                : "Log in or sign up to explore your favorite dishes."}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {isValid ? (
              <OtpInput otp={otp} setOtp={setOtp} />
            ) : (
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (isSubmitted) {
                    const liveError = isEmailValid(e.target.value);
                    setError(liveError);
                  }
                }}
                required={true}
                type="text"
                className={`w-full h-9 outline-none px-3 border rounded-md placeholder:text-sm placeholder:text-[#71717A] placeholder:font-normal ${error ? "border-[#EF4444]" : "border-[#E4E4E7]"}`}
                placeholder="Enter your email address"
              />
            )}
            {error && (
              <span className="text-sm font-normal text-[#EF4444]">
                {error}
              </span>
            )}
          </div>
          {isValid ? (
            <>
              <button
                type="submit"
                disabled={otp.length < 6 || loading}
                className="h-9 flex items-center justify-center w-full rounded-md cursor-pointer text-sm font-medium text-[#FAFAFA] bg-[#18181B] disabled:opacity-20 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        box-shadow="0 0 10px rgba(0,0,0,0.5)"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </>
                ) : (
                  "Confirm OTP"
                )}
              </button>
              <div className="flex justify-center gap-3 text-base font-normal">
                <span className="text-[#71717A]">Didn&apos;t receive OTP?</span>
                <span
                  className="text-[#2563EB] cursor-pointer"
                  onClick={handleSignup}
                >
                  Resend code
                </span>
              </div>
            </>
          ) : (
            <button
              type="submit"
              className="h-9 w-full flex items-center justify-center rounded-md cursor-pointer text-sm font-medium text-[#FAFAFA] bg-[#18181B] disabled:opacity-20 disabled:cursor-not-allowed"
              disabled={error !== "" || loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      box-shadow="0 0 10px rgba(0,0,0,0.5)"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </>
              ) : (
                "Continue"
              )}
            </button>
          )}
        </form>
        <div
          className="w-214 h-226 rounded-3xl overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/icons/bg.svg)" }}
        ></div>
      </div>
    </div>
  );
}
