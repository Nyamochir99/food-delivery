"use client";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [isUser, setIsUser] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const isEmailValid = (email: string) => {
    if (email.trim() === "") {
      setError("Мэйл хаягаа оруулна уу.");
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      setError("Зөв мейл хаяг оруулна уу.");
    } else {
      setError("");
    }
  };
  const handleSignup = () => {
    if (error === "") {
      setIsValid(true);
    }
  };

  return (
    <div className="flex w-full h-screen justify-center items-center p-5">
      <div className="w-7xl flex gap-12 items-center h-full">
        <div className="flex flex-col gap-6 w-104">
          <button className="flex items-center justify-center h-9 w-9 border border-[#E4E4E7] rounded-md bg-white">
            <Image src="/icons/back.svg" alt="back" width={16} height={16} />
          </button>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-[#09090B] text-2xl">
              Create your account
            </span>
            <span className="text-base font-normal text-[#71717A]">
              Sign up to explore your favorite dishes.
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {isValid ? (
              <></>
            ) : (
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (isSubmitted) {
                    isEmailValid(e.target.value);
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
            <button className="h-9 w-full rounded-md cursor-pointer text-sm font-medium text-[#FAFAFA] bg-[#18181B] disabled:opacity-20 disabled:cursor-not-allowed">
              Confirm OTP
            </button>
          ) : (
            <button
              className="h-9 w-full rounded-md cursor-pointer text-sm font-medium text-[#FAFAFA] bg-[#18181B] disabled:opacity-20 disabled:cursor-not-allowed"
              disabled={error !== ""}
              onClick={() => {
                setIsSubmitted(true);
                isEmailValid(email);
                handleSignup();
              }}
            >
              Let&apos;s Go
            </button>
          )}
          <div className="flex justify-center gap-3 text-base font-normal">
            <span className="text-[#71717A]">Already have an account?</span>
            <span className="text-[#2563EB] cursor-pointer">Log in </span>
          </div>
        </div>
        <div
          className="w-214 h-226 rounded-3xl overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/icons/bg.svg)" }}
        ></div>
      </div>
    </div>
  );
}
