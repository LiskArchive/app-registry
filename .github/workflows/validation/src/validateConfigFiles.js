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
const { getDirectories } = require('./utils/fs')

const validateConfigInDir = async (directory) => {
	try {
		const files = await fs.readdir(directory);

		if (!files.includes(config.filename.APP_JSON) || !files.includes(config.filename.NATIVE_TOKENS)) {
			throw new Error(`Files '${config.filename.APP_JSON}' and '${config.filename.NATIVE_TOKENS}' are not present in directory ${directory}.`);
		}
	} catch (err) {
		throw new Error(`Error reading directory: ${directory}.\n${err}`);
	}
}

const validateAllConfigFilesForDir = async (rootDir) => {
	try {
		const appDirs = await getDirectories(rootDir);
		for (const appDir of appDirs) {
			await validateConfigInDir(appDir);
		}
	} catch (err) {
		throw new Error(`Error: ${err}`);
	}
}

const validateAllConfigFiles = async (networkDirs) => {
	for (const networkDir of networkDirs) {
		await validateAllConfigFilesForDir(networkDir);
	}
}

module.exports = {
	validateAllConfigFiles,
}
