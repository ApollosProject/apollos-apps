# if we have more than zero arguments
if [ $# -ne 0 ]; then
    # call yarn in ApollosApi and pass in the arguments
    cd ApollosCluster
    yarn "$@"
    exit
fi

tput setaf 1
echo "Please enter your Cluster .env password (typically stored in 1Password)"
tput sgr0

read SECRET

yarn

rm -rf ApollosCluster

mkdir -p ApollosCluster
mkdir -p tmp

cd tmp
git clone git@github.com:ApollosProject/apollos-cluster.git

cd apollos-cluster
git checkout ${BRANCH:-master}

yarn secrets -d "$SECRET"
cd ..

shopt -s dotglob
mv apollos-cluster/apollos-church-api/* ../ApollosCluster
cp apollos-cluster/yarn.lock ../ApollosCluster

cd ..

# node scripts/swap-package-json-to-links.js ./ApollosApi

# Needed.
# Otherwise there will be two different versions of GraphQL on the filesystem
# sed -i '' -e '/\"graphql\"/d' ./ApollosApi/package.json

rm -rf tmp

cd ApollosCluster

yarn

# Needed.
# Otherwise there will be two different versions of GraphQL on the filesystem
# it will find the one from apps
# not great because we're not actually testing with the proper version of gql
# to remove, test with this query: https://github.com/ApollosProject/apollos-apps/pull/2046
#rm -rf node_modules/graphql

yarn start:dev
