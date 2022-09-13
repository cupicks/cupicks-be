#!/bin/bash
REPOSITORY=/home/ubuntu/project

cd $REPOSITORY

sudo npm ci

sudo pm2 kill

sudo npm run start