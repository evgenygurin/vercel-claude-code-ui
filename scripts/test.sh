#!/bin/bash

npm run lint > lint-errors.txt 2>&1
npm run test