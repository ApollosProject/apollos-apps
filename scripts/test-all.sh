set -e
find ./packages -maxdepth 1 -type d \( ! -name packages \) -print0 | xargs -I '{}' -n 1 -0  sh -c 'cd {} && echo $(pwd) && yarn test --maxWorkers=2 || exit 255'