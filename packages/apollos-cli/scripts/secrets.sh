#!/bin/bash
if [ $# -ne 2 ]; then
  echo "Usage: secrets.sh -e|-d KEY"
  exit 1
fi

POSSIBLE_PATHS=(
  $(brew --prefix openssl)/bin/openssl
  $(brew --prefix openssl@1.1)/bin/openssl
  $(which openssl)
)

for DIR in "${POSSIBLE_PATHS[@]}"; do
  if [[ -e "$DIR" ]]; then
    OPENSSL=$DIR
    break
  fi
done

if [ -z ${OPENSSL+x} ]; then
  echo "No OpenSSL found."
  echo "brew install openssl"
  exit 1
else
  echo
  $OPENSSL version
  echo
fi

if $OPENSSL version | grep -q 'LibreSSL'; then
  echo "No OpenSSL found. Please install OpenSSL through Homebrew"
  echo "brew install openssl"
  echo
  $OPENSSL version
  echo
  exit 1
fi

function encrypt() {
  $OPENSSL enc -aes-256-cbc -pbkdf2 -iter 20000 -in "$1" -out "$1".enc -k "$2"
}

function decrypt() {
  $OPENSSL enc -d -aes-256-cbc -pbkdf2 -iter 20000 -in "$1".enc -out "$1" -k "$2"
}

SECRETS=(
  ".env.shared"
  "android/app/apollos.keystore"
  "fastlane/apple-api-key.json"
  "fastlane/google-api-key.json"
  # deprecated support for these files
  "android/key.json"
  "ios/apollos.p8"
)

for file in "${SECRETS[@]}"; do
  if [ "$1" = "-e" ] && [ -f "$file" ]; then
    echo "Encrypting ${file}"
    encrypt "$file" "$2"
  elif [ "$1" = "-d" ] && [ -f "$file".enc ]; then
    echo "Decrypting ${file}"
    decrypt "$file" "$2"
  elif [ "$1" = "-d" ] || [ "$1" = "-e" ]; then
    echo "Skipping ${file}"
  else
    echo "Usage: secrets.sh -e|-d KEY"
    exit 1
  fi
done
