#!/usr/bin/env bash
source venv/bin/activate;
export FLASK_APP=main.py;
while true;
    echo "Starting";
    do python -m flask run && break;
    echo "Restarting";
done;
