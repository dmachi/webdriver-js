#!/bin/sh

# set the NODULES_PATH where downloaded modules are stored first
#export NODULES_PATH=~/.nodules_downloads
#export NODULES=~/src/nodules/lib/nodules.js

node $NODULES lib/tests.js

# I also like to include --debug in the arguments for automatically running with listening for a debugger enabled.
