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

const axios = require('axios');
const https = require('https');
const io = require('socket.io-client');
const pemtools = require('pemtools');

const agent = new https.Agent({
	rejectUnauthorized: true,
});

const getCertificate = async (url) => new Promise((resolve, reject) => {
	try {
		const { hostname } = new URL(url);

		const options = {
			host: hostname,
			port: 443,
			method: 'GET',
		};

		const req = https.request(options, (res) => {
			resolve(res.connection.getPeerCertificate());
		});

		req.end();
	} catch (error) {
		reject(error);
	}
});

const httpsRequest = async (url, certificate) => {
	if (new URL(url).protocol !== 'https:') {
		throw new Error(`Unsecured service URL provided ${url}.`);
	}

	try {
		const response = await axios.get(url, { httpsAgent: agent });

		if (response.status === 200) {
			const sslCertificate = await getCertificate(url);

			const serverCertificate = pemtools(Buffer.from(JSON.stringify(sslCertificate.raw)), 'CERTIFICATE').toString();
			if (serverCertificate !== certificate) {
				throw new Error('Certificate supplied for https request dosent match with certificate provided by the server');
			}

			return response;
		}
		throw new Error(`Error: URL '${url}' returned response with status code ${response.status}.`);
	} catch (error) {
		throw new Error(`Error: ${error.message}`);
	}
};

const httpRequest = async (url) => {
	try {
		const response = await axios.get(url);
		if (response.status === 200) {
			return response;
		}
		throw new Error(`Error: URL '${url}' returned response with status code ${response.status}.`);
	} catch (error) {
		throw new Error(`Error: ${error.message}`);
	}
};

const wssRequest = (wsEndpoint, wsMethod, wsParams, certificate) => {
	if (new URL(wsEndpoint).protocol !== 'wss:') {
		throw new Error(`Incorrect secured websocket URL protocol: ${wsEndpoint}.`);
	}

	return new Promise((resolve, reject) => {
		const socket = io(wsEndpoint, { forceNew: true, transports: ['websocket'], agent });

		socket.emit('request', { method: wsMethod, params: wsParams }, answer => {
			socket.close();

			getCertificate(wsEndpoint).then((sslCertificate) => {
				const serverCertificate = pemtools(Buffer.from(JSON.stringify(sslCertificate.raw)), 'CERTIFICATE').toString();
				if (serverCertificate !== certificate) {
					throw new Error('Certificate supplied for wss request dosent match with certificate provided by the server');
				}

				resolve(answer.result.data);
			}).catch((err) => {
				reject(err);
			});
		});

		socket.on('error', (err) => {
			socket.close();
			reject(err);
		});
	});
};

const wsRequest = (wsEndpoint, wsMethod, wsParams) => {
	if (new URL(wsEndpoint).protocol !== 'ws:') {
		throw new Error(`Incorrect websocket URL protocol: ${wsEndpoint}.`);
	}

	return new Promise((resolve, reject) => {
		const socket = io(wsEndpoint, { forceNew: true, transports: ['websocket'] });

		socket.emit('request', { method: wsMethod, params: wsParams }, answer => {
			socket.close();
			resolve(answer.result.data);
		});

		socket.on('error', (err) => {
			socket.close();
			reject(err);
		});
	});
};

module.exports = {
	httpRequest,
	httpsRequest,
	wsRequest,
	wssRequest,
};
