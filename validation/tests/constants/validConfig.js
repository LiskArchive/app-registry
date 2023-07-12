const appConfig = {
	title: 'Lisk - Alphanet',
	description: 'Metadata configuration for the Lisk blockchain (mainchain) in alphanet',
	chainName: 'network',
	chainID: '03000000',
	networkType: 'alphanet',
	genesisURL: 'https://downloads.lisk.com/lisk/alphanet/genesis_block.json.tar.gz',
	projectPage: 'https://lisk.com',
	logo: {
		png: 'https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png',
		svg: 'https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg',
	},
	backgroundColor: '#f7f9fb',
	serviceURLs: [
		{
			http: 'http://alphanet-service.liskdev.net',
			ws: 'ws://alphanet-service.liskdev.net',
		},
	],
	explorers: [],
	appNodes: [
		{
			url: 'ws://devnet-service.liskdev.net:7887',
			maintainer: 'Lightcurve GmbH',
		},
	],
};

const nativeTokenConfig = {
	title: 'Lisk - Alphanet - Native tokens',
	tokens: [
		{
			tokenID: '0300000000000000',
			tokenName: 'Lisk',
			description: 'Default token for the entire Lisk ecosystem',
			denomUnits: [
				{
					denom: 'beddows',
					decimals: 0,
					aliases: [
						'Beddows',
					],
				},
				{
					denom: 'lsk',
					decimals: 8,
					aliases: [
						'Lisk',
					],
				},
			],
			baseDenom: 'beddows',
			displayDenom: 'lsk',
			symbol: 'LSK',
			logo: {
				png: 'https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png',
				svg: 'https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg',
			},
		},
	],
};

module.exports = {
	appConfig,
	nativeTokenConfig,
};
