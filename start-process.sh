#!/bin/bash 
until node test.js; do
    echo "Server node.js crashed with exit code $?.  Respawning.." >&2
    sleep 1
done