import express from 'express';

export interface langsFilesPath {
	[key: string]: string[];
}



export interface ExtraFile {
	view: string;
	files: string[];
}

export interface optionsServerSide {
	optionsServerSide?: boolean;
	useAllExtraFiles?: boolean;
	AllExtraFiles?: string[];
	removeTagAfterTranslation?: boolean;
	extraFiles?: ExtraFile[];
}

export interface I18n4e {
	langsFilesPath: langsFilesPath;
	defaultLang: string;
	localesFolder: string;
	init: (
		app: express.Application,
		{}?: InitOptions
	) => Promise<any>;
}

export interface InitOptions {
	defaultLang?: string;
	langsFolder?: string;
	mainFile?: string;
	langNameInPath?: boolean;	
	extraFiles?: string[];
	path?: string;
	dev?: boolean;
}

export interface minFilesOptions {
	langsFolder?: string;
	mainFile?: string;
	extraFiles?: string[];
}
