"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const protectLoginRegister = <P extends object>(
  WrapperComponent: React.ComponentType<P>
) => {
  const ComponentWithAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const { data: userData, status } = useSession();
    const loading = status === "loading";
    useEffect(() => {
      if (!loading && userData) {
        router.replace("/");
      }
    }, [userData, loading, router]);

    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      );
    }

    return <WrapperComponent {...props} />;
  };

  return ComponentWithAuth;
};
