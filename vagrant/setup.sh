#!/usr/bin/env bash

if [ ! -e /etc/vagrant/setup ]
then

	echo ">>> setting up virtual machine"

	# alias the test-coverage script
	if [ ! -e /usr/local/bin/test-coverage ]; then
		ln -s /vagrant/vagrant/scripts/test-coverage /usr/local/bin/test-coverage
	fi

	# alias the test-travis script
	if [ ! -e /usr/local/bin/test-travis ]; then
		ln -s /vagrant/vagrant/scripts/test-travis /usr/local/bin/test-travis
	fi

	echo ">>> virtual machine has been setup and is ready to go'"

	touch /etc/vagrant/setup

else

	echo ">>> virtual machine has already been setup"

fi
