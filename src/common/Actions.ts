import DeltaFile from "./DeltaFile";
import {
	sep
} from 'path';
import {
	getDataFolder
} from "./Functions";
import fs from "fs";

class Actions { //WIP

	public deleteFile(file: DeltaFile) {
		let res = getDataFolder() + sep + "trash" + sep + "files" + sep + file.name;
		if(fs.existsSync(res)) {
			//rename and add it
		} else {
			//move the folder/file in the trash
			//write to infos.json about the deleted file
		}
	}

	public emptyBin() {
		//delete all files in the trash
	}

	//file is the file name in the trash
	public restoreDeletedFile(file: string) {

	}
}
