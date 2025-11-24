import { useAuth } from "@/hooks/use-auth";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => {
    return <RootRouteComponent />;
  },
});

function RootRouteComponent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <div>正在检查系统状态...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col">
      <Outlet />
    </div>
  );
}
