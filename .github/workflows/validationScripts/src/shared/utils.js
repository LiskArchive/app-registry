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
const config = require('../config');

async function getNestedFilesByName(directory, filename) {
	const entries = await fs.readdir(directory);
	const subDirs = [];
	const appJsonPaths = [];

	for (const entry of entries) {
		const entryPath = path.join(directory, entry);
		const entryStat = await fs.stat(entryPath);

		if (entryStat.isDirectory()) {
			subDirs.push(entryPath);
		} else if (entry === filename) {
			appJsonPaths.push(entryPath);
		}
	}

	for (const subDir of subDirs) {
		const nestedPaths = await getNestedFilesByName(subDir, filename);
		appJsonPaths.push(...nestedPaths);
	}

	return appJsonPaths;
}

async function getDirectories(directory) {
	try {
		const files = await fs.readdir(directory);
		const subdirectories = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(directory, file);
				const stat = await fs.stat(filePath);
				if (stat.isDirectory()) {
					return filePath;
				} else {
					return null;
				}
			})
		);
		return subdirectories.filter((subdirectory) => subdirectory !== null);
	} catch (err) {
		throw new Error(`Error getting subdirectories in ${directory}: ${err}`);
	}
}

async function getNetworkDirs(rootDir) {
	const subDirs = await getDirectories(rootDir);
	const networkDirs = subDirs.filter((filePath) => !config.nonNetworkDirs.some((ending) => filePath.endsWith(ending)))

	return networkDirs;
}



module.exports = {
	getNestedFilesByName: getNestedFilesByName,
	getDirectories: getDirectories,
	getNetworkDirs: getNetworkDirs
}