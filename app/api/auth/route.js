import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
} from "../../lib/session";

export async function POST(request) {
  const { username, password } = await request.json();

  const validUsername = process.env.DASHBOARD_USERNAME;
  const validPassword = process.env.DASHBOARD_PASSWORD;

  if (!validUsername || !validPassword) {
    return NextResponse.json(
      { error: "Authentication is not configured" },
      { status: 500 }
    );
  }

  if (username !== validUsername || password !== validPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
