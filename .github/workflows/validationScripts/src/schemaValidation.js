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

const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const config = require('../config');

const { getNestedFilesByName, getNetworkDirs, readJsonFile} = require("./shared/utils")

const appSchema = require(config.appSchema);
const nativeTokenSchema = require(config.nativeTokenSchema);

const ajv = new Ajv()
addFormats(ajv)

const validateAllSchemas = async (directory) => {

	// Get all network dirs for schema validation
	const networkDirs = await getNetworkDirs(directory);

	for (const networkDir of networkDirs) {
		// Get all app.json files from network folders
		const appFiles = await getNestedFilesByName(networkDir, config.appJsonFilename);

		// Validate all app files
		await validateSchema(appSchema, appFiles);

		// Get all nativetokens.json files from network folders
		const nativeTokenFiles = await getNestedFilesByName(networkDir, config.nativetokensJsonFilename);

		// Validate all nativetokens files
		await validateSchema(nativeTokenSchema, nativeTokenFiles);
	}
}

const validateSchema = async (schema, filePaths) => {
	for (filePath of filePaths) {
		const data = await readJsonFile(filePath);
		const valid = ajv.validate(schema, data);

		if (!valid) {
			throw new Error(JSON.stringify(ajv.errors));
		}
	}
}

module.exports = {
	validateAllSchemas,
}