#!/bin/zsh

trap killall SIGINT

killall(){
  echo " stopping server and frontend"
  kill 0
}

./run_server.sh &
npm run start-frontend &
wait

