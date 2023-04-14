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

const { validateAllWhitelistedFiles } = require('../src/validateWhitelistedFiles');
const validConfig = require('./constants/validConfig');
const fsUtil = require('./shared/fsUtil');
const config = require('../config');

describe('Whitelisted Files Tests', () => {
	beforeAll(async () => {
		// Create a temporary directory and some files for testing
		await fsUtil.createTestEnvironment();
		await fsUtil.createFileInNetwork(config.appJsonFilename, JSON.stringify(validConfig.appConfig));
		await fsUtil.createFileInNetwork(config.nativetokensJsonFilename, JSON.stringify(validConfig.nativeTokenConfig));
	});

	afterAll(async () => {
		// Remove the temporary directory and files created during testing
		await fsUtil.cleanTestEnviroment();
	});

	it('should allow whitelisted files and directories', async () => {
		await expect(validateAllWhitelistedFiles(fsUtil.tempDataDir)).resolves.not.toThrow();
	});

	it('should throw an error for non-whitelisted files', async () => {
		await fsUtil.createFileInNetwork('tempfile.js', 'console.log("hello world");');
		await expect(validateAllWhitelistedFiles(fsUtil.tempDataDir)).rejects.toThrow();
		await fsUtil.removeFileFromNetwork('tempfile.js');
	});

	it('should not check files in non-network directories', async () => {
		await fsUtil.createFileInDocs('tempfile.js', 'console.log("hello world");');
		await expect(validateAllWhitelistedFiles(fsUtil.tempDataDir)).resolves.not.toThrow();
		await fsUtil.removeFileFromDocs('tempfile.js', 'console.log("hello world");');
	});
});