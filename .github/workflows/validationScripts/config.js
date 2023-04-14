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

const path = require("path");

const config = {};

// Root directory which holds networks
config.rootDir = path.join(__dirname, '../../../');

// Directories not related to networks
config.nonNetworkDirs = ['.git', '.github', 'schema', 'docs']

// Default schemas for app and native tokens
config.appSchema = path.join(config.rootDir, 'schema/app.json');
config.nativeTokenSchema = path.join(config.rootDir, 'schema/nativetokens.json');

// API suffix to get chain ID
config.networkStatusAPIPath = "/api/v3/network/status";

// Filenames
config.appJsonFilename = "app.json";
config.nativetokensJsonFilename = "nativetokens.json"

// Files whitelisted
config.whitelistedFiles = []
config.whitelistedExtentionsToValidate = ['.js']

module.exports = config;