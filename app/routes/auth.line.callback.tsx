import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { createClerkClient } from "@clerk/remix/api.server";
import { getClientEnv } from "~/lib/env.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  // Handle LINE OAuth errors
  if (error) {
    const errorDescription = url.searchParams.get("error_description");
    console.error("LINE OAuth error:", { error, errorDescription });

    const errorMessages = {
      'access_denied': '使用者取消了 LINE 登入',
      'invalid_request': 'LINE 登入請求無效',
      'unauthorized_client': 'LINE 應用程式未授權',
      'server_error': 'LINE 伺服器發生錯誤'
    };

    const message = errorMessages[error as keyof typeof errorMessages] || 'LINE 登入失敗';
    return redirect(`/?error=${encodeURIComponent(message)}`);
  }

  // Validate required parameters
  if (!code || !state) {
    return redirect("/?error=" + encodeURIComponent("LINE 登入參數缺失"));
  }

  try {
    const env = getClientEnv();
    const baseUrl = request.headers.get("host")?.includes("localhost")
      ? "http://localhost:5173"
      : `https://${request.headers.get("host")}`;

    console.log("Redirect URI being sent:", `${baseUrl}/auth/line/callback`);

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${baseUrl}/auth/line/callback`,
        client_id: env.LINE_ID!,
        client_secret: env.LINE_CHANNEL_SECRET!,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("LINE token exchange failed:", errorData);
      return redirect("/?error=" + encodeURIComponent("LINE 登入驗證失敗"));
    }

    const tokens = await tokenResponse.json();

    // Get user profile from LINE
    const profileResponse = await fetch("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      console.error("LINE profile fetch failed");
      return redirect("/?error=" + encodeURIComponent("無法取得 LINE 使用者資料"));
    }

    const lineProfile = await profileResponse.json();

    // Handle user creation/update in Clerk
    const clerkClient = createClerkClient({
      secretKey: env.CLERK_SECRET_KEY!,
    });

    // Look for existing user by LINE user ID
    const existingUsers = await clerkClient.users.getUserList({
      externalId: [`line:${lineProfile.userId}`], // Prefix with provider
    });

    let user;
    if (existingUsers.data.length > 0) {
      // Update existing user
      user = existingUsers.data[0];
      user = await clerkClient.users.updateUser(user.id, {
        firstName: lineProfile.displayName,
      });
    } else {
      // Create new user
      user = await clerkClient.users.createUser({
        externalId: `line:${lineProfile.userId}`, // Prefix with provider
        firstName: lineProfile.displayName,
        // Note: LINE may not provide email
      });
    }

    // Create Clerk session
    const session = await clerkClient.sessions.createSession({
      userId: user.id,
    });

    // Redirect to success page with session
    const redirectUrl = new URL("/", baseUrl);
    redirectUrl.searchParams.set("__clerk_session_token", session.id);

    return redirect(redirectUrl.toString());

  } catch (error) {
    console.error("LINE auth callback error:", error);
    return redirect("/?error=" + encodeURIComponent("LINE 登入處理失敗"));
  }
}