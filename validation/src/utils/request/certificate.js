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

const { exec } = require('child_process');
const crypto = require('crypto');

const cachedCerts = {};

// eslint-disable-next-line consistent-return
const getCertificateFromURL = async (url) => new Promise((resolve, reject) => {
	const { host } = new URL(url);

	if (host in cachedCerts) {
		return resolve(cachedCerts[host]);
	}

	// Use OpenSSL to retrieve the PEM certificate
	const command = `openssl s_client -connect ${host}:443 -showcerts </dev/null 2>/dev/null | openssl x509 -outform PEM`;

	exec(command, (error, stdout, stderr) => {
		if (error) {
			reject(error);
			return;
		}

		if (stderr) {
			reject(new Error(`Error: ${stderr}`));
			return;
		}

		const pemCertificate = stdout;
		cachedCerts[host] = pemCertificate;
		resolve(pemCertificate);
	});
});

// eslint-disable-next-line consistent-return
const convertCertificateToPemPublicKey = (pemCertificate) => new Promise((resolve, reject) => {
	try {
		// Create a certificate object from the PEM data
		const certificate = crypto.createPublicKey({
			key: pemCertificate,
			format: 'pem',
		});

		// Convert the certificate to PEM format for public key
		const publicKeyPem = certificate.export({
			format: 'pem',
			type: 'spki',
		});

		return resolve(publicKeyPem);
	} catch (error) {
		reject(new Error(`Error occurred while extracting the public key: ${error.message}.`));
	}
});

module.exports = {
	getCertificateFromURL,
	convertCertificateToPemPublicKey,
};
