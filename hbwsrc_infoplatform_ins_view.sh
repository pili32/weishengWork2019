#!/bin/sh

version=$1
tag=$2
echo $version
echo $tag
APPNAME=hbwsrc_infoplatform_ins_view_$version
echo "========stop========"
echo $APPNAME
docker ps -a | grep "$APPNAME" | awk '{print $1 }'|xargs docker stop
docker ps -a | grep "$APPNAME" | awk '{print $1 }'|xargs docker rm -f
docker images| grep "$APPNAME" | awk '{print $3 }'|xargs docker rmi
echo "========start========"
docker run -d -p 9013:80 --name=$APPNAME 119.96.188.213:5672/$APPNAME:$tag