#!/usr/bin/env bash

if [ ! -e /etc/vagrant/apt-get ]
then

	echo ">>> setting up apt-get"

	# Required for add-apt-repository
	apt-get install -y software-properties-common build-essential

	# Required for latest git
	add-apt-repository ppa:git-core/ppa

	# Node.js v5
	curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -

	# update apt-get
	apt-get update

	# only run once
	touch /etc/vagrant/apt-get

else

	echo ">>> apt-get is already setup..."

fi
