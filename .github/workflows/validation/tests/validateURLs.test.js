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
const { apiClient } = require('@liskhq/lisk-client');
const { validateURLs } = require('../src/validateURLs');
const serviceURLResponse = require('./constants/serviceURLResponse');
const validConfig = require('./constants/validConfig')
const fsUtil = require('./helper/utils')

let filesToTest;

jest.mock("axios");
jest.mock("@liskhq/lisk-client");


describe('URL Validation tests', () => {

	beforeAll(async () => {
		// Create a temporary directory and some files for testing
		await fsUtil.createTestEnvironment();
		await fsUtil.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(validConfig.appConfig));
		await fsUtil.createFileInNetwork(config.filename.NATIVE_TOKENS, JSON.stringify(validConfig.nativeTokenConfig));
		filesToTest = await fsUtil.getJSONFilesFromNetwork();
	});

	afterAll(async () => {
		// Remove the temporary directory and files created during testing
		await fsUtil.cleanTestEnviroment();
	});

	it('should throw error when HTTP service URL API returns an error', async () => {
		// Mock axios to return an error response
		axios.get.mockImplementation(() => Promise.reject(new Error('mock error')));
		apiClient.createWSClient.mockImplementation(async (url) => Promise.resolve(serviceURLResponse.serviceURLSuccessResWs));

		// Test validation
		await expect(validateURLs(filesToTest)).rejects.toThrow();

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should throw error when ws service URL API returns an error', async () => {
		// Mock axios to return an error response
		axios.get.mockImplementation(() => Promise.resolve(serviceURLResponse.serviceURLSuccessRes));
		apiClient.createWSClient.mockImplementation(async (url) => Promise.reject(new Error('mock error')));

		// Test validation
		await expect(validateURLs(filesToTest)).rejects.toThrow();

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should throw error when HTTP service URL API returns status code other than 200', async () => {
		// Mock axios to return an success response
		axios.get.mockImplementation(() => Promise.resolve(serviceURLResponse.serviceURL500Res));
		apiClient.createWSClient.mockImplementation(async (url) => Promise.resolve(serviceURLResponse.serviceURLSuccessResWs));

		// Test validation
		await expect(validateURLs(filesToTest)).rejects.toThrow();

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should not throw error when service URL API returns correct chain ID', async () => {
		// Mock axios to return an success response
		axios.get.mockImplementation(() => Promise.resolve(serviceURLResponse.serviceURLSuccessRes));
		apiClient.createWSClient.mockImplementation(async (url) => Promise.resolve(serviceURLResponse.serviceURLSuccessResWs));

		// Test validation
		await expect(validateURLs(filesToTest)).resolves.not.toThrow();

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should throw error when HTTP service URL API returns incorrect chain ID', async () => {
		// Mock axios to return an success response
		axios.get.mockImplementation(() => Promise.resolve(serviceURLResponse.serviceURLIncorrectRes));
		apiClient.createWSClient.mockImplementation(async (url) => Promise.resolve(serviceURLResponse.serviceURLSuccessResWs))

		// Test validation
		await expect(validateURLs(filesToTest)).rejects.toThrow();

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should throw error when ws service URL API returns incorrect chain ID', async () => {
		// Mock axios to return an success response
		axios.get.mockImplementationOnce(() => Promise.resolve(serviceURLResponse.serviceURLSuccessRes));
		apiClient.createWSClient.mockImplementation(async (url) => Promise.resolve(serviceURLResponse.serviceURLIncorrectResWs))

		// Test validation
		await expect(validateURLs(filesToTest)).rejects.toThrow();

		// Restore axios mock
		jest.resetAllMocks();
	});
});
