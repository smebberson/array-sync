# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

require "json"

# Load in external config
config_file = "#{File.dirname(__FILE__)}/config.json"
vm_ext_conf = JSON.parse(File.read(config_file))

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "phusion/ubuntu-14.04-amd64"

  # VM configuration for vmware_fusion
  config.vm.provider "vmware_fusion" do |v|
      v.vmx["memsize"] = vm_ext_conf["memory"]
      v.vmx["numvcpus"] = vm_ext_conf["cpus"]
  end

  # VM configuration for virtualbox
  config.vm.provider "virtualbox" do |vb|
      vb.memory = vm_ext_conf["memory"]
      vb.cpu = vm_ext_conf["cpus"]
  end

  # define the hostname
  config.vm.hostname = vm_ext_conf["hostname"]

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: vm_ext_conf["ip"]

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # If true, then any SSH connections made will enable agent forwarding.
  config.ssh.forward_agent = true

  # Share the folder between host and VM
  config.vm.synced_folder ".", "/vagrant"
  # config.vm.synced_folder ".", "/vagrant", type: 'nfs'

  # Provision with shell, nice and simple :)
  # configuration step 0: provisioner
  config.vm.provision "shell", path: "vagrant/provisioner.sh"

  # configuration step 1: apt-get
  config.vm.provision "shell", path: "vagrant/apt-get.sh"

  # configuration step 2: git
  config.vm.provision "shell", path: "vagrant/git.sh"

  # configuration step 3: nodejs
  config.vm.provision "shell", path: "vagrant/nodejs.sh"

  # configuration step 4: env
  config.vm.provision "shell", path: "vagrant/env.sh"

  # configuration step 5: setup
  config.vm.provision "shell", path: "vagrant/setup.sh"

  # configuration step 6: clean (remove unccessary data and GBs)
  config.vm.provision "shell", path: "vagrant/clean.sh"

end
