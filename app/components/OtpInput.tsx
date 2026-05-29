import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export const OtpInput = ({
  otp,
  setOtp,
}: {
  otp: string;
  setOtp: (value: string) => void;
}) => {
  return (
    <InputOTP
      value={otp}
      onChange={(value) => setOtp(value)}
      id="digits-only"
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
    >
      <div className="flex gap-2 w-full justify-center">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className="w-9 h-9 text-lg font-medium border border-[#E4E4E7] rounded-lg bg-white outline-none data-[active=true]:border-[#2563EB] data-[active=true]:ring-2 data-[active=true]:ring-[#2563EB]/20 transition-all"
          />
        ))}
      </div>
    </InputOTP>
  );
};
