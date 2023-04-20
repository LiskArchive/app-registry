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

const path = require('path');
const { validateAllSchemas } = require('./schemaValidation');
const { validateURLs } = require('./validateURLs');
const { validateAllWhitelistedFiles } = require('./validateWhitelistedFiles');
const { validateAllConfigFiles } = require('./validateConfigFiles');
const { getNetworkDirs, getNestedFilesByName } = require('./utils/fs');
const config = require('../config');

const validate = async () => {
	// Get all network dirs for schema validation
	let allNetworkDirs = await getNetworkDirs(config.rootDir);

	// Get all app.json and nativetokens.json files
	let files = [];

	// Check if user spcified all files changed to validate
	const filesChanged = process.argv.slice(2);
	if (filesChanged.length > 0) {
		// Get all network dirs changed
		const uniqueDirs = new Set();
		for (let i = 0; i < filesChanged.length; i++) {
			const firstDir = filesChanged[i].split('/')[0];
			uniqueDirs.add(firstDir);
		}
		const changedDirs = [...uniqueDirs];

		// Include only network dirs changed
		allNetworkDirs = allNetworkDirs.filter(network => changedDirs.some(dir => network.includes(dir)));

		// Filter all changed app.json and nativetokens.json files
		files = filesChanged.filter(
			(fileName) => (path.basename(fileName) === config.filename.APP_JSON || path.basename(fileName) === config.filename.NATIVE_TOKENS))
			.map((fileName) => path.join(config.rootDir, fileName));
	} else {
		for (let i = 0; i < allNetworkDirs.length; i++) {
			/* eslint-disable no-await-in-loop */
			files.push(...await getNestedFilesByName(allNetworkDirs[i], Object.values(config.filename)));
			/* eslint-enable no-await-in-loop */
		}
	}

	// Validate schemas
	await validateAllSchemas(files);

	// Check whitelisted files in all network directories
	await validateAllWhitelistedFiles(allNetworkDirs);

	// Check for config files in all network directories
	await validateAllConfigFiles(allNetworkDirs);

	// Validate serviceURLs
	await validateURLs(files);

	process.exit(0);
};

validate();
