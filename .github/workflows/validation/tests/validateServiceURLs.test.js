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

const config = require('../config');
const axios = require('axios');
const { validateAllServiceURLs } = require('../src/validateServiceURLs');
const serviceURLResponse = require('./constants/serviceURLResponse');
const validConfig = require('./constants/validConfig')
const fsUtil = require('./shared/fsUtil')

let filesToTest;

jest.mock("axios");


describe('ChainID Validation tests', () => {

	beforeAll(async () => {
		// Create a temporary directory and some files for testing
		await fsUtil.createTestEnvironment();
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(validConfig.appConfig));
		filesToTest = await fsUtil.getJSONFilesFromNetwork();
	});

	afterAll(async () => {
		// Remove the temporary directory and files created during testing
		await fsUtil.cleanTestEnviroment();
	});

	it('should throw error when service URL API returns an error', async () => {
		// Mock axios to return an error response
		axios.get.mockImplementationOnce(() => Promise.reject(new Error('mock error')));

		// Test validation
		await expect(validateAllServiceURLs(filesToTest)).rejects.toThrow();

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should throw error when service URL API returns status code other than 200', async () => {
		// Mock axios to return an success response
		axios.get.mockImplementationOnce(() => Promise.resolve(serviceURLResponse.serviceURL500Res));

		// Test validation
		await expect(validateAllServiceURLs(filesToTest)).rejects.toThrow();

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should not throw error when service URL API returns correct chain ID', async () => {
		// Mock axios to return an success response
		axios.get.mockImplementationOnce(() => Promise.resolve(serviceURLResponse.serviceURLSuccessRes));

		// Test validation
		await expect(validateAllServiceURLs(filesToTest)).resolves.not.toThrow();

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should throw error when service URL API returns incorrect chain ID', async () => {
		// Mock axios to return an success response
		axios.get.mockImplementationOnce(() => Promise.resolve(serviceURLResponse.serviceURLIncorrectRes));

		// Test validation
		await expect(validateAllServiceURLs(filesToTest)).rejects.toThrow();

		// Restore axios mock
		jest.resetAllMocks();
	});
});
