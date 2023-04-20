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
const { apiClient } = require('@liskhq/lisk-client');
const net = require('net');

const { readJsonFile } = require('./utils/fs');
const config = require('../config');

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

const wsRequest = async (wsEndpoint) => {
	try {
		const client = await apiClient.createWSClient(wsEndpoint);
		const res = await client._channel.invoke('system_getNodeInfo', {});
		return res;
	} catch (error) {
		throw new Error(`Error: ${error.message}`);
	}
};

const validateExplorerUrls = async (explorers) => {
	for (let i = 0; i < explorers.length; i++) {
		const explorer = explorers[i];
		/* eslint-disable no-await-in-loop */
		const { url: explorerURL, txnPage: explorerTxnPage } = explorer;

		await httpRequest(explorerURL);
		await httpRequest(explorerTxnPage);
		/* eslint-enable no-await-in-loop */
	}
};

const validateLogoUrls = async (logos) => {
	const { png: pngURL, svg: svgURL } = logos;

	if (pngURL) await httpRequest(pngURL);
	if (svgURL) await httpRequest(svgURL);
};

const checkWebsocketConnection = async (url) => {
	const urlParts = url.split('://');
	if (urlParts[0] !== 'ws' && urlParts[0] !== 'wss') {
		return Promise.reject(new Error('Invalid websocket URL'));
	}

	const [host, port] = urlParts[1].split(':');
	return new Promise((resolve, reject) => {
		const socket = net.createConnection({ host, port });

		socket.on('connect', () => {
			socket.end();
			resolve();
		});

		socket.on('error', (err) => {
			socket.end();
			reject(err);
		});
	});
};

const validateAppNodeUrls = async (appNodeInfos) => {
	for (let i = 0; i < appNodeInfos.length; i++) {
		const appNodeInfo = appNodeInfos[i];
		/* eslint-disable no-await-in-loop */
		const { url: appNodeUrl } = appNodeInfo;

		// Validate ws app node URLs
		try {
			await checkWebsocketConnection(appNodeUrl);
		} catch (e) {
			throw new Error(`Error establishing connection with node: ${appNodeUrl}`);
		}
		/* eslint-enable no-await-in-loop */
	}
};

const validateServiceURLs = async (serviceURLs, chainID) => {
	for (let i = 0; i < serviceURLs.length; i++) {
		const serviceURL = serviceURLs[i];
		/* eslint-disable no-await-in-loop */
		const { http: httpServiceURL, ws: wsServiceUrl } = serviceURL;

		// Validate HTTP service URLs
		const httpRes = await httpRequest(httpServiceURL + config.HTTP_API_NAMESPACE);
		const chainIDFromServiceURL = httpRes.data.data.chainID;
		if (chainIDFromServiceURL !== chainID) {
			throw new Error(`ChainID mismatch in HTTP URL: ${httpServiceURL}.\nService URL chainID: ${chainIDFromServiceURL}. \napp.json chainID: ${chainID}.\nPlease ensure that the supplied values in the config is correct.`);
		}

		// Validate ws service URLs
		const wsRes = await wsRequest(wsServiceUrl + config.WS_API_NAMESPACE);
		if (wsRes.chainID !== chainID) {
			throw new Error(`ChainID mismatch in WS URL: ${wsServiceUrl}.\nService URL chainID: ${chainIDFromServiceURL}. \napp.json chainID: ${chainID}.\nPlease ensure that the supplied values in the config is correct.`);
		}
		/* eslint-enable no-await-in-loop */
	}
};

const validateURLs = async (files) => {
	// Get all app.json files
	const appFiles = files.filter((filename) => filename.endsWith(config.filename.APP_JSON));

	const nativetokenFiles = files.filter((filename) => filename.endsWith(config.filename.NATIVE_TOKENS));

	for (let i = 0; i < appFiles.length; i++) {
		const appFile = appFiles[i];
		/* eslint-disable no-await-in-loop */
		const data = await readJsonFile(appFile);

		// Validate service URLs
		await validateServiceURLs(data.serviceURLs, data.chainID);

		// Validate logo URLs
		await validateLogoUrls(data.logo);

		// Validate explorer URLs
		await validateExplorerUrls(data.explorers);

		// Validate appNodes URLs
		await validateAppNodeUrls(data.appNodes);
		/* eslint-enable no-await-in-loop */
	}

	// Validate URLs for nativetokens.json file
	for (let i = 0; i < nativetokenFiles.length; i++) {
		const nativetokenFile = nativetokenFiles[i];
		/* eslint-disable no-await-in-loop */
		const data = await readJsonFile(nativetokenFile);

		for (let j = 0; j < data.tokens.length; j++) {
			const token = data.tokens[j];
			// Validate logo URLs
			await validateLogoUrls(token.logo);
		}
		/* eslint-enable no-await-in-loop */
	}
};

module.exports = {
	validateURLs,
};
