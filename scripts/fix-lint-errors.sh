#!/bin/bash

for FILE in "$@"
do
  sed -i '' "s/'/&apos;/g" "$FILE"
  sed -i '' 's/"/&quot;/g' "$FILE"
done
