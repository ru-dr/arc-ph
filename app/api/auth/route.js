import { NextResponse } from "next/server";

export async function POST(request) {
  const { username, password } = await request.json();

  const validUsername = process.env.DASHBOARD_USERNAME;
  const validPassword = process.env.DASHBOARD_PASSWORD;

  if (username === validUsername && password === validPassword) {
    const response = NextResponse.json(
      { message: "Authentication successful" },
      { status: 200 }
    );

    response.cookies.set("isLoggedIn", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/dashboard",
    });

    return response;
  } else {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
