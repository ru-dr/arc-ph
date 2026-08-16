import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidSessionToken } from "../../lib/session";

export async function GET() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (await isValidSessionToken(token)) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const validUsername = process.env.DASHBOARD_USERNAME;
    const validPassword = process.env.DASHBOARD_PASSWORD;

    if (username === validUsername && password === validPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
