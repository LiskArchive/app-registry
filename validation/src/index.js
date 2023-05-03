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
const { validateConfigFilePaths } = require('./validateConfigFilePaths');
const config = require('../config');

const validate = async () => {
	const validationErrors = [];

	// Check if the PR author is from the @LiskHQ/platform team
	const isAuthorFromDevTeam = process.argv[2];

	// Get all modified files
	const allChangedFiles = process.argv.slice(3);

	// Get all app dir added or modified inside network dirs
	const changedAppDirs = new Set();
	for (let i = 0; i < allChangedFiles.length; i++) {
		const dir = allChangedFiles[i].split('/').slice(0, 2).join('/');
		if (dir.trim() && config.knownNetworks.includes(dir.split('/')[0])) {
			changedAppDirs.add(path.resolve(dir));
		} else if (isAuthorFromDevTeam === 'false') {
			validationErrors.push(new Error(`File (${allChangedFiles[i]}) does not belong to a known network.`));
		}
	}

	// Filter all changed app.json and nativetokens.json files except from Schema dir
	const changedAppFiles = allChangedFiles.filter(
		(fileName) => {
			const baseName = path.basename(fileName);
			const fullPath = path.join(config.rootDir, fileName);
			const isSchemaFile = fullPath.includes(config.schemaDir);

			const isAppOrNativeTokens = baseName === config.filename.APP_JSON || baseName === config.filename.NATIVE_TOKENS;
			const isSchemaAppOrNativeTokens = isSchemaFile && isAppOrNativeTokens;

			return isAppOrNativeTokens && !isSchemaAppOrNativeTokens;
		},
	).map((fileName) => path.join(config.rootDir, fileName));

	// Validate if app.json and nativetoken.json is present anywhere except networkDir/appName/
	await validateConfigFilePaths(changedAppFiles, validationErrors);

	// Validate all app.json and nativetoken.json schemas
	await validateAllSchemas(changedAppFiles, validationErrors);

	// Check if any non-whitelisted files are modified
	if (isAuthorFromDevTeam === 'false') {
		await validateAllWhitelistedFiles(allChangedFiles, validationErrors);
	}

	// Check for config files in all changed apps in networks directories
	await validateAllConfigFiles(changedAppDirs, validationErrors);

	// Validate serviceURLs
	await validateURLs(changedAppFiles, validationErrors);

	if (validationErrors.length > 0) {
		throw new Error(validationErrors.join('\n'));
	}

	process.exit(0);
};

validate();
