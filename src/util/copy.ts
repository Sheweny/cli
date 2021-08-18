/**
 * Copy the template into target dirrectory with options
 */
import { readdir, stat, mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

import * as ejs from 'ejs';

export class TemplateCopy {
	target: string;
	template: string;
	options: any;
	name: string;
	constructor(target: string, template: string, options: any) {
		this.target = target;
		this.template = template;
		this.options = options;
		this.name = options.name;
		this.init()
	}
	async init() {
		try {
			const info = await stat(join(this.target, this.name))
			if (info) console.error('A directry with name ' + this.name + ' already exists.');
		} catch {
			await mkdir(join(this.target, this.name));
			this.target = join(this.target, this.name);
			this.copyFiles(this.template, this.target)
		}

	}
	async copyFiles(template: string, target: string) {
		const data = await readdir(template)
		for (const d of data) {
			const info = await stat(join(template, d));
			if (info.isDirectory()) {
				await mkdir(join(target, d))
				await this.copyFiles(join(template, d), join(target, d))
			} else {
				const str: string = await ejs.renderFile(join(template, d), this.options)
				await writeFile(join(target, d), str)
			}
		}
	}
}