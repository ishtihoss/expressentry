import { supabaseAdmin } from "@/utils";

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

export async function rateLimiter(
  ip: string,
  limit: number = 10,
  window: number = 60 * 60
): Promise<RateLimitResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - window * 1000);

  // Remove old entries
  await supabaseAdmin
    .from('rate_limits')
    .delete()
    .lt('created_at', windowStart.toISOString())
    .eq('ip', ip);

  // Count recent requests
  const { count } = await supabaseAdmin
    .from('rate_limits')
    .select('id', { count: 'exact' })
    .eq('ip', ip)
    .gte('created_at', windowStart.toISOString());

  const totalRequests = count || 0;

  if (totalRequests < limit) {
    // Add new request entry
    await supabaseAdmin
      .from('rate_limits')
      .insert({ ip, created_at: now.toISOString() });
  }

  const remaining = Math.max(0, limit - totalRequests - 1);
  const reset = Math.ceil(windowStart.getTime() / 1000) + window;

  return {
    success: totalRequests < limit,
    limit,
    remaining,
    reset,
  };
}