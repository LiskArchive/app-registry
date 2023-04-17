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
const { readJsonFile } = require("./shared/fsUtils")

const appSchema = require(`${config.schemaDir}/${config.filename.APP_JSON}`);
const nativeTokenSchema = require(`${config.schemaDir}/${config.filename.NATIVE_TOKENS}`);

const ajv = new Ajv()
addFormats(ajv)

const validateSchema = async (schema, filePaths) => {
	for (filePath of filePaths) {
		const data = await readJsonFile(filePath);
		const valid = ajv.validate(schema, data);
	
		if (!valid) {
			throw new Error(JSON.stringify(ajv.errors));
		}
	}
}

const validateAllSchemas = async (files) => {

	// Get all app.json files
	const appFiles = files.filter((filename) => {
		return filename.endsWith(config.filename.APP_JSON);
	});

	// Get all nativetokens.json files
	const nativeTokenFiles = files.filter((filename) => {
		return filename.endsWith(config.filename.NATIVE_TOKENS);
	});

	// Validate schemas
	await validateSchema(appSchema, appFiles);
	await validateSchema(nativeTokenSchema, nativeTokenFiles);
}

module.exports = {
	validateAllSchemas,
}
