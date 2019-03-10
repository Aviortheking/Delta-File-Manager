import {
	sep
} from 'path';

const folderName = "delta-file-manager";

export function getDataFolder() {
	let platform = process.platform;
	if(platform == "win32") {
		return process.env.APP_DATA + sep + folderName;
	} else if(platform == "darwin") {
		return process.env.HOME + sep + "Library/Preferences" + sep + folderName;
	} else if(platform == "linux") {
		return process.env.HOME + sep + ".config" + sep + folderName;
	} else return undefined;
}
