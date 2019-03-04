import { sep } from 'path';
import { Stats } from "fs";
const fs = require("fs");
import { shell } from 'electron';

const loader = document.querySelector("tbody");
const rootPath = '/';


const loadFolder = (path: string) => {
	loader.innerHTML = "";

	if(path != rootPath) {
		let pt = path.split("/");
		pt.pop();
		console.log(rootPath);
		console.log(pt.join("/"));
		let pouet = "" == pt.join("/") ? sep : pt.join("/");
		addElement("..", pouet);
	}
	fs.readdir(path, (err, items) => {
		for (const item of items) {
			console.log(path);
			let it = path == "/" ? path + item : path + sep + item;
			fs.stat(it, (err, stat) => {
				// console.log(err);
				let pth = path == "/" ? path + item : path + sep + item;
				addElement(item, pth, stat);
			});
		}
	});

}

function addElement(filename: string, path: string, stat: Stats = null) {
	let mtime = stat != null ? stat.mtime : null;
	let classe = stat != null ? (stat.isDirectory() ? "folder" : "file") : "folder";
	if(stat != null) var month = (mtime.getUTCMonth() + 1) > 10 ? "0" + (mtime.getUTCMonth() + 1) : "" + (mtime.getUTCMonth() + 1);
	else var month = "0";
	let time = stat == null || stat.isDirectory() ? "--" : mtime.getUTCFullYear() + "/" + month + "/" + mtime.getUTCDate();
	let bytes = stat == null || stat.isDirectory() ? "--" : formatBytes(stat.size);
	let tr = document.createElement("tr");
	tr.classList.add(classe);
	tr.setAttribute("data-file", path);
	tr.addEventListener("click", function() {
		if(this.classList.contains("folder")) loadFolder(this.getAttribute("data-file"));
		else loadFile(this.getAttribute("data-file"));
	});
	for (const el of [filename, time, bytes]) {
		let td = document.createElement("td");
		td.innerText = el;
		tr.appendChild(td);
	}
	loader.appendChild(tr);
}

function formatBytes(integ: number): string {
	if(integ === 0) return "0 bytes";
	let sep = 1024, d = 2;
	let ent = ["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"];
	let f = Math.floor(Math.log(integ)/Math.log(sep));
	return parseFloat((integ / Math.pow(sep, f)).toFixed(d)) + " " + ent[f];
}

function loadFile(file: string) {
	shell.openItem(file);
}

loadFolder("/");
