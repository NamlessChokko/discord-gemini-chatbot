#!/bin/bash


# Paths
TARGET='dist/index.js'
EXTRAS='dist/deploy-commands.js'

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color


echo -e "${YELLOW}Running type check...${NC}"
tsc --noEmit

# Check if type check was successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Type check failed. Please fix the errors above.${NC}" >&2
  exit 1
fi

echo -e "${YELLOW}Type check successful. Compiling with SWC...${NC}"
npx swc src -d dist --strip-leading-paths

# Check if compilation was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Build successful, starting the bot...${NC}"
  node $EXTRAS
  clear
  node $TARGET
else
  echo -e "${RED}Build failed. Please check the errors above.${NC}" >&2
  exit 1
fi
