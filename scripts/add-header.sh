#!/bin/bash

HEADER="/*
 * This file is part of the Gemini Code UI project.
 * Copyright (c) 2023, Google Inc.
 * All rights reserved.
 */"

FILE=$1

if ! grep -q "Gemini Code UI" "$FILE"; then
  echo -e "$HEADER" | cat - "$FILE" > temp && mv temp "$FILE"
fi