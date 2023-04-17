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

const { validateAllSchemas } = require('../src/schemaValidation');
const config = require('../config');
const invalidNativeTokensConfig = require ('./constants/invalidNativeTokensConfig')
const invalidAppConfig = require('./constants/invalidAppConfig')
const validConfig = require('./constants/validConfig')
const fsUtil = require('./shared/fsUtil')

let filesToTest;

describe('Schema Validation Tests', () => {
	beforeAll(async () => {
		// Create a temporary directory and some files for testing
		await fsUtil.createTestEnvironment();
		filesToTest = await fsUtil.getJSONFilesFromNetwork();
	});

	afterAll(async () => {
		// Remove the temporary directory and files created during testing
		await fsUtil.cleanTestEnviroment();
	});

	it('should validate correct schema', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(validConfig.appConfig));
		await fsUtil.createFileInNetwork(config.filename.NATIVE_TOKENS, JSON.stringify(validConfig.nativeTokenConfig));
		await expect(validateAllSchemas(filesToTest)).resolves.not.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
		await fsUtil.removeFileFromNetwork(config.filename.NATIVE_TOKENS);
	});

	it('should throw error while validating schema for app.json without background color', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(invalidAppConfig.backgroundColorNotPresent));
		await expect(validateAllSchemas(filesToTest)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
	});

	it('should throw error while validating schema for app.json without chain ID', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(invalidAppConfig.chainIDNotPresent));
		await expect(validateAllSchemas(filesToTest)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
	});

	it('should throw error while validating schema for app.json without chainName', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(invalidAppConfig.chainNameNotPresent));
		await expect(validateAllSchemas(filesToTest)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
	});

	it('should throw error while validating schema for app.json without explorers', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(invalidAppConfig.explorersNotPresent));
		await expect(validateAllSchemas(filesToTest)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
	});

	it('should throw error while validating schema for app.json without genesis url', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(invalidAppConfig.genesisURLNotPresent));
		await expect(validateAllSchemas(filesToTest)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
	});

	it('should throw error while validating schema for app.json without logo', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(invalidAppConfig.logoNotPresent));
		await expect(validateAllSchemas(filesToTest)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
	});

	it('should throw error while validating schema for app.json without network type', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(invalidAppConfig.networkTypeNotPresent));
		await expect(validateAllSchemas(filesToTest)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
	});

	it('should throw error while validating schema for app.json without project page', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(invalidAppConfig.projectPageNotPresent));
		await expect(validateAllSchemas(filesToTest)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
	});

	it('should throw error while validating schema for app.json without service url', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(invalidAppConfig.serviceURLsNotPresent));
		await expect(validateAllSchemas(filesToTest)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
	});

	it('should throw error while validating schema for app.json with incorrect Service url', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(invalidAppConfig.serviceUrlIncorrect));
		await expect(validateAllSchemas(filesToTest)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
	});

	it('should throw error while validating schema for nativetokens.json with incorrect tokens type', async () => {
		await fsUtil.createFileInNetwork(config.filename.NATIVE_TOKENS, JSON.stringify(invalidNativeTokensConfig.tokensIncorrect));
		await expect(validateAllSchemas(filesToTest)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.NATIVE_TOKENS);
	});

	it('should throw error while validating schema for nativetokens.json without tokens', async () => {
		await fsUtil.createFileInNetwork(config.filename.NATIVE_TOKENS, JSON.stringify(invalidNativeTokensConfig.tokensNotPresent));
		await expect(validateAllSchemas(filesToTest)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.NATIVE_TOKENS);
	});

});
