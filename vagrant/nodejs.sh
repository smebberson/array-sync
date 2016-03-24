#!/usr/bin/env bash

if [ ! -e /etc/vagrant/nodejs ]
then

	echo ">>> setting up nodejs"

	# install nodejs
	apt-get install -y nodejs

	# enable either node or nodejs at the command line
	# enable node binary
	if [ ! -e /usr/bin/node ]; then
		ln -s /usr/bin/nodejs /usr/bin/node
	fi

	# install npm
	apt-get install -y npm

	# update npm
	sudo npm install npm -g

	# only run once
	touch /etc/vagrant/nodejs

else

	echo ">>> nodejs already setup..."

fi
