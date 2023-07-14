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

const path = require('path');

const { readJsonFile } = require('./utils/fs');
const config = require('../config');

const { httpRequest, wsRequest, requestInfoFromLiskNode } = require('./utils/request/index');

const validateExplorerUrls = async (explorers) => {
	const validationErrors = [];

	for (let i = 0; i < explorers.length; i++) {
		const explorer = explorers[i];
		/* eslint-disable no-await-in-loop */
		const { url: explorerURL, txnPage: explorerTxnPage } = explorer;

		try {
			await httpRequest(explorerURL);
		} catch (error) {
			validationErrors.push(new Error(`Error validating explorer URL. Error: ${error.message}.`));
		}

		try {
			await httpRequest(explorerTxnPage);
		} catch (error) {
			validationErrors.push(new Error(`Error validating explorer txn page URL. Error: ${error.message}.`));
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
			validationErrors.push(new Error(`Error validating logo png URL. Error: ${error.message}.`));
		}
	}

	if (svgURL) {
		try {
			await httpRequest(svgURL);
		} catch (error) {
			validationErrors.push(new Error(`Error validating logo svg URL. Error: ${error.message}.`));
		}
	}

	return validationErrors;
};

const validateAppNodeUrls = async (appNodeInfos, chainID) => {
	const validationErrors = [];

	for (let i = 0; i < appNodeInfos.length; i++) {
		const appNodeInfo = appNodeInfos[i];
		/* eslint-disable no-await-in-loop */
		const { url: appNodeUrl } = appNodeInfo;

		// Validate ws app node URLs
		try {
			const nodeSystemInfo = await requestInfoFromLiskNode(appNodeUrl);
			if (nodeSystemInfo.chainID !== chainID) {
				validationErrors.push(new Error(`ChainID mismatch on node: ${appNodeUrl}.\nNode chainID: ${nodeSystemInfo.chainID}. \napp.json chainID: ${chainID}.\nPlease ensure that the supplied values in the config is correct.`));
			}
		} catch (e) {
			validationErrors.push(new Error(`Error establishing connection with node: ${appNodeUrl}.`));
		}
		/* eslint-enable no-await-in-loop */
	}

	return validationErrors;
};

const validateServiceURLs = async (serviceURLs, chainID, isSecuredNetwork) => {
	const validationErrors = [];

	for (let i = 0; i < serviceURLs.length; i++) {
		const serviceURL = serviceURLs[i];

		/* eslint-disable no-await-in-loop */
		const { http: httpServiceURL, ws: wsServiceUrl, apiCertificatePublicKey: publicKey } = serviceURL;

		const { protocol: httpProtocol } = new URL(httpServiceURL);
		const { protocol: wsProtocol } = new URL(wsServiceUrl);

		if (isSecuredNetwork && (httpProtocol !== 'https:' || wsProtocol !== 'wss:' || !publicKey)) {
			validationErrors.push(new Error(`Require secure URLs and API certificate public key in case of the following networks: ${config.securedNetworks}.`));
		} else if (!isSecuredNetwork && !((httpProtocol === 'https:' && wsProtocol === 'wss:' && publicKey) || (httpProtocol === 'http:' && wsProtocol === 'ws:'))) {
			validationErrors.push(new Error('Require service HTTP and WS URLs. Incase secure URLs are provided certificate public key needs to be provided as well.'));
		} else {
			// Validate HTTP service URLs
			if (httpServiceURL) {
				try {
					const httpRes = await httpRequest(httpServiceURL + config.LS_HTTP_ENDPOINT_NET_STATUS, publicKey);
					const chainIDFromServiceURL = httpRes.data.data.chainID;
					if (chainIDFromServiceURL !== chainID) {
						validationErrors.push(new Error(`ChainID mismatch in HTTP URL: ${httpServiceURL}.\nService URL chainID: ${chainIDFromServiceURL}. \napp.json chainID: ${chainID}.\nPlease ensure that the supplied values in the config is correct.`));
					}
				} catch (error) {
					validationErrors.push(error);
				}
			}

			// Validate ws service URLs
			if (wsServiceUrl) {
				try {
					const wsRes = await wsRequest(wsServiceUrl + config.LS_WS_API_NAMESPACE, config.LS_WS_ENDPOINT_NET_STATUS, {}, publicKey);
					if (wsRes.chainID !== chainID) {
						validationErrors.push(new Error(`ChainID mismatch in WS URL: ${wsServiceUrl}.\nService URL chainID: ${wsRes.chainID}. \napp.json chainID: ${chainID}.\nPlease ensure that the supplied values in the config is correct.`));
					}
				} catch (error) {
					validationErrors.push(error);
				}
			}
		}

		/* eslint-enable no-await-in-loop */
	}

	return validationErrors;
};

const validateURLs = async (files) => {
	let validationErrors = [];

	const securedNetworkPaths = [];
	// eslint-disable-next-line no-restricted-syntax
	for (const network of config.securedNetworks) {
		securedNetworkPaths.push(path.join(config.rootDir, network));
	}

	// Get all app.json files
	const appFiles = files.filter((filename) => filename.endsWith(config.filename.APP_JSON));

	const nativetokenFiles = files.filter((filename) => filename.endsWith(config.filename.NATIVE_TOKENS));

	for (let i = 0; i < appFiles.length; i++) {
		const appFile = appFiles[i];
		/* eslint-disable no-await-in-loop */
		const data = await readJsonFile(appFile);

		// Check if app file belongs to a secured network
		let isSecuredNetwork = false;
		// eslint-disable-next-line no-restricted-syntax
		for (const securedNetworkPath of securedNetworkPaths) {
			if (appFile.startsWith(securedNetworkPath)) {
				isSecuredNetwork = true;
				break;
			}
		}

		// Validate service URLs
		const serviceURLValidationErrors = await validateServiceURLs(data.serviceURLs, data.chainID, isSecuredNetwork);

		// Validate logo URLs
		const logoValidationErrors = await validateLogoUrls(data.logo);

		// Validate explorer URLs
		const explorerURLValidationErrors = await validateExplorerUrls(data.explorers);

		// Validate appNodes URLs
		const appNodeURLValidationErrors = await validateAppNodeUrls(data.appNodes, data.chainID);
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
