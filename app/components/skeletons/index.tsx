import { Skeleton } from "@/components/ui/skeleton";

export const FoodCardSkeleton = () => (
  <div className="flex h-85.5 w-100 flex-col gap-5 rounded-[20px] bg-white p-4">
    <Skeleton className="h-52.5 w-full rounded-xl bg-[#E4E4E7]" />
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-3">
        <Skeleton className="h-7 w-32 rounded-md bg-[#E4E4E7]" />
        <Skeleton className="h-6 w-16 rounded-md bg-[#E4E4E7]" />
      </div>
      <Skeleton className="h-4 w-full rounded-md bg-[#E4E4E7]" />
      <Skeleton className="h-4 w-4/5 rounded-md bg-[#E4E4E7]" />
    </div>
  </div>
);

export const MenuSkeleton = () => (
  <div className="flex w-full flex-col items-center gap-13.5 py-22">
    {[0, 1].map((section) => (
      <div key={section} className="flex w-full justify-center">
        <div className="flex w-7xl flex-col gap-13.5">
          <Skeleton className="h-9 w-48 rounded-md bg-white/20" />
          <div className="grid grid-cols-3 gap-9">
            {Array.from({ length: 3 }).map((_, index) => (
              <FoodCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const FoodMenuSkeleton = () => (
  <div className="flex flex-col gap-8">
    <section className="rounded-[20px] bg-white p-6">
      <Skeleton className="mb-4 h-5 w-36 rounded-md bg-[#E4E4E7]" />
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-9 w-28 rounded-full bg-[#E4E4E7]"
          />
        ))}
      </div>
    </section>

    {[0, 1].map((section) => (
      <section key={section} className="flex flex-col gap-6">
        <Skeleton className="h-7 w-56 rounded-md bg-[#E4E4E7]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex h-85.5 flex-col gap-5 rounded-[20px] bg-white p-4"
            >
              <Skeleton className="h-52.5 w-full rounded-xl bg-[#E4E4E7]" />
              <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-3">
                  <Skeleton className="h-7 w-32 rounded-md bg-[#E4E4E7]" />
                  <Skeleton className="h-6 w-16 rounded-md bg-[#E4E4E7]" />
                </div>
                <Skeleton className="h-4 w-full rounded-md bg-[#E4E4E7]" />
              </div>
            </div>
          ))}
        </div>
      </section>
    ))}
  </div>
);

export const OrdersTableSkeleton = ({ rows = 8 }: { rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, index) => (
      <tr key={index} className="border-b border-[#E4E4E7]">
        <td className="px-3 py-4">
          <Skeleton className="size-4 rounded bg-[#E4E4E7]" />
        </td>
        <td className="px-3 py-4">
          <Skeleton className="h-4 w-6 rounded-md bg-[#E4E4E7]" />
        </td>
        <td className="px-3 py-4">
          <Skeleton className="h-4 w-36 rounded-md bg-[#E4E4E7]" />
        </td>
        <td className="px-3 py-4">
          <Skeleton className="h-4 w-16 rounded-md bg-[#E4E4E7]" />
        </td>
        <td className="px-3 py-4">
          <Skeleton className="h-4 w-28 rounded-md bg-[#E4E4E7]" />
        </td>
        <td className="px-3 py-4">
          <Skeleton className="h-4 w-14 rounded-md bg-[#E4E4E7]" />
        </td>
        <td className="px-3 py-4">
          <Skeleton className="h-4 w-40 rounded-md bg-[#E4E4E7]" />
        </td>
        <td className="px-3 py-4">
          <Skeleton className="h-8 w-24 rounded-full bg-[#E4E4E7]" />
        </td>
      </tr>
    ))}
  </>
);

export const OrderHistorySkeleton = () => (
  <div className="flex flex-col gap-6">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36 rounded-md bg-[#E4E4E7]" />
          <Skeleton className="h-7 w-20 rounded-full bg-[#E4E4E7]" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full rounded-md bg-[#E4E4E7]" />
          <Skeleton className="h-4 w-4/5 rounded-md bg-[#E4E4E7]" />
        </div>
        <Skeleton className="h-4 w-32 rounded-md bg-[#E4E4E7]" />
        <Skeleton className="h-4 w-full rounded-md bg-[#E4E4E7]" />
        {index < 2 ? <div className="mt-2 h-px bg-[#E4E4E7]" /> : null}
      </div>
    ))}
  </div>
);

export const HeaderAuthSkeleton = () => (
  <div className="flex gap-3">
    <Skeleton className="h-9 w-63 rounded-full bg-white/15" />
    <Skeleton className="size-9 rounded-full bg-white/15" />
    <Skeleton className="size-9 rounded-full bg-white/15" />
  </div>
);

export const AdminLayoutSkeleton = () => (
  <div className="flex min-h-screen bg-[#F4F4F5]">
    <aside className="flex w-60 shrink-0 flex-col border-r border-[#E4E4E7] bg-white px-4 py-6">
      <div className="mb-10 flex items-center gap-3 px-2">
        <Skeleton className="size-10 rounded-full bg-[#E4E4E7]" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-24 rounded-md bg-[#E4E4E7]" />
          <Skeleton className="h-3 w-20 rounded-md bg-[#E4E4E7]" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full rounded-full bg-[#E4E4E7]" />
        <Skeleton className="h-10 w-full rounded-full bg-[#E4E4E7]" />
      </div>
    </aside>
    <main className="flex-1 p-8">
      <FoodMenuSkeleton />
    </main>
  </div>
);

export const SignInLayoutSkeleton = () => (
  <div className="flex w-full max-w-104 flex-col gap-6">
    <Skeleton className="size-9 rounded-md bg-[#E4E4E7]" />
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-48 rounded-md bg-[#E4E4E7]" />
      <Skeleton className="h-5 w-full rounded-md bg-[#E4E4E7]" />
    </div>
    <Skeleton className="h-9 w-full rounded-md bg-[#E4E4E7]" />
    <Skeleton className="h-9 w-full rounded-md bg-[#E4E4E7]" />
  </div>
);

export const FooterSkeleton = () => (
  <div className="flex w-full flex-col items-center gap-19 bg-[#18181B] pt-15 pb-28">
    <Skeleton className="h-20 w-full rounded-none bg-[#E4E4E7]/20" />
    <div className="flex w-7xl flex-col gap-26">
      <div className="flex w-full justify-between">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="size-10 rounded-full bg-white/10" />
          <Skeleton className="h-5 w-24 rounded-md bg-white/10" />
        </div>
        <div className="flex gap-28">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4">
              <Skeleton className="h-4 w-16 rounded-md bg-white/10" />
              {Array.from({ length: 4 }).map((__, itemIndex) => (
                <Skeleton
                  key={itemIndex}
                  className="h-4 w-24 rounded-md bg-white/10"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-px w-full bg-white/10" />
      <div className="flex gap-12">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-28 rounded-md bg-white/10" />
        ))}
      </div>
    </div>
  </div>
);
