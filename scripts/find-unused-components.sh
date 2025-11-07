#!/bin/bash

# 1. Get a list of all component files
components=$(fd . src/components --type f --extension tsx | sed 's/src\/components\///' | sed 's/\.tsx//')

# 2. For each component, search for its usage in the project
for component in $components
do
  # Ignore the component's own file
  if ! rg -q $component src --glob "!*${component}.tsx"
  then
    echo "Unused component: $component"
  fi
done