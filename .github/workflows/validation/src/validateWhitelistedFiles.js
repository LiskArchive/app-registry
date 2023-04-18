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
const config = require('../config')
const { readFileLinesToArray } = require('./utils/fs')

const isPatternMatch = (str, pattern) => {
	if (pattern === '*') {
		return true;
	}
	if (pattern.startsWith('*')) {
		return str.endsWith(pattern.slice(1));
	}
	if (pattern.endsWith('*')) {
		return str.startsWith(pattern.slice(0, -1));
	}
	return str === pattern;
};

const isFileWhitelisted = (filename, patterns) => {
	for (const pattern of patterns) {
		if (isPatternMatch(filename, pattern)) {
			return true;
		}
	}
	return false;
};

const validateAllWhitelistedFilesForDir = async (directory, whitelistedFilePatterns) => {
	try {
		const files = await fs.readdir(directory);
		for (const file of files) {
			const fullPath = path.join(directory, file);
			const stat = await fs.stat(fullPath);

			if (stat.isDirectory()) {
				await validateAllWhitelistedFilesForDir(fullPath, whitelistedFilePatterns);
			} else if (!isFileWhitelisted(file, whitelistedFilePatterns)) {
				throw new Error(`File ${fullPath} is not whitelisted.`);
			}
		}
	} catch (err) {
		throw new Error(`Error reading directory: ${directory}.\n${err}`);
	}
}

const validateAllWhitelistedFiles = async (networkDirs) => {
	const whitelistedFilePatterns = await readFileLinesToArray(config.whitelistedFilesPath);

	for (const networkDir of networkDirs) {
		await validateAllWhitelistedFilesForDir(networkDir, whitelistedFilePatterns);
	}
}

module.exports = {
	validateAllWhitelistedFiles,

	// Testing
	isFileWhitelisted,
}
