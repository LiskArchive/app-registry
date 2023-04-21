const path = require('path');
const fs = require('fs').promises;
const config = require('../../config');

const tempDataDir = path.join(config.rootDir, 'tempdir');

const createTestEnvironment = async () => {
	await fs.mkdir(path.join(config.rootDir, 'tempdir'));
	await fs.mkdir(path.join(config.rootDir, 'tempdir', 'docs'));
	await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet'));
	await fs.mkdir(path.join(config.rootDir, 'tempdir', 'mainnet', 'network'));
};

const cleanTestEnviroment = async () => {
	await fs.rm(path.join(config.rootDir, 'tempdir'), { recursive: true });
};

const createFileInNetwork = async (filename, data) => {
	await fs.writeFile(path.join(config.rootDir, 'tempdir', 'mainnet', 'network', filename), data);
};

const removeFileFromNetwork = async (filename) => {
	await fs.rm(path.join(config.rootDir, 'tempdir', 'mainnet', 'network', filename));
};

const createFileInDocs = async (filename, data) => {
	await fs.writeFile(path.join(config.rootDir, 'tempdir', 'docs', filename), data);
};

const removeFileFromDocs = async (filename) => {
	await fs.rm(path.join(config.rootDir, 'tempdir', 'docs', filename));
};

const getJSONFilesFromNetwork = () => {
	const files = [];
	files.push(path.join(config.rootDir, 'tempdir', 'mainnet', 'network', config.filename.APP_JSON));
	files.push(path.join(config.rootDir, 'tempdir', 'mainnet', 'network', config.filename.NATIVE_TOKENS));
	return files;
};

const getJSONFilesFromDocs = () => {
	const files = [];
	files.push(path.join(config.rootDir, 'tempdir', 'docs', config.filename.APP_JSON));
	files.push(path.join(config.rootDir, 'tempdir', 'docs', config.filename.NATIVE_TOKENS));
	return files;
};

const getNetworkDirs = () => [path.join(config.rootDir, 'tempdir', 'mainnet')];

const getAppDirs = () => [path.join(config.rootDir, 'tempdir', 'mainnet', 'network')];

module.exports = {
	tempDataDir,
	createTestEnvironment,
	cleanTestEnviroment,
	createFileInNetwork,
	removeFileFromNetwork,
	createFileInDocs,
	removeFileFromDocs,
	getJSONFilesFromNetwork,
	getJSONFilesFromDocs,
	getNetworkDirs,
	getAppDirs,
};
