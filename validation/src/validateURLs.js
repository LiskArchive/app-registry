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
const net = require('net');
const io = require('socket.io-client');

const { readJsonFile } = require('./utils/fs');
const config = require('../config');

const agent = new https.Agent({
	rejectUnauthorized: true,
});

const httpsRequest = async (url) => {
	if (new URL(url).protocol !== 'https:') {
		throw new Error(`Unsecured service URL provided ${url}.`);
	}

	try {
		const response = await axios.get(url, { httpsAgent: agent });
		if (response.status === 200) {
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

const wsRequest = (wsEndpoint, wsMethod, wsParams) => {
	if (new URL(wsEndpoint).protocol !== 'wss:') {
		throw new Error(`Unsecured service websocket URL provided ${wsEndpoint}.`);
	}

	return new Promise((resolve, reject) => {
		const socket = io(wsEndpoint, { forceNew: true, transports: ['websocket'], agent });

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

const validateExplorerUrls = async (explorers) => {
	const validationErrors = [];

	for (let i = 0; i < explorers.length; i++) {
		const explorer = explorers[i];
		/* eslint-disable no-await-in-loop */
		const { url: explorerURL, txnPage: explorerTxnPage } = explorer;

		try {
			await httpRequest(explorerURL);
		} catch (error) {
			validationErrors.push(new Error(`Error: ${error}`));
		}

		try {
			await httpRequest(explorerTxnPage);
		} catch (error) {
			validationErrors.push(new Error(`Error: ${error}`));
		}
		/* eslint-enable no-await-in-loop */
	}

	return validationErrors;
};

const validateLogoUrls = async (logos) => {
	const validationErrors = [];
	const { png: pngURL, svg: svgURL } = logos;

	if (pngURL) {
		try {
			await httpRequest(pngURL);
		} catch (error) {
			validationErrors.push(new Error(`Error: ${error}`));
		}
	}

	if (svgURL) {
		try {
			await httpRequest(svgURL);
		} catch (error) {
			validationErrors.push(new Error(`Error: ${error}`));
		}
	}

	return validationErrors;
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
	const validationErrors = [];

	for (let i = 0; i < appNodeInfos.length; i++) {
		const appNodeInfo = appNodeInfos[i];
		/* eslint-disable no-await-in-loop */
		const { url: appNodeUrl } = appNodeInfo;

		// Validate ws app node URLs
		try {
			await checkWebsocketConnection(appNodeUrl);
		} catch (e) {
			validationErrors.push(new Error(`Error establishing connection with node: ${appNodeUrl}.`));
		}
		/* eslint-enable no-await-in-loop */
	}

	return validationErrors;
};

const validateServiceURLs = async (serviceURLs, chainID) => {
	const validationErrors = [];

	for (let i = 0; i < serviceURLs.length; i++) {
		const serviceURL = serviceURLs[i];
		/* eslint-disable no-await-in-loop */
		const { https: httpsServiceURL, wss: wssServiceUrl } = serviceURL;

		// Validate HTTP service URLs
		try {
			const httpRes = await httpsRequest(httpsServiceURL + config.HTTP_API_NAMESPACE);
			const chainIDFromServiceURL = httpRes.data.data.chainID;
			if (chainIDFromServiceURL !== chainID) {
				validationErrors.push(new Error(`ChainID mismatch in HTTP URL: ${httpsServiceURL}.\nService URL chainID: ${chainIDFromServiceURL}. \napp.json chainID: ${chainID}.\nPlease ensure that the supplied values in the config is correct.`));
			}
		} catch (error) {
			validationErrors.push(new Error(`Error: ${error}`));
		}

		// Validate ws service URLs
		try {
			const wsRes = await wsRequest(wssServiceUrl + config.WS_API_NAMESPACE, config.WS_NETWORK_STATUS_API, {});
			if (wsRes.chainID !== chainID) {
				validationErrors.push(new Error(`ChainID mismatch in WS URL: ${wssServiceUrl}.\nService URL chainID: ${wsRes.chainID}. \napp.json chainID: ${chainID}.\nPlease ensure that the supplied values in the config is correct.`));
			}
		} catch (error) {
			validationErrors.push(new Error(`Error: ${error}`));
		}
		/* eslint-enable no-await-in-loop */
	}

	return validationErrors;
};

const validateURLs = async (files) => {
	let validationErrors = [];

	// Get all app.json files
	const appFiles = files.filter((filename) => filename.endsWith(config.filename.APP_JSON));

	const nativetokenFiles = files.filter((filename) => filename.endsWith(config.filename.NATIVE_TOKENS));

	for (let i = 0; i < appFiles.length; i++) {
		const appFile = appFiles[i];
		/* eslint-disable no-await-in-loop */
		const data = await readJsonFile(appFile);

		// Validate service URLs
		const serviceURLValidationErrors = await validateServiceURLs(data.serviceURLs, data.chainID);

		// Validate logo URLs
		const logoValidationErrors = await validateLogoUrls(data.logo);

		// Validate explorer URLs
		const explorerURLValidationErrors = await validateExplorerUrls(data.explorers);

		// Validate appNodes URLs
		const appNodeURLValidationErrors = await validateAppNodeUrls(data.appNodes);
		/* eslint-enable no-await-in-loop */

		validationErrors = [...validationErrors, ...serviceURLValidationErrors, ...logoValidationErrors,
			...explorerURLValidationErrors, ...appNodeURLValidationErrors];
	}

	// Validate URLs for nativetokens.json file
	for (let i = 0; i < nativetokenFiles.length; i++) {
		const nativetokenFile = nativetokenFiles[i];
		/* eslint-disable no-await-in-loop */
		const data = await readJsonFile(nativetokenFile);

		if (data.tokens) {
			// eslint-disable-next-line no-restricted-syntax
			for (const token of data.tokens) {
				// Validate logo URLs
				const logoValidationErrors = await validateLogoUrls(token.logo);
				validationErrors = [...validationErrors, ...logoValidationErrors];
			}
		}
		/* eslint-enable no-await-in-loop */
	}

	return validationErrors;
};

module.exports = {
	validateURLs,
};
