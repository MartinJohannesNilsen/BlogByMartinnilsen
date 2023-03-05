import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useAuthorized(required?: boolean) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { data: session, status } = useSession(
    required && { required: required }
  );

  useEffect(() => {
    if (session && session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
    return () => {
      setIsAuthorized(false);
    };
  });

  return { isAuthorized, session, status };
}
export default useAuthorized;
