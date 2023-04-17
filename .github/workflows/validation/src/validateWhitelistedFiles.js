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

const isFileOnWhitelist = (file) => {
	return config.whitelistedFiles.includes(file);
}

const isExtensionOnWhitelist = (file) => {
	const ext = path.extname(file);
	return config.whitelistedExtentionsToValidate.includes(ext);
}

const validateAllWhitelistedFilesForDir = async (directory) => {
	try {
		const files = await fs.readdir(directory);
		for (const file of files) {
			const fullPath = path.join(directory, file);
			const stat = await fs.stat(fullPath);

			if (stat.isDirectory()) {
				await validateAllWhitelistedFilesForDir(fullPath);
			} else if (isExtensionOnWhitelist(file) && !isFileOnWhitelist(file)) {
				throw new Error(`File ${fullPath} is not whitelisted.`);
			}
		}
	} catch (err) {
		throw new Error(`Error reading directory: ${directory}.\n${err}`);
	}
}

const validateAllWhitelistedFiles = async (networkDirs) => {
	for (const networkDir of networkDirs) {
		await validateAllWhitelistedFilesForDir(networkDir);
	}
}

module.exports = {
	validateAllWhitelistedFiles,
}
