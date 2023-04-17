/*
 * Copyright © 2023 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

async function getNestedFilesByName(directory, filenames) {
	const entries = await fs.readdir(directory);
	const appJsonPaths = [];
	for (const entry of entries) {
		const entryPath = path.join(directory, entry);
		const entryStat = await fs.stat(entryPath);
		if (entryStat.isDirectory()) {
			const nestedFilePaths = await getNestedFilesByName(entryPath, filenames);
		        appJsonPaths.push(...nestedFilePaths);
		} else if (filenames.includes(entry)) {
			appJsonPaths.push(entryPath);
		}
	}

	return appJsonPaths;
}

async function getDirectories(directory) {
	try {
		const files = await fs.readdir(directory);
		const subdirectories = [];

		for (const file of files) {
			const filePath = path.join(directory, file);
			const stat = await fs.stat(filePath);

			if (stat.isDirectory()) {
				subdirectories.push(filePath);
			}
		}

		return subdirectories.filter((subdirectory) => subdirectory !== null);
	} catch (err) {
		throw new Error(`Error getting subdirectories in ${directory}: ${err}`);
	}
}

async function getNetworkDirs(rootDir) {
	const subDirs = await getDirectories(rootDir);
	const networkDirs = subDirs.filter((dirPath) => !config.nonNetworkDirs.some((entry) => dirPath.endsWith(entry)));

	return networkDirs;
}

async function readJsonFile(filePath) {
	const fileContent = await fs.readFile(filePath, 'utf-8');
	const data = JSON.parse(fileContent);
	return data;
}


module.exports = {
	getNestedFilesByName,
	getDirectories,
	getNetworkDirs,
	readJsonFile,
}
