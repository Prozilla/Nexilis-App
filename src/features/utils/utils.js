import base64 from "react-native-base64";

export function encodeBase64(string) {
    return base64.encode(string);
}

export function decodeString(string) {
	return string.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

export function removeUrlQueries(url) {
	return url.split("?")[0];
}

export function formatNumber(value) {
	if (value > 999_999) {
		return Math.sign(value) * ((Math.abs(value) / 1_000_000).toFixed(1)) + "m";
	} else if (value > 999) {
		return Math.sign(value) * ((Math.abs(value) / 1000).toFixed(1)) + "k";
	} else {
		return value;
	}
}

export function formatRelativeTime(unixDate, options = { suffix: true }) {
	const date = Math.abs((new Date(unixDate * 1000).getTime() / 1000).toFixed(0));
	const currentDate = Math.abs((new Date().getTime() / 1000).toFixed(0));

	const timePassed = currentDate - date;

	const years = Math.floor(timePassed / 30758400);
	const days = Math.floor(timePassed / 86400);
	const hours = Math.floor(timePassed / 3600) % 24;
	const minutes = Math.floor(timePassed / 60) % 60;
	const seconds = timePassed % 60;

	let time;
	if (years > 0) {
		time = years > 1 ? years + " years" : years + " year";
	} else if (days > 0) {
		time = days > 1 ? days + " days" : days + " day";
	} else if (hours > 0) {
		time = hours > 1 ? hours + " hours" : hours + " hour";
	} else if (minutes > 0) {
		time = minutes > 1 ? minutes + " minutes" : minutes + " minute";
	} else {
		time = seconds > 1 ? seconds + " seconds" : seconds + " second";
	}

	let result = time;

	if (options.suffix)
		result += " ago";

	return result;
}