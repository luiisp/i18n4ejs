import { Request, Response } from 'express';
import { suportedLanguages } from '../../config/supportedLanguages.json';
import fs from 'fs';
import * as pathFiles from 'path';
import { routesNames } from '../configs';
import { Route } from '../types';
import { i18n4e } from '../index';
import { throwError } from '../errors.handler';

export const folderNameIsALanguage = (folderName: string): boolean => {
	const isValid = suportedLanguages.find(
		(lang) => lang.code === folderName || lang.name === folderName
	);
	return isValid ? true : false;
};

export const scourFolder = (nameFolder: string): string | undefined => {
	let foundedI18n4e = false;
	let actualDir = pathFiles.dirname(__filename);

	while (!foundedI18n4e) {
		const files = fs.readdirSync(actualDir);
		if (!files || files.length === 0 || nameFolder === undefined) {
			return undefined;
		}

		if (files.includes('node_modules') || files.includes('package.json')) {
			const result = findFolderRecursive(actualDir, nameFolder);
			return result;
		} else {
			actualDir = pathFiles.join(actualDir, '..');
		}
	}

	return undefined;
};

const findFolderRecursive = (dir: string, folderName: string): string | undefined => {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const fullPath = pathFiles.join(dir, file);
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			if (file === folderName) {
				return fullPath;
			}

			const result = findFolderRecursive(fullPath, folderName);
			if (result) {
				return result;
			}
		}
	}

	return undefined;
};

export const isRouteBlacklisted = (req: Request): boolean => {
	const route = Object.values(routesNames).find( 
		(r: Route) => req.path.includes(r.path) && r.method === req.method
	);
	return !!route;
};

export const getDefaultLangArray = (): string[] => {
	const defaultLangArray = i18n4e.langsFilesPath[i18n4e.defaultLang];

	if (!defaultLangArray) {
		throwError('Default language not found', 'Default language not found');
	}

	return defaultLangArray;
}

export const getRequestedLangArray = (userLang: string): string[] => {
	let langArray = i18n4e.langsFilesPath[userLang];

	if (langArray && langArray.length > 0) {
		return langArray;
	}

	return getDefaultLangArray();
}