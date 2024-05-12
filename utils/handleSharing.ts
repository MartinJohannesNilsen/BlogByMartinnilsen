import { NavigatorShareProps } from "@/types";

export const handleSharing = async (shareDetails: NavigatorShareProps) => {
	if (navigator.share) {
		try {
			await navigator.share(shareDetails);
		} catch (error) {}
	} else {
		// fallback code
		shareDetails.fallback && shareDetails.fallback();
	}
};
