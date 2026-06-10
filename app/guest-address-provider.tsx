"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type GuestAddressStore = {
  guestAddress: string;
  setGuestAddress: (address: string) => void;
};

export const useGuestAddressStore = create<GuestAddressStore>()(
  persist(
    (set) => ({
      guestAddress: "",
      setGuestAddress: (guestAddress) => set({ guestAddress }),
    }),
    { name: "guest-address-storage" },
  ),
);

export const useGuestAddress = () => {
  const { guestAddress, setGuestAddress } = useGuestAddressStore();
  return { guestAddress, setGuestAddress };
};
