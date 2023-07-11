const serviceURLSuccessRes = {
	status: 200,
	data: {
		data: {
			version: '0.1.0',
			networkVersion: '1.0',
			chainID: '03000000',
			lastBlockID: 'aa71164271f84ca47c632c5b8e311ce3c97b627d79449488589aa79417175030',
			height: 43817,
			finalizedHeight: 43816,
			syncing: false,
			unconfirmedTransactions: 0,
			genesis: {
				block: {
					fromFile: './config/genesis_block.blob',
				},
				blockTime: 10,
				bftBatchSize: 103,
				maxTransactionsSize: 15360,
				chainID: '03000000',
			},
			registeredModules: [
				'auth',
				'dynamicReward',
				'fee',
				'interoperability',
				'pos',
				'random',
				'token',
				'validators',
			],
			moduleCommands: [
				'auth:registerMultisignature',
				'interoperability:registerMainchain',
				'interoperability:submitSidechainCrossChainUpdate',
				'interoperability:initializeStateRecovery',
				'interoperability:recoverState',
				'pos:registerValidator',
				'pos:reportMisbehavior',
				'pos:unlock',
				'pos:updateGeneratorKey',
				'pos:stake',
				'pos:changeCommission',
				'pos:claimRewards',
				'token:transfer',
				'token:transferCrossChain',
			],
			network: {
				version: '1.0',
				port: 7668,
				seedPeers: [],
			},
		},
		meta: {
			lastUpdate: 1681206583,
			lastBlockHeight: 43817,
			lastBlockID: 'aa71164271f84ca47c632c5b8e311ce3c97b627d79449488589aa79417175030',
		},
	},
};

const serviceURL500Res = {
	status: 500,
	data: {
		data: {
			message: 'Server error',
		},
	},
};

const serviceURLIncorrectRes = {
	status: 200,
	data: {
		data: {
			version: '0.1.0',
			networkVersion: '1.0',
			chainID: '03000001',
			lastBlockID: 'aa71164271f84ca47c632c5b8e311ce3c97b627d79449488589aa79417175030',
			height: 43817,
			finalizedHeight: 43816,
			syncing: false,
			unconfirmedTransactions: 0,
			genesis: {
				block: {
					fromFile: './config/genesis_block.blob',
				},
				blockTime: 10,
				bftBatchSize: 103,
				maxTransactionsSize: 15360,
				chainID: '03000001',
			},
			registeredModules: [
				'auth',
				'dynamicReward',
				'fee',
				'interoperability',
				'pos',
				'random',
				'token',
				'validators',
			],
			moduleCommands: [
				'auth:registerMultisignature',
				'interoperability:registerMainchain',
				'interoperability:submitSidechainCrossChainUpdate',
				'interoperability:initializeStateRecovery',
				'interoperability:recoverState',
				'pos:registerValidator',
				'pos:reportMisbehavior',
				'pos:unlock',
				'pos:updateGeneratorKey',
				'pos:stake',
				'pos:changeCommission',
				'pos:claimRewards',
				'token:transfer',
				'token:transferCrossChain',
			],
			network: {
				version: '1.0',
				port: 7668,
				seedPeers: [],
			},
		},
		meta: {
			lastUpdate: 1681206583,
			lastBlockHeight: 43817,
			lastBlockID: 'aa71164271f84ca47c632c5b8e311ce3c97b627d79449488589aa79417175030',
		},
	},
};

const serviceURLSuccessResWs = {
	jsonrpc: '2.0',
	result: {
		data: {
			chainID: '03000000',
			genesisHeight: 16270293,
			height: 22133864,
			finalizedHeight: 22133716,
			networkVersion: '3.1',
			networkIdentifier: '4c09e6a781fc4c7bdb936ee815de8f94190f8a7519becd9de2081832be309a99',
			milestone: '4',
			currentReward: '100000000',
			rewards: {
				milestones: [
					'500000000',
					'400000000',
					'300000000',
					'200000000',
					'100000000',
				],
				offset: 1451520,
				distance: 3000000,
			},
			registeredModules: [
				'token',
				'sequence',
				'keys',
				'dpos',
				'legacyAccount',
			],
			moduleAssets: [
				{
					id: '2:0',
					name: 'token:transfer',
				},
				{
					id: '4:0',
					name: 'keys:registerMultisignatureGroup',
				},
				{
					id: '5:0',
					name: 'dpos:registerDelegate',
				},
				{
					id: '5:1',
					name: 'dpos:voteDelegate',
				},
				{
					id: '5:2',
					name: 'dpos:unlockToken',
				},
				{
					id: '5:3',
					name: 'dpos:reportDelegateMisbehavior',
				},
				{
					id: '1000:0',
					name: 'legacyAccount:reclaimLSK',
				},
			],
			blockTime: 10,
			communityIdentifier: 'Lisk',
			minRemainingBalance: '5000000',
			maxPayloadLength: 15360,
		},
		meta: {
			lastUpdate: 1689085288,
			lastBlockHeight: 22133864,
			lastBlockId: '6b178714b98bd560fa618ee419dc1e6c4ca80671fdf6940316f62fee50d2e38a',
		},
	},
	id: 1,
};

const serviceURLIncorrectResWs = {
	jsonrpc: '2.0',
	result: {
		data: {
			chainID: '04000000',
			genesisHeight: 16270293,
			height: 22133864,
			finalizedHeight: 22133716,
			networkVersion: '3.1',
			networkIdentifier: '4c09e6a781fc4c7bdb936ee815de8f94190f8a7519becd9de2081832be309a99',
			milestone: '4',
			currentReward: '100000000',
			rewards: {
				milestones: [
					'500000000',
					'400000000',
					'300000000',
					'200000000',
					'100000000',
				],
				offset: 1451520,
				distance: 3000000,
			},
			registeredModules: [
				'token',
				'sequence',
				'keys',
				'dpos',
				'legacyAccount',
			],
			moduleAssets: [
				{
					id: '2:0',
					name: 'token:transfer',
				},
				{
					id: '4:0',
					name: 'keys:registerMultisignatureGroup',
				},
				{
					id: '5:0',
					name: 'dpos:registerDelegate',
				},
				{
					id: '5:1',
					name: 'dpos:voteDelegate',
				},
				{
					id: '5:2',
					name: 'dpos:unlockToken',
				},
				{
					id: '5:3',
					name: 'dpos:reportDelegateMisbehavior',
				},
				{
					id: '1000:0',
					name: 'legacyAccount:reclaimLSK',
				},
			],
			blockTime: 10,
			communityIdentifier: 'Lisk',
			minRemainingBalance: '5000000',
			maxPayloadLength: 15360,
		},
		meta: {
			lastUpdate: 1689085288,
			lastBlockHeight: 22133864,
			lastBlockId: '6b178714b98bd560fa618ee419dc1e6c4ca80671fdf6940316f62fee50d2e38a',
		},
	},
	id: 1,
};

module.exports = {
	serviceURLSuccessRes,
	serviceURL500Res,
	serviceURLIncorrectRes,
	serviceURLSuccessResWs,
	serviceURLIncorrectResWs,
};
