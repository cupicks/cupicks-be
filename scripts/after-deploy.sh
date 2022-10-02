#!/bin/bash
REPOSITORY=/home/ubuntu/project

cd $REPOSITORY

sudo npm ci

# sudo pm2 kill
# sudo rm -r dist

sudo npm run start