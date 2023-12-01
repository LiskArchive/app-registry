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
const { validateTokens } = require('../src/validateTokens');
const config = require('../config');
const validConfig = require('./constants/validConfig');
const invalidConfig = require('./constants/invalidNativeTokensConfig');
const setup = require('./helper/setup');

let filesToTest;

describe('validateTokens', () => {
	beforeAll(async () => {
		// Create a temporary directory and some files for testing
		await setup.createTestEnvironment();
		filesToTest = setup.getJSONFilesFromNetwork();
	});

	afterAll(async () => {
		// Remove the temporary directory and files created during testing
		await setup.cleanTestEnvironment();
	});

	it('should return an empty array for valid input', async () => {
		/* eslint-disable max-len */
		await setup.createFileInNetwork(config.filename.NATIVE_TOKENS, JSON.stringify(validConfig.nativeTokenConfig));

		const result = await validateTokens(filesToTest);
		expect(result).toEqual([]);

		await setup.removeFileFromNetwork(config.filename.NATIVE_TOKENS);
		/* eslint-enable max-len */
	});

	it('should return an array with an error message if no elements in denomUnits have 0 decimals', async () => {
		/* eslint-disable max-len */
		await setup.createFileInNetwork(config.filename.NATIVE_TOKENS, JSON.stringify(invalidConfig.baseDenomWithIncorrectDecimals));

		const result = await validateTokens(filesToTest);
		expect(result).toEqual([`baseDenom ${invalidConfig.baseDenomWithIncorrectDecimals.tokens[0].baseDenom} defined in denomUnits does not have decimals set to 0.`]);

		await setup.removeFileFromNetwork(config.filename.NATIVE_TOKENS);
		/* eslint-enable max-len */
	});

	it('should return an array with an error message if baseDemon is not present in denomUnits', async () => {
		/* eslint-disable max-len */
		await setup.createFileInNetwork(config.filename.NATIVE_TOKENS, JSON.stringify(invalidConfig.baseDenomNotInToken));

		const result = await validateTokens(filesToTest);
		expect(result).toEqual([`baseDenom "${invalidConfig.baseDenomNotInToken.tokens[0].baseDenom}" is not defined in denomUnits.`]);

		await setup.removeFileFromNetwork(config.filename.NATIVE_TOKENS);
		/* eslint-enable max-len */
	});

	it('should return an empty array for empty input', async () => {
		const result = await validateTokens([]);
		expect(result).toEqual([]);
	});
});
