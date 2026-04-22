import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "dark luxury car";

  const res = await fetch(
    `https://api.unsplash.com/photos/random?query=${query}&orientation=portrait&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
  );
  const data = await res.json();

  // Search Log for debugging
  console.log("Unsplash Data:", data.urls ? "Success" : "FAILED", data.errors || "");

  if (!data.urls) {
    return NextResponse.json({ url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e" }); // Fallback image
  }
  // Return the high-res regular URL
  return NextResponse.json({ url: data.urls.regular });
}
