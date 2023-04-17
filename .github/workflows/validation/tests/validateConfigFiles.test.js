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

const { validateAllConfigFiles } = require('../src/validateConfigFiles');
const validConfig = require('./constants/validConfig');
const fsUtil = require('./shared/fsUtil');
const config = require('../config');

describe('Configs in network directories validation tests', () => {

	beforeAll(async () => {
		// Create a temporary directory and some files for testing
		await fsUtil.createTestEnvironment();
	});

	afterAll(async () => {
		// Remove the temporary directory and files created during testing
		await fsUtil.cleanTestEnviroment();
	});

	it('should not throw error when app.json and nativetokens.json is present in all network directories', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(validConfig.appConfig));
		await fsUtil.createFileInNetwork(config.filename.NATIVE_TOKENS, JSON.stringify(validConfig.nativeTokenConfig));
		await expect(validateAllConfigFiles(fsUtil.getNetworkDirs())).resolves.not.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
		await fsUtil.removeFileFromNetwork(config.filename.NATIVE_TOKENS);
	});

	it('should throw error when app.json is not present in any network directories', async () => {
		await fsUtil.createFileInNetwork(config.filename.NATIVE_TOKENS, JSON.stringify(validConfig.nativeTokenConfig));
		await expect(validateAllConfigFiles(fsUtil.getNetworkDirs())).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.NATIVE_TOKENS);
	});

	it('should throw error when nativetokens.json is not present in any network directories', async () => {
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(validConfig.appConfig));
		await expect(validateAllConfigFiles(fsUtil.getNetworkDirs())).rejects.toThrow();
		await fsUtil.removeFileFromNetwork(config.filename.APP_JSON);
	});
});
