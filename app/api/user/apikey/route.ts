import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth/auth";
import { kv } from "@vercel/kv";
import { encrypt } from "@/app/lib/encryption";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { apiKey } = await req.json();
    
    if (!apiKey) {
      return new NextResponse("API key is required", { status: 400 });
    }

    // Encrypt the API key before storing
    const encryptedKey = await encrypt(apiKey);
    
    // Store the encrypted API key with the user's email as the key
    await kv.set(`apikey:${session.user.email}`, encryptedKey);

    return new NextResponse("API key stored successfully", { status: 200 });
  } catch (error) {
    console.error("Error storing API key:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const hasKey = await kv.exists(`apikey:${session.user.email}`);
    return NextResponse.json({ hasKey: Boolean(hasKey) });
  } catch (error) {
    console.error("Error checking API key:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 