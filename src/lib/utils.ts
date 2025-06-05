import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

function bytesToSize(bytes: number) {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return 'n/a';
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	if (i === 0) return `${bytes} ${sizes[i]}`;
	return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

function relativeTime(timeString: string) {
	TimeAgo.addLocale(en);
	const timeAgo = new TimeAgo('en-US');

	try {
		return timeAgo.format(Date.parse(timeString), 'round');
	} catch (e) { }
}

export { bytesToSize, relativeTime }
