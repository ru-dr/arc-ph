import { NextResponse } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "./app/lib/session";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const PUBLIC_PATHS = ["/api/auth", "/api/check-auth", "/api/submit-form"];

const withCors = (response) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
};

export async function proxy(request) {
  if (request.method === "OPTIONS") {
    return withCors(new NextResponse(null, { status: 200 }));
  }

  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (!SAFE_METHODS.has(request.method) && !isPublicPath) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!(await isValidSessionToken(token))) {
      return withCors(
        NextResponse.json({ error: "Not authenticated" }, { status: 401 })
      );
    }
  }

  return withCors(NextResponse.next());
}

export const config = {
  matcher: "/api/:path*",
};
