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

const { validateAllSchemas } = require('./schemaValidation');
const { validateURLs } = require('./validateURLs');
const { validateAllWhitelistedFiles } = require('./validateWhitelistedFiles');
const { validateAllConfigFiles } = require('./validateConfigFiles');
const { getNetworkDirs, getNestedFilesByName } = require('./utils/fs');
const config = require('../config');

const validate = async () => {
	// Get all network dirs changed
	const filesChanged = process.argv.slice(2);
	const uniqueDirs = new Set();
	for (let i = 0; i < filesChanged.length; i++) {
		const firstDir = filesChanged[i].split('/')[0];
		uniqueDirs.add(firstDir);
	}
	const changedDirs = [...uniqueDirs];

	// Get all network dirs for schema validation
	const networkDirs = await getNetworkDirs(config.rootDir);

	// If no dirs are changed then check all files
	const filteredNetworks = changedDirs.length > 0 ? networkDirs.filter(network => changedDirs.some(dir => network.includes(dir))) : networkDirs;

	// Get all app.json and nativetokens.json files
	const files = [];
	for (let i = 0; i < filteredNetworks.length; i++) {
		/* eslint-disable no-await-in-loop */
		files.push(...await getNestedFilesByName(filteredNetworks[i], Object.values(config.filename)));
		/* eslint-enable no-await-in-loop */
	}

	// Validate schemas
	await validateAllSchemas(files);

	// Check whitelisted files in all network directories
	await validateAllWhitelistedFiles(filteredNetworks);

	// Check for config files in all network directories
	await validateAllConfigFiles(filteredNetworks);

	// Validate serviceURLs
	await validateURLs(files);

	process.exit(0);
};

validate();
