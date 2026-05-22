import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex w-full h-full justify-center items-center p-5">
      <div className="w-7xl flex gap-12">
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
            className="w-full h-9 border border-[#E4E4E7] rounded-md placeholder:text-sm placeholder:text-[#71717A] placeholder:font-normal"
            placeholder="Enter your email address"
          />
          <button>Let&apos;s Go</button>
        </div>
      </div>
    </div>
  );
}
