function csvEnv(key: string): string[] {
  return (process.env[key] ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isPlatformAdminConfigured(userId: string, email: string | null | undefined): boolean {
  const normalizedUserId = userId.trim().toLowerCase();
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  return (
    csvEnv("PLATFORM_ADMIN_USER_IDS").includes(normalizedUserId) ||
    (!!normalizedEmail && csvEnv("PLATFORM_ADMIN_EMAILS").includes(normalizedEmail))
  );
}
