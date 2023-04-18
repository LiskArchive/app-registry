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

const { readJsonFile } = require("./utils/fs")
const config = require('../config');

const httpRequest = async (serviceURL) => {
	try {
		const response = await axios.get(serviceURL);
		if (response.status === 200) {
			return response;
		} else {
			throw new Error(`Error: Service URL API returned status code ${response.status}`);
		}
	} catch (error) {
		throw new Error(`Error: ${error.message}`);
	}
}

const wsRequest = async (serviceURL) => {
	try {
		const client = await apiClient.createWSClient(serviceURL + "/rpc-ws");
		const res = await client._channel.invoke('system_getNodeInfo', {});
		return res;
	} catch (error) {
		throw new Error(`Error: ${error.message}`);
	}
}

const validateExplorerUrls = async (explorers) => {

	for(const explorer of explorers) {
		const {url: explorerURL, txnPage: explorerTxnPage} = explorer;

		await httpRequest(explorerURL);
		await httpRequest(explorerTxnPage);
	}
}

const validateLogoUrls = async (logos) => {
	const {png: pngURL, svg: svgURL} = logos;

	if(pngURL)
		await httpRequest(pngURL);

	if(svgURL)
		await httpRequest(svgURL);
}

const validateAppNodeUrls = async (serviceURLs, chainID) => {
	for(const serviceURL of serviceURLs) {
		const { url: appNodeUrl } = serviceURL;

		// Validate ws app node URLs
		const wsRes = await wsRequest(appNodeUrl);
		if (chainID != wsRes.chainID) {
			throw new Error('Chain ID mismatch in websocket URL. \nService URL chain ID: ${chainIDFromServiceURL}. \napp.json chain ID: ${chainID}. \nPlease ensure that they match and try again.');
		}
	}
}

const validateServiceURLs = async (serviceURLs, chainID) => {
	for(const serviceURL of serviceURLs) {
		const { http: httpServiceURL, ws: wsServiceUrl } = serviceURL;

		// Validate HTTP service URLs
		const httpRes = await httpRequest(httpServiceURL + "/api/v3/network/status");
		const chainIDFromServiceURL = httpRes.data.data.chainID;
		if (chainIDFromServiceURL != chainID) {
			throw new Error('Chain ID mismatch in HTTP URL. \nService URL chain ID: ${chainIDFromServiceURL}. \napp.json chain ID: ${chainID}. \nPlease ensure that they match and try again.');
		}

		// Validate ws service URLs
		const wsRes = await wsRequest(wsServiceUrl);
		if (wsRes.chainID != chainID) {
			throw new Error('Chain ID mismatch in websocket URL. \nService URL chain ID: ${chainIDFromServiceURL}. \napp.json chain ID: ${chainID}. \nPlease ensure that they match and try again.');
		}

	}
}

const validateURLs = async (files) => {

	// Get all app.json files
	const appFiles = files.filter((filename) => {
		return filename.endsWith(config.filename.APP_JSON);
	});

	const nativetokenFiles = files.filter((filename) => {
		return filename.endsWith(config.filename.NATIVE_TOKENS);
	});
	
	for (appFile of appFiles) {
		const data = await readJsonFile(appFile);
		
		if (!data || !data.chainID || !data.serviceURLs || !data.serviceURLs[0] || !data.serviceURLs[0].http || !data.logo) {
			throw new Error(`Service URL, chain ID or logo missing from ${config.filename.APP_JSON}`)
		}

		// Validate service URLs
		await validateServiceURLs(data.serviceURLs, data.chainID);

		// Validate logo URLs
		await validateLogoUrls(data.logo);

		// Validate explorer URLs
		await validateExplorerUrls(data.explorers);

		// Validate appNodes URLs
		await validateAppNodeUrls(data.appNodes, data.chainID);
	}

	// Validate URLs for nativetokens.json file
	for (nativetokenFile of nativetokenFiles) {
		const data = await readJsonFile(nativetokenFile);
		
		if (!data || !data.tokens) {
			throw new Error(`tokens missing from ${config.filename.NATIVE_TOKENS}`)
		}

		for(const token of data.tokens) {
			if(!token.logo){
				throw new Error(`logo missing from ${config.filename.NATIVE_TOKENS}`)
			}

			// Validate logo URLs
			await validateLogoUrls(token.logo);
		}
	}
}


module.exports = {
	validateURLs,
}
