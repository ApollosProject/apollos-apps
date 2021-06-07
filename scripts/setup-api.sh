rm -rf ApollosApi

mkdir -p ApollosApi
mkdir -p tmp

cd tmp
git clone git@github.com:ApollosProject/apollos-templates.git

cd apollos-templates
git checkout ${BRANCH:-master}
tput setaf 1
echo "Please enter your .env password (typically stored in 1Password)"
tput sgr0

read SECRET
./scripts/secrets.sh -d $SECRET
mv ./apollos-church-api/.env.shared ./apollos-church-api/.env
cd ..

shopt -s dotglob
mv apollos-templates/apollos-church-api/* ../ApollosApi
cp apollos-templates/yarn.lock ../ApollosApi

cd ..

node scripts/swap-package-json-to-links.js ./ApollosApi

rm -rf tmp
