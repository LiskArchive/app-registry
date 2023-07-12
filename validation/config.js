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

const config = {};

// Root directory which holds networks
config.rootDir = path.join(__dirname, '../');

// Directories corresponding the known networks
config.knownNetworks = ['devnet', 'alphanet', 'betanet', 'testnet', 'mainnet'];
config.securedNetworks = ['testnet', 'mainnet'];

// Schema directory
config.schemaDir = path.join(config.rootDir, 'schema');

// API suffix to get chain ID
config.HTTP_API_NAMESPACE = '/api/v3/network/status';
config.WS_API_NAMESPACE = '/rpc-v3';
config.WS_NETWORK_STATUS_API = 'get.network.status';

config.NODE_REQUEST_SUFFIX = '/rpc-ws';

// Filenames
config.filename = {
	APP_JSON: 'app.json',
	NATIVE_TOKENS: 'nativetokens.json',
};

// Files whitelisted
config.whitelistedFilesPath = path.join(__dirname, 'whitelistedFiles');

module.exports = config;
