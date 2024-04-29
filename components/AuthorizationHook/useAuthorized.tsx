import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useAuthorized(required?: boolean) {
	const [isAuthorized, setIsAuthorized] = useState(false);
	const { data: session, status } = required ? useSession({ required: required }) : useSession();

	useEffect(() => {
		if (session) {
			if (session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
				setIsAuthorized(true);
			}
			setIsAuthorized(false);
		}
		return () => {
			setIsAuthorized(false);
		};
	});

	return { isAuthorized, session, status };
}
export default useAuthorized;
