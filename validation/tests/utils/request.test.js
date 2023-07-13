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
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const axios = require('axios');
const io = require('socket.io-client');

const mockRequestFilePath = path.resolve(`${__dirname}/../../src/utils/request`);

jest.mock('axios');
jest.mock('pemtools');
jest.mock('socket.io-client');

describe('wsRequest for ws requests', () => {
	beforeEach(() => {
		io.mockReset();
	});

	it('should throw an error for an incorrect websocket URL protocol', async () => {
		const wsEndpoint = 'http://example.com';
		const wsMethod = 'exampleMethod';
		const wsParams = { exampleParam: 'value' };

		const { wsRequest } = require(mockRequestFilePath);
		await expect(wsRequest(wsEndpoint, wsMethod, wsParams)).rejects.toThrow(
			`Incorrect websocket URL protocol: ${wsEndpoint}.`,
		);
		expect(io).not.toHaveBeenCalled();
	});

	it('should resolve with the response data when successful', async () => {
		const wsEndpoint = 'ws://example.com';
		const wsMethod = 'exampleMethod';
		const wsParams = { exampleParam: 'value' };

		const mockResponse = { result: { data: 'Mock response data' } };

		const mockSocket = {
			emit: jest.fn().mockImplementation((eventName, data, callback) => {
				callback(mockResponse);
			}),
			close: jest.fn(),
			on: jest.fn(),
		};

		io.mockReturnValueOnce(mockSocket);

		const { wsRequest } = require(mockRequestFilePath);
		const responseData = await wsRequest(wsEndpoint, wsMethod, wsParams);

		expect(responseData).toEqual(mockResponse.result.data);
		expect(io).toHaveBeenCalledWith(wsEndpoint, { forceNew: true, transports: ['websocket'] });
		expect(mockSocket.emit).toHaveBeenCalledWith('request', { method: wsMethod, params: wsParams }, expect.any(Function));
		expect(mockSocket.close).toHaveBeenCalled();
		expect(mockSocket.on).toHaveBeenCalled();
	});

	it('should reject with an error when an error event is received', async () => {
		const wsEndpoint = 'ws://example.com';
		const wsMethod = 'exampleMethod';
		const wsParams = { exampleParam: 'value' };

		const mockError = new Error('Mock error');

		const mockSocket = {
			emit: jest.fn(),
			close: jest.fn(),
			on: jest.fn().mockImplementation((eventName, callback) => {
				if (eventName === 'error') {
					callback(mockError);
				}
			}),
		};

		const { wsRequest } = require(mockRequestFilePath);
		io.mockReturnValueOnce(mockSocket);

		await expect(wsRequest(wsEndpoint, wsMethod, wsParams)).rejects.toThrow(mockError);
		expect(io).toHaveBeenCalledWith(wsEndpoint, { forceNew: true, transports: ['websocket'] });
		expect(mockSocket.emit).toHaveBeenCalledWith('request', { method: wsMethod, params: wsParams }, expect.any(Function));
		expect(mockSocket.close).toHaveBeenCalled();
		expect(mockSocket.on).toHaveBeenCalled();
	});
});

describe('httpRequest for http requests', () => {
	const url = 'http://example.com';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return the response when status code is 200', async () => {
		const mockResponse = {
			status: 200,
			data: 'Mock response data',
		};

		axios.get.mockResolvedValueOnce(mockResponse);

		const { httpRequest } = require(mockRequestFilePath);
		const response = await httpRequest(url);

		expect(response).toEqual(mockResponse);
		expect(axios.get).toHaveBeenCalledWith(url, {});
	});

	it('should throw an error when status code is not 200', async () => {
		const mockResponse = {
			status: 404,
			statusText: 'Not Found',
		};

		axios.get.mockResolvedValueOnce(mockResponse);

		const { httpRequest } = require(mockRequestFilePath);
		await expect(httpRequest(url)).rejects.toThrow(
			`Error: URL '${url}' returned response with status code ${mockResponse.status}.`,
		);
		expect(axios.get).toHaveBeenCalledWith(url, {});
	});
});

describe('wsRequest for wss requests', () => {
	const wsEndpoint = 'wss://example.com';
	const invalidWsEndpoint = 'http://example.com';
	const wsMethod = 'exampleMethod';
	const wsParams = { exampleParam: 'value' };
	const mockCertificate = 'mock-certificate';
	const invalidCertificate = 'example-certificate';
	const timeout = 5000;

	const mockResponse = { result: { data: 'Mock response data' } };
	const mockSSLCertificate = { raw: 'mock-certificate' };

	beforeEach(() => {
		io.mockReset();
		jest.resetModules();
		jest.clearAllMocks();
	});

	it('should reject with an error for an incorrect secured websocket URL protocol', async () => {
		const { wsRequest } = require(mockRequestFilePath);
		await expect(wsRequest(invalidWsEndpoint, wsMethod, wsParams, mockCertificate)).rejects.toThrow(
			`Incorrect websocket URL protocol: ${invalidWsEndpoint}.`,
		);
		expect(io).not.toHaveBeenCalled();
	});

	it('should resolve with the response data when successful and certificate matches', async () => {
		const mockSocket = {
			emit: jest.fn().mockImplementation((eventName, data, callback) => {
				callback(mockResponse);
			}),
			close: jest.fn(),
			on: jest.fn(),
		};

		jest.mock(mockRequestFilePath, () => {
			const mockPemtools = require('pemtools');
			const mockIo = require('socket.io-client');
			jest.mock('pemtools');
			jest.mock('socket.io-client');

			mockPemtools.mockReturnValueOnce('mock-certificate');
			mockIo.mockReturnValueOnce(mockSocket);

			const actualLiskServiceFramework = jest.requireActual(mockRequestFilePath);
			return {
				...actualLiskServiceFramework,
				getCertificate: jest.fn().mockResolvedValueOnce(mockSSLCertificate),
			};
		});

		const { wsRequest } = require(mockRequestFilePath);
		const responseData = await wsRequest(wsEndpoint, wsMethod, wsParams, mockCertificate, timeout);
		expect(responseData).toEqual(mockResponse.result.data);
	});

	it('should reject with an error when an error event is received', async () => {
		const mockError = new Error('Mock error');

		const mockSocket = {
			emit: jest.fn(),
			close: jest.fn(),
			on: jest.fn().mockImplementation((eventName, callback) => {
				if (eventName === 'error') {
					callback(mockError);
				}
			}),
		};

		jest.mock(mockRequestFilePath, () => {
			const mockPemtools = require('pemtools');
			const mockIo = require('socket.io-client');
			jest.mock('pemtools');
			jest.mock('socket.io-client');

			mockPemtools.mockReturnValueOnce('mock-certificate');
			mockIo.mockReturnValueOnce(mockSocket);

			const actualLiskServiceFramework = jest.requireActual(mockRequestFilePath);
			return {
				...actualLiskServiceFramework,
				getCertificate: jest.fn().mockResolvedValueOnce(mockSSLCertificate),
			};
		});

		const { wsRequest } = require(mockRequestFilePath);
		io.mockReturnValueOnce(mockSocket);

		await expect(wsRequest(wsEndpoint, wsMethod, wsParams, mockCertificate, timeout)).rejects.toThrow(mockError);
	});

	it('should reject with an error when the certificate does not match', async () => {
		const mockSocket = {
			emit: jest.fn().mockImplementation((eventName, data, callback) => {
				callback(mockResponse);
			}),
			close: jest.fn(),
			on: jest.fn(),
		};

		jest.mock(mockRequestFilePath, () => {
			const mockPemtools = require('pemtools');
			const mockIo = require('socket.io-client');
			jest.mock('pemtools');
			jest.mock('socket.io-client');

			mockPemtools.mockReturnValueOnce('mock-certificate');
			mockIo.mockReturnValueOnce(mockSocket);

			const actualLiskServiceFramework = jest.requireActual(mockRequestFilePath);
			return {
				...actualLiskServiceFramework,
				getCertificate: jest.fn().mockResolvedValueOnce(mockSSLCertificate),
			};
		});

		const { wsRequest } = require(mockRequestFilePath);
		await expect(wsRequest(wsEndpoint, wsMethod, wsParams, invalidCertificate, timeout)).rejects.toThrow(
			'Certificate supplied for wss request dosent match with certificate provided by the server',
		);
	});
});

describe('httpRequest for https requests', () => {
	const url = 'https://example.com';
	const invalidUrl = 'wss://example.com';
	const certificate = 'mock-certificate';
	const invalidCertificate = 'example-certificate';

	const mockResponse = {
		status: 200,
		data: 'Mock response data',
	};

	const mockInvalidResponse = {
		status: 404,
		statusText: 'Not Found',
	};

	const mockSSLCertificate = {
		raw: 'mock-certificate',
	};

	beforeEach(() => {
		jest.resetModules();
		jest.clearAllMocks();
	});

	it('should throw an error for an unsecured service URL', async () => {
		const { httpRequest } = require(mockRequestFilePath);
		await expect(httpRequest(invalidUrl, certificate)).rejects.toThrow(
			`Incorrect service URL provided ${invalidUrl}.`,
		);
		expect(axios.get).not.toHaveBeenCalled();
	});

	it('should return the response and validate the certificate', async () => {
		jest.mock(mockRequestFilePath, () => {
			const mockAxios = require('axios');
			const mockPemtools = require('pemtools');
			jest.mock('axios');
			jest.mock('pemtools');

			mockAxios.get.mockResolvedValueOnce(mockResponse);
			mockPemtools.mockReturnValueOnce('mock-certificate');

			const actualLiskServiceFramework = jest.requireActual(mockRequestFilePath);
			return {
				...actualLiskServiceFramework,
				getCertificate: jest.fn().mockResolvedValueOnce(mockSSLCertificate),
			};
		});

		const { httpRequest } = require(mockRequestFilePath);
		const response = await httpRequest(url, certificate);

		expect(response).toEqual(mockResponse);
	});

	it('should throw an error when the response status code is not 200', async () => {
		jest.mock(mockRequestFilePath, () => {
			const mockAxios = require('axios');
			const mockPemtools = require('pemtools');
			jest.mock('axios');
			jest.mock('pemtools');

			mockAxios.get.mockResolvedValueOnce(mockInvalidResponse);
			mockPemtools.mockReturnValueOnce('mock-certificate');

			const actualLiskServiceFramework = jest.requireActual(mockRequestFilePath);
			return {
				...actualLiskServiceFramework,
				getCertificate: jest.fn().mockResolvedValueOnce(mockSSLCertificate),
			};
		});

		const { httpRequest } = require(mockRequestFilePath);
		await expect(httpRequest(url, certificate)).rejects.toThrow(
			`Error: URL '${url}' returned response with status code ${mockInvalidResponse.status}.`,
		);
	});

	it('should throw an error when the certificate does not match', async () => {
		jest.mock(mockRequestFilePath, () => {
			const mockAxios = require('axios');
			const mockPemtools = require('pemtools');
			jest.mock('axios');
			jest.mock('pemtools');

			mockAxios.get.mockResolvedValueOnce(mockResponse);
			mockPemtools.mockReturnValueOnce('mock-certificate');

			const actualLiskServiceFramework = jest.requireActual(mockRequestFilePath);
			return {
				...actualLiskServiceFramework,
				getCertificate: jest.fn().mockResolvedValueOnce(mockSSLCertificate),
			};
		});

		const { httpRequest } = require(mockRequestFilePath);
		await expect(httpRequest(url, invalidCertificate)).rejects.toThrow(
			'Certificate supplied for https request dosent match with certificate provided by the server',
		);
	});
});

describe('getCertificate', () => {
	beforeEach(() => {
		jest.resetModules();
		jest.clearAllMocks();
	});

	it('should resolve with the peer certificate', async () => {
		const mockCertificate = 'mock-certificate';
		const mockUrl = 'https://example.com';

		jest.mock(mockRequestFilePath, () => {
			const https = require('https');
			jest.mock('https');

			https.request = jest.fn((options, callback) => {
				const res = {
					connection: {
						getPeerCertificate: jest.fn().mockReturnValue(mockCertificate),
					},
					on: jest.fn(),
					setTimeout: jest.fn(),
					destroy: jest.fn(),
				};
				callback(res);
				return {
					on: jest.fn(),
					end: jest.fn(),
				};
			});

			const actualLiskServiceFramework = jest.requireActual(mockRequestFilePath);
			return {
				...actualLiskServiceFramework,
			};
		});

		const { getCertificate } = require(mockRequestFilePath);
		const certificate = await getCertificate(mockUrl);
		expect(certificate).toEqual(mockCertificate);
	});

	it('should reject with an error if the URL is invalid', async () => {
		const invalidUrl = 'invalid-url';

		const { getCertificate } = require(mockRequestFilePath);
		await expect(getCertificate(invalidUrl)).rejects.toThrowError();
	});
});
