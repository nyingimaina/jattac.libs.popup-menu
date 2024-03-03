#!/bin/bash

read -p "Enter the new URL for fetching and pushing: " new_url

git remote set-url origin "$new_url"

git remote -v
