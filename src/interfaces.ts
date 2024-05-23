import express from 'express';

export interface langsFilesPath {
	[key: string]: string[];
}

export interface InitOptions {
	options?: options;
	serverSideTranslation?: boolean;
}

export interface options {
	defaultLang?: string;
	langsFolder?: string;
	mainFile?: string;
	extraFiles?: string[];
	path?: string;
	renderWithDocument?: boolean;
}

export interface ExtraFile {
	name: string;
	files: string[];
}

export interface optionsServerSide {
	optionsServerSide?: boolean;
	useAllExtraFiles?: boolean;
	removeTagAfterTranslation?: boolean;
	extraFiles?: ExtraFile[];
}

export interface I18n4e {
	langsFilesPath: langsFilesPath;
	defaultLang: string;
	locatesFolder: string;
	path: string;
	init: (
		app: express.Application,
		{ options, serverSideTranslation }?: InitOptions
	) => Promise<any>;
}

export interface minFilesOptions {
	langsFolder?: string;
	mainFile?: string;
	extraFiles?: string[];
}