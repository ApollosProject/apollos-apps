PING_SERVER="curl 'http://localhost:4000/graphql' -H 'content-type: application/json' -H 'accept: application/json' --data-binary '{\"query\":\"{_placeholder}\"}'"

eval $PING_SERVER
if [ 0 -eq $? ]; then
  echo 'Server running, downloading schema from localhost:4000'
  ./node_modules/.bin/get-graphql-schema http://localhost:4000 > local.graphql
  echo 'Done. Check local.graphql'
else
  echo 'Server not running, starting server'
  npm run start > /tmp/server-log.txt &
  SERVER_PID=$!
  sleep 1
  until eval $PING_SERVER; do
      sleep 1
      echo 'Waiting for server to boot....'
  done
  echo 'Curling Server for most recent schema.'
  ./node_modules/.bin/get-graphql-schema http://localhost:4000 > local.graphql
  echo 'Done. Check local.graphql'
  echo "Killling Server (PID $SERVER_PID)"
  kill -9 $SERVER_PID
fi;