#!/bin/bash
REPOSITORY=/home/ubuntu/project

cd $REPOSITORY

sudo cp content/nginx/cupick.ddns.net /etc/nginx/sites-enabled/cupick.ddns.net
sudo service nginx reload

sudo npm install

# sudo pm2 kill
# sudo rm -r dist

sudo npm run start