import { useQuery } from "@tanstack/react-query";
import { getMySubscription } from "@/lib/api/subscriptions";
import { useAuth } from "@/lib/hooks/use-auth";

export function useSubscriptionStatus() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  return useQuery({
    queryKey: ["my-subscription"],
    queryFn: getMySubscription,
    enabled: isAuthenticated && !isAuthLoading,
    staleTime: 15_000,
  });
}
