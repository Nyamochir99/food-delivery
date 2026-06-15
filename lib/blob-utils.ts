export const isVercelBlobUrl = (url: string) => {
  if (!url) return false;

  try {
    const hostname = new URL(url).hostname;
    return (
      hostname.endsWith(".public.blob.vercel-storage.com") ||
      hostname.includes("blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
};
