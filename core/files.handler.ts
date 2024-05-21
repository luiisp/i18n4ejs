import * as fs from 'fs';
import * as path from 'path';
import {suportedLanguages} from '../config/supportedLanguages.json';

interface options {
  langsFolder?: string;
  mainFile?: string;
  extraFiles?: string[];
}

const folderNameIsALanguage = (folderName: string): boolean => {
const isValid = suportedLanguages.find((lang) => lang.code === folderName || lang.name === folderName);
return isValid ? true : false;
};


export const getLanguagesFilesPaths = (
  options: options = {}
): Promise<{ [key: string]: string[] }> => {
  const regex = /\/|\\/g;
  const definitions = {
    path: options.langsFolder || '',
    mainFile: options.mainFile || 'translation.json',
    extraFiles: options.extraFiles || [],
  };

  definitions.path = definitions.path.replace(regex, path.sep);

  const langsFolder = path.join(definitions.path);
  return new Promise((resolve, reject) => {
    fs.readdir(langsFolder, (err, files) => {
      if (err) {
        return reject(
          new Error(
            `i18n4e languages folder defined as (${definitions.path}) was not found.`
          )
        );
      }

      const returnFilesPathValues: { [key: string]: string[] } = {};
      const promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          if (!folderNameIsALanguage(file)) {
            return reject(
              new Error(`The folder (${file}) is not a valid language folder. Consult the i18n4e supported languages list.`)
            );
          }
          const filePath = path.join(langsFolder, file);

          fs.stat(filePath, (err, stats) => {
            if (err) {
              return reject(
                new Error(`Unable to read i18n4e folder in ${filePath}`)
              );
            }

            if (stats.isDirectory()) {
              const mainTranslationFilePath = path.join(
                filePath,
                definitions.mainFile
              );

              
              fs.access(mainTranslationFilePath, fs.constants.F_OK, (err) => {
                if (err) {
                  return reject(
                    new Error(
                      `The main json file defined as (${definitions.mainFile}) was not found. Expected Path: ${mainTranslationFilePath}`
                    )
                  );
                } else {
                  returnFilesPathValues[file] = [mainTranslationFilePath];

                  if (definitions.extraFiles.length) {

                    const extraPromises = definitions.extraFiles.map(
                      (extraFile) => {
                        return new Promise((resolve, reject) => {
                          const extraFilePath = path.join(filePath, extraFile);
                          console.log('extraFilePath', extraFilePath);

                          fs.access(extraFilePath, fs.constants.F_OK, (err) => {
                            if (err) {
                              return reject(
                                new Error(
                                  `The file (${extraFile}) was defined as extra but was not found. Expected Path: ${extraFilePath}`
                                )
                              );
                            } else {
                              returnFilesPathValues[file].push(extraFilePath);
                              resolve(returnFilesPathValues);
                            }
                          });
                        });
                      }
                    );

                    Promise.all(extraPromises)
                      .then(() => resolve(returnFilesPathValues))
                      .catch(reject);
                  } else {
                    resolve(returnFilesPathValues);
                  }
                }
              });
            } else {
              resolve(returnFilesPathValues);
            }
          });
        });
      });

      Promise.all(promises)
        .then(() => resolve(returnFilesPathValues))
        .catch((err) => reject(err));
    });
  });
};
