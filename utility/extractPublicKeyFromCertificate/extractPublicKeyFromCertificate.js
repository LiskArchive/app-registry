/*
 * LiskHQ/lisk-service
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
 *
 */

const fs = require('fs');
const crypto = require('crypto');

// Function to generate the public key from PEM certificate
function extractPublicKeyFromCertificate(certFilePath, publicKeyFilePath) {
  // Read the PEM certificate from the file
  const pemCertificate = fs.readFileSync(certFilePath);

  try {
    // Create a certificate object from the PEM data
    const certificate = crypto.createPublicKey({
      key: pemCertificate,
      format: 'pem',
    });

    // Convert the certificate to PEM format for public key
    const publicKeyPem = certificate.export({
      format: 'pem',
      type: 'spki',
    });

    // Write the public key to the output file
    fs.writeFileSync(publicKeyFilePath, publicKeyPem);

    console.log(`Public key successfully extracted to: ${publicKeyFile}.`);
    process.exit(0);
  } catch (error) {
    console.error(`Error occurred while extracting the public key: ${error.message}.`);
    process.exit(1);
  }
}

const pemCertificateFile = process.argv[2];
const publicKeyFile = process.argv[3];

extractPublicKeyFromCertificate(pemCertificateFile, publicKeyFile);
