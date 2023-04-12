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

describe('Schema Validation Tests', () => {
	beforeAll(async () => {
		// create a temporary directorys for testing
		await fs.mkdir(path.join(config.rootDir, 'tempdir'));
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'docs'));
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet'));
	});

	afterAll(async () => {
		// remove the temporary directory and files created during testing
		await fs.rm(path.join(config.rootDir, 'tempdir'), { recursive: true });
	});

	it('should validate correct schema', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet', 'app.json'), JSON.stringify(require('./constants/app.json')));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet', 'nativetokens.json'), JSON.stringify(require('./constants/nativetokens.json')));

		await expect(validateAllSchemas(config.rootDir)).resolves.not.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without background color', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet2'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet2', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/app_backgroundColorNotPresent.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet2'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without chain ID', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet3'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet3', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/app_chainIDNotPresent.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet3'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without chainName', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet4'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet4', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/app_chainNameNotPresent.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet4'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without explorers', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet5'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet5', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/app_explorersNotPresent.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet5'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without genesis url', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet6'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet6', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/app_genesisURLNotPresent.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet6'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without logo', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet7'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet7', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/app_logoNotPresent.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet7'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without network type', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet8'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet8', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/app_networkTypeNotPresent.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet8'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without project page', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet9'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet9', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/app_networkTypeNotPresent.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet9'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without project page', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet10'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet10', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/app_projectPageNotPresent.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet10'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without service url', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet11'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet11', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/app_serviceURLsNotPresent.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet11'), { recursive: true });
	});

	it('should throw error while validating schema for app.json with incorrect Service url', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet12'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet12', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/app_serviceUrlIncorrect.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet12'), { recursive: true });
	});

	it('should throw error while validating schema for nativetokens.json with incorrect tokens type', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet13'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet13', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/nativetokens_tokensIncorrect.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet13'), { recursive: true });
	});

	it('should throw error while validating schema for nativetokens.json without tokens', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet14'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet14', 'app.json'), JSON.stringify(require('./constants/invalidConfigs/nativetokens_tokensNotPresent.json')));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet14'), { recursive: true });
	});

});