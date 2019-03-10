import fs from 'fs';
import {
	sep
} from 'path';
const icons = require("./icons.json");
//TODO handle file redirection when no link is given


export default class DeltaFile {

	_name: string = "";
	_modetime: Date | string = "--";
	_size: number | string = "--";
	_path: string = "";
	_type: number = 0; // 0 = directory, 1 = file;

	constructor() {}

	public static loadFileFromElements(name: string, path: string, type: boolean = false, modetime?: Date, size?: number): DeltaFile {
		let file = new DeltaFile();
		if(type) file.modetime = (modetime != undefined) ? modetime : "--";
		file.name = name;
		file.path = path;
		if(type) file.type = type ? 1 : 0;
		if(type) file.size = (size != undefined) ? size : "--";
		return file;
	}

	public static loadFileFromPath(path: string): DeltaFile | undefined {
		let file = new DeltaFile();
		try {
			var stat = fs.statSync(path);
		} catch (error) {
			return undefined;
		}
		let name = path.split(sep).pop();

		if(name == undefined) return undefined;

		file.type = stat.isDirectory() ? 0 : 1;
		if(file.type != 0) {
			file.modetime = stat.mtime;
			file.size = stat.size;
		}
		file.path = path;
		file.name = name;

		return file;
	}


	public get name() : string {return this._name}
	public set name(v : string) {this._name = v}

	public get modetime(): Date | string {return this._modetime}
	public set modetime(v: Date | string) {this._modetime = v}
	public formatTime(): string {
		if(typeof this.modetime === "string") return this.modetime;
		return this.modetime.toISOString()
		.replace(/T/, ' ')
		.replace(/\..+/, '')
		.replace(":", "/");
	}
	// 2019/03/09 04:14:01

	public get size(): number | string {return this._size}
	public set size(v: number | string) {this._size = v}
	public formatSize(): string {
		if(typeof this.size === "string") return this.size;
		if(this.size === 0) return "0 bytes";
		let sep = 1024, d = 2;
		let ent = ["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"];
		let f = Math.floor(Math.log(this.size)/Math.log(sep));
		return parseFloat((this.size / Math.pow(sep, f)).toFixed(d)) + " " + ent[f];
	}

	public get path(): string {return this._path}
	public set path(v: string) {this._path = v}

	public get type(): number {return this._type}
	public set type(v: number) {this._type = v}


	/**
	 * getThumbnail
	 */
	public getThumbnail(): string | undefined {
		//if file load picture
		//if folder see location(/home/___/pictures, /home) or name (like git, node_modules)
		if(this.type == 0) {
			for (const el in icons.folder.name) {
				if (icons.folder.name.hasOwnProperty(el)) {
					const element = icons.folder.name[el];
					if(el == this.name.toLowerCase()) return element;
				}
			}
			if(icons.folder.path[this.path] != undefined) return icons.folder.path[this.path];
			return undefined;
		} else {
			let ext = this.path.split("/").pop();
			if(ext == undefined) return undefined;
			ext = ext.split(".").pop();
			console.log(ext);
			if(ext == undefined) return undefined;
			let imgExt = ["jpg", "jpeg", "png"];
			if(imgExt.includes(ext) ) return "file://" + this.path;
			if(icons.file.extension[ext] != undefined) return icons.file.extension[ext];

			return undefined;
		}
	}
}
