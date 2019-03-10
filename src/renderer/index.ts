// import { render as nunjuckRender} from 'nunjucks';
import fs from 'fs';
import { sep } from 'path';
import {
	shell
} from 'electron';
import DeltaFile from '../common/DeltaFile';
import './style.scss';
import { Template } from 'nunjucks';

const tpl: Template = require("./fileRenderers/blocks.njk");

const rootPath = "/";

const loadFolder = (path: string) => {
	let results = [];
	if(path != rootPath) {
		let pt = path.split("/");
		pt.pop();
		let pouet = "" == pt.join("/") ? sep : pt.join("/");
		results.push(DeltaFile.loadFileFromElements("..", pouet, false));
	}
	let items = fs.readdirSync(path);

	for (const item of items) {
		let pth = path == "/" ? path + item : path + sep + item;
		let file = DeltaFile.loadFileFromPath(pth);
		if(file != undefined)results.push(file);
	}

	return results;

}

const showFolder = (folder: string) => {
	let app = document.getElementById("app");
	if(app == undefined) app = document.body;
	var els = loadFolder(folder);
	app.innerHTML = tpl.render({files: els});
	app.querySelectorAll("[data-file]").forEach((el) => {
		el.addEventListener("click", function(this: HTMLElement) {
			let folder = this.getAttribute("data-file");
			if(folder != null) {
				let file = DeltaFile.loadFileFromPath(folder);
				if(file != undefined) {
					if(file.type == 0) showFolder(folder);
					else shell.openItem(file.path);
				}

			}
		});
	});
}

showFolder("/");
