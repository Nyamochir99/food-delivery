import Image from "next/image";

export default function LoginPage() {
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
          <input
            type="text"
            className="w-full h-9 outline-none px-3 border border-[#E4E4E7] rounded-md placeholder:text-sm placeholder:text-[#71717A] placeholder:font-normal"
            placeholder="Enter your email address"
          />
          <button className="h-9 2-full rounded-md cursor-pointer text-sm font-medium text-[#FAFAFA] bg-[#18181B] disabled:opacity-20 disabled:cursor-not-allowed">
            Let&apos;s Go
          </button>
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
