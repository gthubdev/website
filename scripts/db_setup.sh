#!/bin/bash

populate(){
  sudo -u postgres psql -c "CREATE DATABASE gthubweb"
  sudo -u postgres psql -d gthubweb -a -f test_data.sql
}

set_up() {
  	apt update
	apt install postgresql postgresql-contrib -y
	service postgresql start
	populate
}


if [ "$EUID" -ne 0 ]
then
    echo "Please run with sudo."
else
    set_up
fi

