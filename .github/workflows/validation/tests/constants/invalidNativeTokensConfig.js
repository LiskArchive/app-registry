const tokensNotPresent = {
    "title": "Lisk - Alphanet - Native tokens"
}


const tokensIncorrect = {
    "title": "Lisk - Betanet - Native tokens",
    "tokens": "Tokens"
}

const tokenIDNotPresent = {
    "title": "Lisk - Alphanet",
    "description": "Metadata configuration for the Lisk blockchain (mainchain) in alphanet",
    "chainName": "Lisk",
    "chainID": "03000000",
    "networkType": "alphanet",
    "genesisURL": "https://downloads.lisk.com/lisk/alphanet/genesis_block.json.tar.gz",
    "projectPage": "https://lisk.com",
    "logo": {
        "png": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png",
        "svg": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg"
    },
    "backgroundColor": "#f7f9fb",
    "serviceURLs": [
        {
            "http": "https://alphanet-service.liskdev.net",
            "ws": "wss://alphanet-service.liskdev.net"
        }
    ],
    "explorers": [],
    "appNodes": [
        {
            "url": "ws://alphanet.liskdev.net:4002",
            "maintainer": "Lightcurve GmbH"
        }
    ]
}

const tokenNameNotPresent = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "description": "Default token for the entire Lisk ecosystem",
            "denomUnits": [
                {
                    "denom": "beddows",
                    "decimals": 0,
                    "aliases": [
                        "Beddows"
                    ]
                },
                {
                    "denom": "lsk",
                    "decimals": 8,
                    "aliases": [
                        "Lisk"
                    ]
                }
            ],
            "baseDenom": "beddows",
            "displayDenom": "lsk",
            "symbol": "LSK",
            "logo": {
                "png": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png",
                "svg": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg"
            }
        }
    ]
}

const denomUnitsNotPresent = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "tokenName": "Lisk",
            "description": "Default token for the entire Lisk ecosystem",
            "baseDenom": "beddows",
            "displayDenom": "lsk",
            "symbol": "LSK",
            "logo": {
                "png": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png",
                "svg": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg"
            }
        }
    ]
}

const denomUnitsDecimalsIncorrect = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "tokenName": "Lisk",
            "description": "Default token for the entire Lisk ecosystem",
            "denomUnits": "<INCORRECT>",
            "baseDenom": "beddows",
            "displayDenom": "lsk",
            "symbol": "LSK",
            "logo": {
                "png": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png",
                "svg": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg"
            }
        }
    ]
}

const denomUnitsDecimalsNotPresent = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "tokenName": "Lisk",
            "description": "Default token for the entire Lisk ecosystem",
            "denomUnits": [
                {
                    "denom": "beddows",
                    "aliases": [
                        "Beddows"
                    ]
                },
                {
                    "denom": "lsk",
                    "decimals": 8,
                    "aliases": [
                        "Lisk"
                    ]
                }
            ],
            "baseDenom": "beddows",
            "displayDenom": "lsk",
            "symbol": "LSK",
            "logo": {
                "png": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png",
                "svg": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg"
            }
        }
    ]
}

const denomUnitsDenomNotPresent = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "tokenName": "Lisk",
            "description": "Default token for the entire Lisk ecosystem",
            "denomUnits": [
                {
                    "decimals": 0,
                    "aliases": [
                        "Beddows"
                    ]
                },
                {
                    "denom": "lsk",
                    "decimals": 8,
                    "aliases": [
                        "Lisk"
                    ]
                }
            ],
            "baseDenom": "beddows",
            "displayDenom": "lsk",
            "symbol": "LSK",
            "logo": {
                "png": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png",
                "svg": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg"
            }
        }
    ]
}

const baseDenomNotPresent = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "tokenName": "Lisk",
            "description": "Default token for the entire Lisk ecosystem",
            "denomUnits": [
                {
                    "denom": "beddows",
                    "decimals": 0,
                    "aliases": [
                        "Beddows"
                    ]
                },
                {
                    "denom": "lsk",
                    "decimals": 8,
                    "aliases": [
                        "Lisk"
                    ]
                }
            ],
            "displayDenom": "lsk",
            "symbol": "LSK",
            "logo": {
                "png": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png",
                "svg": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg"
            }
        }
    ]
}

const displayDenomNotPresent = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "tokenName": "Lisk",
            "description": "Default token for the entire Lisk ecosystem",
            "denomUnits": [
                {
                    "denom": "beddows",
                    "decimals": 0,
                    "aliases": [
                        "Beddows"
                    ]
                },
                {
                    "denom": "lsk",
                    "decimals": 8,
                    "aliases": [
                        "Lisk"
                    ]
                }
            ],
            "baseDenom": "beddows",
            "symbol": "LSK",
            "logo": {
                "png": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png",
                "svg": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg"
            }
        }
    ]
}

const symbolNotPresent = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "tokenName": "Lisk",
            "description": "Default token for the entire Lisk ecosystem",
            "denomUnits": [
                {
                    "denom": "beddows",
                    "decimals": 0,
                    "aliases": [
                        "Beddows"
                    ]
                },
                {
                    "denom": "lsk",
                    "decimals": 8,
                    "aliases": [
                        "Lisk"
                    ]
                }
            ],
            "baseDenom": "beddows",
            "displayDenom": "lsk",
            "logo": {
                "png": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png",
                "svg": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg"
            }
        }
    ]
}

const logoNotPresent = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "tokenName": "Lisk",
            "description": "Default token for the entire Lisk ecosystem",
            "denomUnits": [
                {
                    "denom": "beddows",
                    "decimals": 0,
                    "aliases": [
                        "Beddows"
                    ]
                },
                {
                    "denom": "lsk",
                    "decimals": 8,
                    "aliases": [
                        "Lisk"
                    ]
                }
            ],
            "baseDenom": "beddows",
            "displayDenom": "lsk",
            "symbol": "LSK",
            "logo": {
                "png": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png",
                "svg": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg"
            }
        }
    ]
}

const logoPngNotPresent = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "tokenName": "Lisk",
            "description": "Default token for the entire Lisk ecosystem",
            "denomUnits": [
                {
                    "denom": "beddows",
                    "decimals": 0,
                    "aliases": [
                        "Beddows"
                    ]
                },
                {
                    "denom": "lsk",
                    "decimals": 8,
                    "aliases": [
                        "Lisk"
                    ]
                }
            ],
            "baseDenom": "beddows",
            "displayDenom": "lsk",
            "symbol": "LSK",
            "logo": {
                "svg": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg"
            }
        }
    ]
}

const logoSvgNotPresent = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "tokenName": "Lisk",
            "description": "Default token for the entire Lisk ecosystem",
            "denomUnits": [
                {
                    "denom": "beddows",
                    "decimals": 0,
                    "aliases": [
                        "Beddows"
                    ]
                },
                {
                    "denom": "lsk",
                    "decimals": 8,
                    "aliases": [
                        "Lisk"
                    ]
                }
            ],
            "baseDenom": "beddows",
            "displayDenom": "lsk",
            "symbol": "LSK",
            "logo": {
                "png": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png"
            }
        }
    ]
}

const logoPNGIncorrect = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "tokenName": "Lisk",
            "description": "Default token for the entire Lisk ecosystem",
            "denomUnits": [
                {
                    "denom": "beddows",
                    "decimals": 0,
                    "aliases": [
                        "Beddows"
                    ]
                },
                {
                    "denom": "lsk",
                    "decimals": 8,
                    "aliases": [
                        "Lisk"
                    ]
                }
            ],
            "baseDenom": "beddows",
            "displayDenom": "lsk",
            "symbol": "LSK",
            "logo": {
                "png": "<INCORRECT_URL>",
                "svg": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.svg"
            }
        }
    ]
}

const logoSVGIncorrect = {
    "title": "Lisk - Alphanet - Native tokens",
    "tokens": [
        {
            "tokenID": "0300000000000000",
            "tokenName": "Lisk",
            "description": "Default token for the entire Lisk ecosystem",
            "denomUnits": [
                {
                    "denom": "beddows",
                    "decimals": 0,
                    "aliases": [
                        "Beddows"
                    ]
                },
                {
                    "denom": "lsk",
                    "decimals": 8,
                    "aliases": [
                        "Lisk"
                    ]
                }
            ],
            "baseDenom": "beddows",
            "displayDenom": "lsk",
            "symbol": "LSK",
            "logo": {
                "png": "https://lisk-qa.ams3.digitaloceanspaces.com/lisk.png",
                "svg": "<INCORRECT_URL>"
            }
        }
    ]
}

module.exports = {
    tokensNotPresent,
    tokensIncorrect,
    tokenIDNotPresent,
    tokenNameNotPresent,
    denomUnitsNotPresent,
    denomUnitsDecimalsIncorrect,
    denomUnitsDecimalsNotPresent,
    denomUnitsDenomNotPresent,
    baseDenomNotPresent,
    displayDenomNotPresent,
    symbolNotPresent,
    logoNotPresent,
    logoPngNotPresent,
    logoSvgNotPresent,
    logoPNGIncorrect,
    logoSVGIncorrect,
}
