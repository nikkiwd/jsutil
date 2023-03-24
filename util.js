import fs from "fs";

export function config() {
	return JSON.parse(fs.readFileSync("config.json", "utf8"));
}

// see https://flaviocopes.com/javascript-sleep/
export async function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// see https://javascript.info/task/ucfirst
export function ucfirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function lcfirst(str) {
	return str.charAt(0).toLowerCase() + str.slice(1);
}
