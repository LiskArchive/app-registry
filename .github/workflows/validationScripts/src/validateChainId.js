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

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const { getNestedFilesByName, getNetworkDirs } = require("./shared/utils")

const validateAllChainIDs = async (directory) => {
	// Get all network dirs for schema validation
	const networkDirs = await getNetworkDirs(directory);

	for (const networkDir of networkDirs) {
		// Get all app.json files from network folders
		const appFiles = await getNestedFilesByName(networkDir, 'app.json');

		// Validate chain ID for all app.json files
		for (appFile of appFiles) {
			const data = require(appFile);

			if (!data || !data.chainID || !data.serviceURLs || !data.serviceURLs[0] || !data.serviceURLs[0].http) {
				throw new Error("Service URL or chain ID missing from app.json")
			}

			const chainID = data.chainID;
			const [{ http: serviceURL }] = data.serviceURLs;

			const chainIDFromServiceURL = await getChainIDFromService(serviceURL + "/api/v3/network/status");
			if (chainIDFromServiceURL != chainID) {
				throw new Error('Chain ID mismatch. \nService URL chain ID: ${chainIDFromServiceURL}. \napp.json chain ID: ${chainID}. \nPlease ensure that they match and try again.');
			}
		}

	}
}

const getChainIDFromService = async (serviceURL) => {
	try {
		const response = await axios.get(serviceURL);
		if (response.status === 200) {
			const chainID = response.data.data.chainID;
			return chainID;
		} else {
			throw new Error(`Error: Service URL API returned status code ${response.status}`);
		}
	} catch (error) {
		throw new Error(`Error: ${error.message}`);
	}
}

module.exports = {
	validateAllChainIDs,
}
