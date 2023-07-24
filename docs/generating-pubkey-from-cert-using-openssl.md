# How to Generate a Public Key from PEM Certificate using OpenSSL

OpenSSL is a widely used cryptographic library that allows you to work with SSL/TLS certificates and keys. If you have a PEM certificate and need to extract the public key from it, you can use the OpenSSL command-line tool to perform this operation.

## Prerequisites

Before you begin, make sure you have OpenSSL installed on your system. Most Unix-like systems come with OpenSSL pre-installed, but if you're on Windows, you can download OpenSSL binaries from the [official website](https://www.openssl.org/).

## Steps to Generate Public Key

1. **Open a Terminal or Command Prompt:**

   For Unix-like systems, open your terminal. For Windows, launch the Command Prompt or PowerShell.

2. **Locate your PEM Certificate:**

   Ensure you have the PEM certificate file (e.g., `certificate.pem`) available in the directory where you are executing the OpenSSL command.

3. **Extract Public Key:**

   Use the `openssl rsa` command to extract the public key from the PEM certificate. The following is the syntax:

   ```bash
   openssl rsa -pubout -in certificate.pem -out public_key.pem