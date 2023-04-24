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

const validateConfigFilePaths = async (filePaths) => {
	try {
		for (let i = 0; i < filePaths.length; i++) {
			/* eslint-disable no-await-in-loop */
			const filePath = filePaths[i];
			const grandparentDir = path.basename(path.dirname(path.dirname(filePath)));

			if (!config.knownNetworks.includes(grandparentDir)) {
				throw new Error(`File ${filePath} is not present in known networks directory`);
			}
			/* eslint-enable no-await-in-loop */
		}
	} catch (err) {
		throw new Error(`Error: ${err}`);
	}
};

module.exports = {
	validateConfigFilePaths,
};
