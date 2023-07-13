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
const { apiClient } = require('@liskhq/lisk-client');
const pemtools = require('pemtools');
const config = require('../../config');

const agent = new https.Agent({
	rejectUnauthorized: true,
});

const getCertificate = async (url, timeout = 5000) => new Promise((resolve, reject) => {
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

		req.on('error', (error) => {
			reject(error);
		});

		req.setTimeout(timeout, () => {
			req.destroy();
			reject(new Error(`Request timed out when fetching certificate from URL ${url}`));
		});

		req.end();
	} catch (error) {
		reject(error);
	}
});

const httpRequest = async (url, certificate) => {
	const { protocol } = new URL(url);
	if (protocol !== 'https:' && protocol !== 'http:') {
		throw new Error(`Incorrect service URL provided ${url}.`);
	}

	const httpOptions = {};
	if (protocol === 'https:') {
		httpOptions.httpsAgent = agent;
	}

	const response = await axios.get(url, httpOptions);

	if (response.status === 200) {
		if (protocol === 'https:' && certificate) {
			const sslCertificate = await getCertificate(url);

			const serverCertificate = pemtools(Buffer.from(JSON.stringify(sslCertificate.raw)), 'CERTIFICATE').toString();
			if (serverCertificate !== certificate) {
				throw new Error('Certificate supplied for https request dosent match with certificate provided by the server');
			}
		}

		return response;
	}

	throw new Error(`Error: URL '${url}' returned response with status code ${response.status}.`);
};

const wsRequest = (wsEndpoint, wsMethod, wsParams, certificate, timeout = 5000) => {
	const { protocol } = new URL(wsEndpoint);
	if (protocol !== 'ws:' && protocol !== 'wss:') {
		return Promise.reject(new Error(`Incorrect websocket URL protocol: ${wsEndpoint}.`));
	}

	const websocketOptions = { forceNew: true, transports: ['websocket'] };
	if (protocol === 'wss:') {
		websocketOptions.agent = agent;
	}

	return new Promise((resolve, reject) => {
		const socket = io(wsEndpoint, websocketOptions);

		try {
			const timer = setTimeout(() => {
				socket.close();
				reject(new Error('WebSocket request timed out.'));
			}, timeout);

			socket.emit('request', { method: wsMethod, params: wsParams }, answer => {
				clearTimeout(timer);
				socket.close();

				if (certificate) {
					getCertificate(wsEndpoint).then((sslCertificate) => {
						const serverCertificate = pemtools(Buffer.from(JSON.stringify(sslCertificate.raw)), 'CERTIFICATE').toString();
						if (serverCertificate !== certificate) {
							throw new Error('Certificate supplied for wss request dosent match with certificate provided by the server');
						}

						resolve(answer.result.data);
					}).catch((err) => {
						reject(err);
					});
				} else {
					resolve(answer.result.data);
				}
			});

			socket.on('error', (err) => {
				clearTimeout(timer);
				socket.close();
				reject(err);
			});
		} catch (err) {
			reject(err);
		}
	});
};

const requestInfoFromLiskNode = async (wsEndpoint) => {
	const urlParts = wsEndpoint.split('://');
	if (urlParts[0] !== 'ws' && urlParts[0] !== 'wss') {
		return Promise.reject(new Error('Invalid websocket URL'));
	}

	const client = await apiClient.createWSClient(wsEndpoint + config.NODE_REQUEST_SUFFIX);
	const res = await client._channel.invoke('system_getNodeInfo', {});
	return res;
};

module.exports = {
	httpRequest,
	wsRequest,
	requestInfoFromLiskNode,

	// Testing
	getCertificate,
};
