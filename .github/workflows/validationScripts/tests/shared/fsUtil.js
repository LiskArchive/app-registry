const config = require('../../config');
const path = require('path');
const fs = require('fs').promises;
const validConfig = require('../constants/validConfig');

const tempDataDir = path.join(config.rootDir, 'tempdir');

const createTestEnvironment = async () => {
    await fs.mkdir(path.join(config.rootDir, 'tempdir'));
    await fs.mkdir(path.join(config.rootDir, 'tempdir', 'docs'));
    await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet'));
    await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'network'));
}

const cleanTestEnviroment = async () => {
    await fs.rm(path.join(config.rootDir, 'tempdir'), { recursive: true });
}

const createFileInNetwork = async (filename, data) => {
    await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'network', filename), data);
}

const removeFileFromNetwork = async (filename) => {
    await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'network', filename));
}

const createFileInDocs = async (filename, data) => {
    await fs.writeFile(path.join(config.rootDir, 'tempdir', 'docs', filename), data);
}

const removeFileFromDocs = async (filename) => {
    await fs.rm(path.join(config.rootDir, 'tempdir', 'docs', filename));
}

module.exports = {
    tempDataDir,
    createTestEnvironment,
    cleanTestEnviroment,
    createFileInNetwork,
    removeFileFromNetwork,
    createFileInDocs,
    removeFileFromDocs,
}