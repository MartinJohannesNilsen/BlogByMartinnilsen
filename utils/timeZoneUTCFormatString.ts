export const getTimeZoneUTCFormatString = (date, timeZone) => {
	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		// second: "2-digit",
		timeZone: timeZone, // Apply the timezone correction
		hour12: false, // Use 24-hour format
	});

	// Format the date
	const formattedDate = dateFormatter.format(date);

	// The formatted date is now in the format `MM/DD/YYYY, HH:MM:SS` with the time corrected to the specified timezone.
	// To convert this to an ISO-like string without 'Z', we can rearrange and replace parts of the string.

	// With seconds
	// const isoLikeString = formattedDate.replace(
	// 	/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/,
	// 	"$3-$1-$2T$4:$5:$6"
	// );
	const isoLikeString = formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/, "$3-$1-$2T$4:$5");

	return isoLikeString;
};
