import { AdminLoginClient } from "./login-client";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <AdminLoginClient
      defaultEmail={isDev ? process.env.ADMIN_EMAIL || "" : ""}
      defaultPassword={isDev ? process.env.ADMIN_PASSWORD || "" : ""}
      defaultSecurityKey={isDev ? process.env.ADMIN_SECURITY_KEY || "" : ""}
    />
  );
}
