const fs = require('fs');
const crypto = require('crypto');

// Function to generate the public key from PEM certificate
function generatePublicKeyFromCertificate(certFilePath, publicKeyFilePath) {
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

    console.log('Public key generated successfully!');
  } catch (error) {
    console.error('Error generating public key:', error.message);
  }
}

const pemCertificateFile = process.argv[2];
const publicKeyFile = process.argv[3];

generatePublicKeyFromCertificate(pemCertificateFile, publicKeyFile);
