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

const net = require('net');
const io = require('socket.io-client');
const axios = require('axios');
const { apiClient } = require('@liskhq/lisk-client');
const config = require('../config');
const { validateURLs } = require('../src/validateURLs');
const serviceURLResponse = require('./constants/serviceURLResponse');
const validConfig = require('./constants/validConfig');
const setup = require('./helper/setup');

let filesToTest;

jest.mock('axios');
jest.mock('socket.io-client');
jest.mock('@liskhq/lisk-client');

describe('URL Validation tests', () => {
	beforeAll(async () => {
		// Create a temporary directory and some files for testing
		/* eslint-disable max-len */
		await setup.createTestEnvironment();
		await setup.createFileInNetwork(config.filename.APP_JSON, JSON.stringify(validConfig.appConfig));
		await setup.createFileInNetwork(config.filename.NATIVE_TOKENS, JSON.stringify(validConfig.nativeTokenConfig));
		filesToTest = setup.getJSONFilesFromNetwork();
		/* eslint-enable max-len */
	});

	afterAll(async () => {
		// Remove the temporary directory and files created during testing
		await setup.cleanTestEnviroment();
	});

	it('should have validation errors when HTTP service URL API returns an error', async () => {
		// Mock axios to return an error response
		axios.get.mockImplementation(() => Promise.reject(new Error('mock error')));
		apiClient.createWSClient.mockImplementation(async () => Promise.resolve(serviceURLResponse.nodeURLSuccessResWs));

		jest.spyOn(io, 'io').mockReturnValueOnce({
			emit: jest.fn().mockImplementation((event, params, callback) => {
				callback(serviceURLResponse.nodeURLSuccessResWs);
			}),
			on: jest.fn(),
			close: jest.fn(),
		});

		// Test validation
		const urlErrors = await validateURLs(filesToTest);
		expect(urlErrors.length).toBeGreaterThan(0);

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should have validation errors when ws service URL API returns an error', async () => {
		// Mock axios to return an error response
		axios.get.mockImplementation(() => Promise.resolve(serviceURLResponse.serviceURLSuccessRes));
		apiClient.createWSClient.mockImplementation(async () => Promise.reject(new Error('mock error')));

		jest.spyOn(io, 'io').mockReturnValueOnce({
			emit: jest.fn().mockImplementation((event, params, callback) => {
				callback(serviceURLResponse.nodeURLSuccessResWs);
			}),
			on: jest.fn(),
			close: jest.fn(),
		});

		// Test validation
		const urlErrors = await validateURLs(filesToTest);
		expect(urlErrors.length).toBeGreaterThan(0);

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should have validation errors when HTTP service URL API returns status code other than 200', async () => {
		// Mock axios to return an success response
		axios.get.mockImplementation(() => Promise.resolve(serviceURLResponse.serviceURL500Res));
		apiClient.createWSClient.mockImplementation(async () => Promise.resolve(serviceURLResponse.nodeURLSuccessResWs));

		jest.spyOn(io, 'io').mockReturnValueOnce({
			emit: jest.fn().mockImplementation((event, params, callback) => {
				callback(serviceURLResponse.nodeURLSuccessResWs);
			}),
			on: jest.fn(),
			close: jest.fn(),
		});

		// Test validation
		const urlErrors = await validateURLs(filesToTest);
		expect(urlErrors.length).toBeGreaterThan(0);

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should not have validation errors when service URL API returns correct chain ID', async () => {
		// Mock axios to return an success response
		axios.get.mockImplementation(() => Promise.resolve(serviceURLResponse.serviceURLSuccessRes));
		apiClient.createWSClient.mockImplementation(async () => Promise.resolve(serviceURLResponse.nodeURLSuccessResWs));

		jest.spyOn(io, 'io').mockReturnValueOnce({
			emit: jest.fn().mockImplementation((event, params, callback) => {
				callback(serviceURLResponse.serviceURLSuccessResWs);
			}),
			on: jest.fn(),
			close: jest.fn(),
		});

		// Test validation
		const urlErrors = await validateURLs(filesToTest);
		expect(urlErrors.length).toBe(0);

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should have validation errors when connection cant be established with app nodes ', async () => {
		// Mock axios to return an success response
		axios.get.mockImplementation(() => Promise.resolve(serviceURLResponse.serviceURLSuccessRes));
		apiClient.createWSClient.mockImplementation(async () => Promise.resolve(serviceURLResponse.nodeURLSuccessResWs));

		jest.spyOn(net, 'createConnection').mockReturnValueOnce({
			on: jest.fn().mockImplementation((event, callback) => {
				if (event === 'error') {
					callback(new Error('Connection failed')); // Call the "error" event handler immediately with an error
				}
			}),
			end: jest.fn(),
		});

		jest.spyOn(io, 'io').mockReturnValueOnce({
			emit: jest.fn().mockImplementation((event, params, callback) => {
				callback(serviceURLResponse.nodeURLSuccessResWs);
			}),
			on: jest.fn(),
			close: jest.fn(),
		});

		// Test validation
		const urlErrors = await validateURLs(filesToTest);
		expect(urlErrors.length).toBeGreaterThan(0);

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should have validation errors when HTTP service URL API returns incorrect chain ID', async () => {
		// Mock axios to return an success response
		axios.get.mockImplementation(() => Promise.resolve(serviceURLResponse.serviceURLIncorrectRes));
		apiClient.createWSClient.mockImplementation(async () => Promise.resolve(serviceURLResponse.nodeURLSuccessResWs));

		jest.spyOn(io, 'io').mockReturnValueOnce({
			emit: jest.fn().mockImplementation((event, params, callback) => {
				callback(serviceURLResponse.nodeURLSuccessResWs);
			}),
			on: jest.fn(),
			close: jest.fn(),
		});

		// Test validation
		const urlErrors = await validateURLs(filesToTest);
		expect(urlErrors.length).toBeGreaterThan(0);

		// Restore axios mock
		jest.resetAllMocks();
	});

	it('should have validation errors when ws service URL API returns incorrect chain ID', async () => {
		// Mock axios to return an success response
		axios.get.mockImplementation(() => Promise.resolve(serviceURLResponse.serviceURLSuccessRes));
		apiClient.createWSClient.mockImplementation(async () => Promise.resolve(serviceURLResponse.nodeURLIncorrectResWs));

		jest.spyOn(io, 'io').mockReturnValueOnce({
			emit: jest.fn().mockImplementation((event, params, callback) => {
				callback(serviceURLResponse.serviceURLSuccessResWs);
			}),
			on: jest.fn(),
			close: jest.fn(),
		});

		// Test validation
		const urlErrors = await validateURLs(filesToTest);
		expect(urlErrors.length).toBeGreaterThan(0);

		// Restore axios mock
		jest.resetAllMocks();
	});
});
