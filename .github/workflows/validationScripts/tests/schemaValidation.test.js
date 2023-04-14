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
const fs = require('fs').promises;
const path = require('path');
const invalidNativeTokensConfig = require ('./constants/invalidNativeTokensConfig')
const invalidAppConfig = require('./constants/invalidAppConfig')
const validConfig = require('./constants/validConfig')
const fsUtil = require('./shared/fsUtil')

describe('Schema Validation Tests', () => {
	beforeAll(async () => {
		// Create a temporary directory and some files for testing
		await fsUtil.createTestEnvironment();
	});

	afterAll(async () => {
		// Remove the temporary directory and files created during testing
		await fsUtil.cleanTestEnviroment();
	});

	it('should validate correct schema', async () => {
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(validConfig.appConfig));
		await fsUtil.createFileInNetwork('nativetokens.json', JSON.stringify(validConfig.nativeTokenConfig));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).resolves.not.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
		await fsUtil.removeFileFromNetwork('nativetokens.json');
	});

	it('should throw error while validating schema for app.json without background color', async () => {
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(invalidAppConfig.backgroundColorNotPresent));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
	});

	it('should throw error while validating schema for app.json without chain ID', async () => {
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(invalidAppConfig.chainIDNotPresent));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
	});

	it('should throw error while validating schema for app.json without chainName', async () => {
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(invalidAppConfig.chainNameNotPresent));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
	});

	it('should throw error while validating schema for app.json without explorers', async () => {
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(invalidAppConfig.explorersNotPresent));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
	});

	it('should throw error while validating schema for app.json without genesis url', async () => {
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(invalidAppConfig.genesisURLNotPresent));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
	});

	it('should throw error while validating schema for app.json without logo', async () => {
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(invalidAppConfig.logoNotPresent));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
	});

	it('should throw error while validating schema for app.json without network type', async () => {
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(invalidAppConfig.networkTypeNotPresent));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
	});

	it('should throw error while validating schema for app.json without project page', async () => {
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(invalidAppConfig.projectPageNotPresent));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
	});

	it('should throw error while validating schema for app.json without service url', async () => {
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(invalidAppConfig.serviceURLsNotPresent));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
	});

	it('should throw error while validating schema for app.json with incorrect Service url', async () => {
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(invalidAppConfig.serviceUrlIncorrect));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
	});

	it('should throw error while validating schema for nativetokens.json with incorrect tokens type', async () => {
		await fsUtil.createFileInNetwork('nativetokens.json', JSON.stringify(invalidNativeTokensConfig.tokensIncorrect));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('nativetokens.json');
	});

	it('should throw error while validating schema for nativetokens.json without tokens', async () => {
		await fsUtil.createFileInNetwork('nativetokens.json', JSON.stringify(invalidNativeTokensConfig.tokensNotPresent));
		await expect(validateAllSchemas(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('nativetokens.json');
	});

});