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
const config = require('../config');
const fs = require('fs').promises;
const path = require('path');
const validConfig = require('./constants/validConfig')

describe('Whitelisted Files Tests', () => {
	beforeAll(async () => {
		// Create a temporary directory and some files for testing
		await fs.mkdir(path.join(config.rootDir, 'tempdir'));
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'docs'));
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet'));
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain'));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain', 'app.json'), JSON.stringify(validConfig.appConfig));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'chain', 'nativetokens.json'), JSON.stringify(validConfig.nativeTokenConfig));
	});

	afterAll(async () => {
		// Remove the temporary directory and files created during testing
		await fs.rm(path.join(config.rootDir, 'tempdir'), { recursive: true });
	});

	it('should allow whitelisted files and directories', async () => {
		await expect(validateAllWhitelistedFiles(path.join(config.rootDir, 'tempdir'))).resolves.not.toThrow();
	});

	it('should throw an error for non-whitelisted files', async () => {
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'tempfile2.js'), 'console.log("hello world");');
		await expect(validateAllWhitelistedFiles(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();
		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'tempfile2.js'));
	});

	it('should not check files in non-network directories', async () => {
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'docs', 'tempfile2.js'), 'console.log("hello world");');
		await expect(validateAllWhitelistedFiles(path.join(config.rootDir, 'tempdir'))).resolves.not.toThrow();
		await fs.rm(path.join(config.rootDir, 'tempdir', 'docs', 'tempfile2.js'));
	});
});