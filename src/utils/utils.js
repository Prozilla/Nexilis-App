export function encodeBase64(data) {
    return Buffer.from(data).toString("base64");
}

export function decodeString(string) {
	return string.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

export function removeUrlQueries(url) {
	return url.split("?")[0];
}

export function formatNumber(value) {
	if (value > 999999) {
		return Math.sign(value) * ((Math.abs(value) / 1000000).toFixed(1)) + "m";
	} else if (value > 999) {
		return Math.sign(value) * ((Math.abs(value) / 1000).toFixed(1)) + "k";
	} else {
		return value;
	}
}