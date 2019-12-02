#!/bin/sh

version=$1
tag=$2
echo $version
echo $tag
APPNAME=hbwsrc_infoplatform_ins_view_$version

docker images| grep "$APPNAME" | awk '{print $3 }'|xargs docker rmi

if [ $version == "dev" ]
then
    echo "========dev========"
    cd /var/jenkins_home/workspace/hbwsrc_infoplatform_ins_view_dev@2/
    pwd
    docker build -t 119.96.188.213:5672/$APPNAME:$tag .
    docker push 119.96.188.213:5672/$APPNAME:$tag
    param="""/data/bin/hbwsrc_infoplatform_ins_view.sh dev $tag"""
    echo $param
    ssh -t root@192.168.20.110 $param
else
    echo "========test========"
    cd /var/jenkins_home/workspace/hbwsrc_infoplatform_ins_view_prod@2/
    pwd
    docker build -t 119.96.188.213:5672/$APPNAME:$tag .
    docker push 119.96.188.213:5672/$APPNAME:$tag
    param="""/data/bin/hbwsrc_infoplatform_ins_view.sh test $tag"""
    echo $param
    ssh -t root@119.96.188.213 $param
fi