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
	// Get all network dirs for schema validation
	const networkDirs = await getNetworkDirs(config.rootDir);

	// Get all app.json and nativetokens.json files
	const files = [];
	for (let i = 0; i < networkDirs.length; i++) {
		/* eslint-disable no-await-in-loop */
		files.push(...await getNestedFilesByName(networkDirs[i], Object.values(config.filename)));
		/* eslint-enable no-await-in-loop */
	}

	// Validate schemas
	await validateAllSchemas(files);

	// Check whitelisted files in all network directories
	await validateAllWhitelistedFiles(networkDirs);

	// Check for config files in all network directories
	await validateAllConfigFiles(networkDirs);

	// Validate serviceURLs
	await validateURLs(files);

	process.exit(0);
};

validate();
