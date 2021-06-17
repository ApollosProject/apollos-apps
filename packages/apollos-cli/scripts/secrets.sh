#!/bin/bash
if [ $# -ne 2 ]; then
  echo "Usage: secrets.sh -e|-d KEY"
  exit 1
fi

function encrypt() {
  if [[ `uname -m` == 'arm64' ]]; 
  then
    /opt/homebrew/Cellar/openssl@1.1/1.1.1k/bin/openssl enc -aes-256-cbc -pbkdf2 -iter 20000 -in "$1" -out "$1".enc -k "$2"
  else 
    /usr/local/opt/openssl@1.1/bin/openssl enc -aes-256-cbc -pbkdf2 -iter 20000 -in "$1" -out "$1".enc -k "$2"
  fi
}

function decrypt() {
  if [[ `uname -m` == 'arm64' ]]; 
  then
    /opt/homebrew/Cellar/openssl@1.1/1.1.1k/bin/openssl enc -d -aes-256-cbc -pbkdf2 -iter 20000 -in "$1".enc -out "$1" -k "$2"
  else 
    /usr/local/opt/openssl@1.1/bin/openssl enc -d -aes-256-cbc -pbkdf2 -iter 20000 -in "$1".enc -out "$1" -k "$2"
  fi
}

SECRETS=(
  ".env.shared"
  "android/key.json"
  "android/app/apollos.keystore"
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
