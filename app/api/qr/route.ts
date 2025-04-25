import { NextResponse } from "next/server"
import QRCode from "qrcode"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(url, {
      margin: 1,
      width: 300,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })

    // Convert data URL to buffer
    const data = qrDataUrl.split(",")[1]
    const buffer = Buffer.from(data, "base64")

    // Return QR code image
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
