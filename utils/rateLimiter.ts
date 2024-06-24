import { supabaseAdmin } from "@/utils";

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

type RateLimitConfig = {
  limit: number;
  window: number;
};

const defaultConfig: RateLimitConfig = {
  limit: 600,  // Increased from 10 to 600
  window: 60 * 60  // Kept as 1 hour
};

const endpointConfigs: { [key: string]: RateLimitConfig } = {
  // Example configurations for different endpoints
  '/api/high-frequency': { limit: 120, window: 60 * 60 },
  '/api/low-frequency': { limit: 30, window: 60 * 60 },
};

export async function rateLimiter(
  ip: string,
  endpoint: string = 'default'
): Promise<RateLimitResult> {
  const config = endpointConfigs[endpoint] || defaultConfig;
  const { limit, window } = config;

  const now = new Date();
  const windowStart = new Date(now.getTime() - window * 1000);

  // Remove old entries
  await supabaseAdmin
    .from('rate_limits')
    .delete()
    .lt('created_at', windowStart.toISOString())
    .eq('ip', ip)
    .eq('endpoint', endpoint);

  // Count recent requests
  const { count } = await supabaseAdmin
    .from('rate_limits')
    .select('id', { count: 'exact' })
    .eq('ip', ip)
    .eq('endpoint', endpoint)
    .gte('created_at', windowStart.toISOString());

  const totalRequests = count || 0;

  if (totalRequests < limit) {
    // Add new request entry
    await supabaseAdmin
      .from('rate_limits')
      .insert({ ip, endpoint, created_at: now.toISOString() });
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