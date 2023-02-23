import path from 'node:path';
import url from 'node:url';

import fse from 'fs-extra';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


const TEMPLATE_FILES = path.join(__dirname, 'files');

export const TEMPLATE_ADDON_FILES = path.join(TEMPLATE_FILES,'addon');


export async function writeTemplateFile(templateFile, destDir) {
    let templatePath = path.join(TEMPLATE_FILES, templateFile);
    let fileName = path.basename(templatePath);
    let fileData = await fse.readFile(templatePath);

    let destPath = path.join(destDir, fileName);

    await fse.writeFile(destPath, fileData);
}
