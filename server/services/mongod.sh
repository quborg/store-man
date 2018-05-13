#!/bin/bash

dir=mongodb

[ -d $dir ] || mkdir $dir
mongod -dbpath $dir
