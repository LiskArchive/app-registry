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

const fs = require('fs').promises;;
const path = require('path');
const config = require('../config');
const axios = require('axios');
const { validateAllConfigFiles } = require('../src/validateConfigFiles');

describe('Configs in network directories validation tests', () => {

	beforeAll(async () => {
		// create a temporary directory and some files for testing
		await fs.mkdir(path.join(config.rootDir, 'tempdir'));
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'docs'));
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet'));
		await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet'));
	});

	afterAll(async () => {
		// remove the temporary directory and files created during testing
		await fs.rm(path.join(config.rootDir, 'tempdir'), { recursive: true });
	});

	it('should not throw error when app.json and nativetokens.json is present in all network directories', async () => {
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet', 'app.json'), JSON.stringify(require('./constants/app.json')));
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet', 'nativetokens.json'), JSON.stringify(require('./constants/nativetokens.json')));

		await expect(validateAllConfigFiles(path.join(config.rootDir, 'tempdir'))).resolves.not.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet', 'app.json'));
		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet', 'nativetokens.json'));
	});

	it('should throw error when app.json is not present in any network directories', async () => {
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet', 'nativetokens.json'), JSON.stringify(require('./constants/nativetokens.json')));

		await expect(validateAllConfigFiles(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet', 'nativetokens.json'));
	});

	it('should throw error when nativetokens.json is not present in any network directories', async () => {
		await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet', 'app.json'), JSON.stringify(require('./constants/nativetokens.json')));

		await expect(validateAllConfigFiles(path.join(config.rootDir, 'tempdir'))).rejects.toThrow();

		await fs.rm(path.join(config.rootDir, 'tempdir', 'mainNet', 'testNet', 'app.json'));
	});
});
