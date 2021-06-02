rm -rf ApollosApp

mkdir -p ApollosApp
mkdir -p tmp

cd tmp
git clone git@github.com:ApollosProject/apollos-templates.git

cd apollos-templates
git checkout ${BRANCH:-master}
echo "APP_DATA_URL=https://apollos-church-api.herokuapp.com" >> ./apolloschurchapp/.env
cd ..

shopt -s dotglob
mv apollos-templates/apolloschurchapp/* ../ApollosApp

cd ..

node scripts/swap-package-json-to-links.js ./ApollosApp

rm -rf tmp
