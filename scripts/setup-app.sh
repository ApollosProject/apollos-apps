rm -rf ApollosApp

mkdir -p ApollosApp
mkdir -p tmp

echo $2
BRANCH=$2

cd tmp
git clone git@github.com:ApollosProject/apollos-templates.git

cd apollos-templates
git checkout ${BRANCH:-master}
tput setaf 1
echo "Please enter your .env password (typically stored in 1Password)"
tput sgr0

read SECRET
./scripts/secrets.sh -d $SECRET
mv ./apolloschurchapp/.env.shared ./apolloschurchapp/.env
cd ..

shopt -s dotglob
mv apollos-templates/apolloschurchapp/* ../ApollosApp

cd ..

node scripts/swap-package-json-to-links.js ./ApollosApp

rm -rf tmp
