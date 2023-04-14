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

describe('Schema Validation Tests', () => {
	beforeAll(async () => {
		// Create a temporary directorys for testing
		await fs.mkdir(path.join(config.rootDir, 'tempdir'));
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'docs'));
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet'));
	});

	afterAll(async () => {
		// Remove the temporary directory and files created during testing
		await fs.rm(path.join(config.rootDir, 'tempdir'), { recursive: true });
	});

	it('should validate correct schema', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain', 'app.json'), JSON.stringify(validConfig.appConfig));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain', 'nativetokens.json'), JSON.stringify(validConfig.nativeTokenConfig));

		await expect(validateAllSchemas(config.rootDir)).resolves.not.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without background color', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain2'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain2', 'app.json'), JSON.stringify(invalidAppConfig.backgroundColorNotPresent));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain2'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without chain ID', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain3'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain3', 'app.json'), JSON.stringify(invalidAppConfig.chainIDNotPresent));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain3'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without chainName', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain4'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain4', 'app.json'), JSON.stringify(invalidAppConfig.chainNameNotPresent));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain4'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without explorers', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain5'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain5', 'app.json'), JSON.stringify(invalidAppConfig.explorersNotPresent));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain5'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without genesis url', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain6'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain6', 'app.json'), JSON.stringify(invalidAppConfig.genesisURLNotPresent));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain6'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without logo', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain7'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain7', 'app.json'), JSON.stringify(invalidAppConfig.logoNotPresent));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain7'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without network type', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain8'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain8', 'app.json'), JSON.stringify(invalidAppConfig.networkTypeNotPresent));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain8'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without project page', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain9'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain9', 'app.json'), JSON.stringify(invalidAppConfig.projectPageNotPresent));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain9'), { recursive: true });
	});

	it('should throw error while validating schema for app.json without service url', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain10'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain10', 'app.json'), JSON.stringify(invalidAppConfig.serviceURLsNotPresent));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain10'), { recursive: true });
	});

	it('should throw error while validating schema for app.json with incorrect Service url', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain11'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain11', 'app.json'), JSON.stringify(invalidAppConfig.serviceUrlIncorrect));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain11'), { recursive: true });
	});

	it('should throw error while validating schema for nativetokens.json with incorrect tokens type', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain12'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain12', 'app.json'), JSON.stringify(invalidNativeTokensConfig.tokensIncorrect));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain12'), { recursive: true });
	});

	it('should throw error while validating schema for nativetokens.json without tokens', async () => {
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain13'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain13', 'app.json'), JSON.stringify(invalidNativeTokensConfig.tokensNotPresent));

		await expect(validateAllSchemas(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain13'), { recursive: true });
	});

});