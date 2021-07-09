# if we have more than zero arguments
if [ $# -ne 0 ]; then
    # call yarn in ApollosApi and pass in the arguments
    cd ApollosApi
    yarn "$@"
    exit
fi

yarn

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
(cd ./apollos-church-api/ && npx @apollosproject/apollos-cli secrets -d "$SECRET")
mv ./apollos-church-api/.env.shared ./apollos-church-api/.env
cd ..

shopt -s dotglob
mv apollos-templates/apollos-church-api/* ../ApollosApi
cp apollos-templates/yarn.lock ../ApollosApi

cd ..

node scripts/swap-package-json-to-links.js ./ApollosApi

# Needed.
# Otherwise there will be two different versions of GraphQL on the filesystem
sed -i '' -e '/graphql/d' ./ApollosApi/package.json

rm -rf tmp

cd ApollosApi

yarn

# Needed.
# Otherwise there will be two different versions of GraphQL on the filesystem
# it will find the one from apps
# not great because we're not actually testing with the proper version of gql
# to remove, test with this query: https://github.com/ApollosProject/apollos-apps/pull/2046
rm -rf node_modules/graphql

yarn start:dev
