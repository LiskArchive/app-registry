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
const { validateAllChainIDs } = require('./validateChainID');
const { validateAllWhitelistedFiles } = require('./validateWhitelistedFiles');
const { validateAllConfigFiles } = require('./validateConfigFiles');
const { getNetworkDirs, getNestedFilesByName } = require('./shared/utils')
const config = require('../config');

const validate = async () => {
    // Get all network dirs for schema validation
	const networkDirs = await getNetworkDirs(config.rootDir);

    const files = [];
    for (const networkDir of networkDirs) {
        files.push(... await getNestedFilesByName(networkDir, [config.appJsonFilename, config.nativetokensJsonFilename]));
    }

    // Validate schemas
    await validateAllSchemas(files);

    // Check whitelisted Files
    await validateAllWhitelistedFiles(networkDirs);

    // Check Config files
    await validateAllConfigFiles(networkDirs);

    // Validate chain IDs
    await validateAllChainIDs(files);
}

validate();