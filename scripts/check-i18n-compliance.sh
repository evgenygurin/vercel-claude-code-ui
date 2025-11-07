#!/bin/bash

# 1. Get a list of all component files
components=$(fd . src/components --type f --extension tsx | sed 's/src\/components\///' | sed 's/\.tsx//')

# 2. Print the list of components that are not using i18n
echo "The following components are not using i18n:"
for component in $components
do
  echo "- $component"
done