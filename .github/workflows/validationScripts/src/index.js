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

const { validateAllSchemas } = require('./schemaValidation');
const { validateAllChainIds } = require('./validateChainId');
const { validateAllWhitelistedFiles } = require('./validateWhitelistedFiles');
const { validateAllConfigFiles } = require('./validateConfigFiles');
const config = require('../config');

// Validate schemas
validateAllSchemas(config.rootDir);

// Check whitelisted Files
validateAllWhitelistedFiles(config.rootDir);

// Check Config files
validateAllConfigFiles(config.rootDir);

// Validate chain Ids
validateAllChainIds(config.rootDir);