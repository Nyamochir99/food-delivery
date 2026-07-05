export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const OTP_REGEX = /^\d{6}$/;

export const isValidEmail = (email: string) => EMAIL_REGEX.test(email);

export const isValidOtp = (otp: string) => OTP_REGEX.test(otp);
