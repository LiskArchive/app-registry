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
const config = require('../config');
const { readJsonFile } = require('./utils/fs');

const validateTokens = async (changedAppFiles) => {
	const validationErrors = [];

	const nativetokenFiles = changedAppFiles.filter((filename) => filename.endsWith(config.filename.NATIVE_TOKENS));

	// eslint-disable-next-line no-restricted-syntax
	for (const nativetokenFile of nativetokenFiles) {
		// eslint-disable-next-line no-await-in-loop
		const nativeTokensdata = await readJsonFile(nativetokenFile);
		const { tokens } = nativeTokensdata;

		// eslint-disable-next-line no-restricted-syntax
		for (const token of tokens) {
			const isBaseDenomInDenomUnits = token.denomUnits.some(unit => unit.denom === token.baseDenom);
			if (!isBaseDenomInDenomUnits) {
				validationErrors.push(`baseDenom "${token.baseDenom}" is not defined in denomUnits.`);
			}

			const isBaseDenomDefinitionValid = token.denomUnits.some(unit => unit.denom === token.baseDenom && unit.decimals === 0);
			if (isBaseDenomInDenomUnits && !isBaseDenomDefinitionValid) {
				validationErrors.push(`baseDenom "${token.baseDenom}" defined in denomUnits does not have "decimals" set to 0.`);
			}
		}
	}

	return validationErrors;
};

module.exports = {
	validateTokens,
};
