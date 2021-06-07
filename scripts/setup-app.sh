rm -rf ApollosApp

mkdir -p ApollosApp
mkdir -p tmp

cd tmp || exit
git clone git@github.com:ApollosProject/apollos-templates.git

cd apollos-templates || exit
git checkout "${BRANCH:-master}"
echo "Enter password to decrypt secrets (press enter to skip):"
read -r SECRET
if [ "$SECRET" = "" ]; then
    echo "APP_DATA_URL=https://apollos-church-api.herokuapp.com" >>./apolloschurchapp/.env
else
    ./scripts/secrets.sh -d "$SECRET"
    mv ./apolloschurchapp/.env.shared ./apolloschurchapp/.env
fi

cd .. || exit

shopt -s dotglob
mv apollos-templates/apolloschurchapp/* ../ApollosApp
cp apollos-templates/yarn.lock ../ApollosApp

cd .. || exit

node scripts/swap-package-json-to-links.js ./ApollosApp

rm -rf tmp
