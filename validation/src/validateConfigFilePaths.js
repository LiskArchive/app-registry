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
const config = require('../config');

const validateConfigFilePaths = async (filePaths, validationErrors) => {
	try {
		for (let i = 0; i < filePaths.length; i++) {
			const filePath = filePaths[i];
			const currentDir = path.dirname(filePath);
			const parentDir = path.dirname(currentDir);
			const grandparentDir = path.basename(parentDir);

			if (!config.knownNetworks.includes(grandparentDir)) {
				validationErrors.push(new Error(`File (${filePath}) does not belong to a known network.`));
			}
		}
	} catch (err) {
		validationErrors.push(new Error(`Error: ${err}`));
	}
};

module.exports = {
	validateConfigFilePaths,
};
