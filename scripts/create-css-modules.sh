#!/bin/bash

# Find all component files
components=$(fd . src/components --type f --extension tsx)

# For each component, create a corresponding .module.css file
for component in $components
do
  touch "${component%.tsx}.module.css"
done
