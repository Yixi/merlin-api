#!/bin/sh
scp package.json pi@192.168.50.7:/home/pi/www/
scp yarn.lock pi@192.168.50.7:/home/pi/www/
scp -r src pi@192.168.50.7:/home/pi/www/
