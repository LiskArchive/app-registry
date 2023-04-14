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
const validConfig = require('./constants/validConfig')
const fsUtil = require('./shared/fsUtil')

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
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(validConfig.appConfig));
		await fsUtil.createFileInNetwork('nativetokens.json', JSON.stringify(validConfig.nativeTokenConfig));
		await expect(validateAllConfigFiles(fsUtil.tempDataDir)).resolves.not.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
		await fsUtil.removeFileFromNetwork('nativetokens.json');
	});

	it('should throw error when app.json is not present in any network directories', async () => {
		await fsUtil.createFileInNetwork('nativetokens.json', JSON.stringify(validConfig.nativeTokenConfig));
		await expect(validateAllConfigFiles(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('nativetokens.json');
	});

	it('should throw error when nativetokens.json is not present in any network directories', async () => {
		await fsUtil.createFileInNetwork('app.json', JSON.stringify(validConfig.appConfig));
		await expect(validateAllConfigFiles(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('app.json');
	});
});
