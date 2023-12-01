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
jest.mock('child_process');
jest.mock('crypto');

const { exec } = require('child_process');
const crypto = require('crypto');

const { getCertificateFromURL, convertCertificateToPemPublicKey } = require('../../../src/utils/request/certificate');

describe('getCertificateFromURL', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should fetch certificate using exec', async () => {
		const url = 'https://example.com';
		const expectedCertificate = 'certificate';

		// Mocking the URL and exec result
		jest.spyOn(global, 'URL').mockImplementationOnce(() => ({ host: 'example.com' }));
		global.cachedCerts = {};

		exec.mockImplementationOnce((command, callback) => {
			callback(null, expectedCertificate, null);
		});

		const result = await getCertificateFromURL(url);

		expect(result).toBe(expectedCertificate);
		expect(exec).toHaveBeenCalledWith(expect.stringContaining('example.com'), expect.any(Function));
	});

	it('should reject if URL parsing fails', async () => {
		const url = 'invalid-url';

		// Mocking the URL and avoiding exec call
		jest.spyOn(global, 'URL').mockImplementationOnce(() => {
			throw new Error('Invalid URL');
		});

		await expect(getCertificateFromURL(url)).rejects.toThrowError();
		expect(exec).not.toHaveBeenCalled();
	});
});

describe('convertCertificateToPemPublicKey', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should convert certificate to PEM public key', async () => {
		const pemCertificate = 'pemCertificate';
		const expectedPublicKey = 'pemPublicKey';

		// Mocking crypto.createPublicKey
		crypto.createPublicKey.mockReturnValueOnce({
			export: jest.fn().mockReturnValueOnce(expectedPublicKey),
		});

		const result = await convertCertificateToPemPublicKey(pemCertificate);

		expect(result).toBe(expectedPublicKey);
		expect(crypto.createPublicKey).toHaveBeenCalledWith({
			key: pemCertificate,
			format: 'pem',
		});
	});

	it('should reject if crypto.createPublicKey encounters an error', async () => {
		const pemCertificate = 'pemCertificate';

		// Mocking crypto.createPublicKey error
		crypto.createPublicKey.mockImplementationOnce(() => {
			throw new Error('Unexpected Error');
		});

		await expect(convertCertificateToPemPublicKey(pemCertificate)).rejects.toThrow();
	});
});
