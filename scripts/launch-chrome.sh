#!/bin/bash

# Function to launch Chrome with remote debugging
launch_chrome() {
  local debug_port=9222
  local temp_dir=$(mktemp -d)

  case "$OSTYPE" in
    linux-gnu*) 
      echo "Detected Linux OS"
      google-chrome --remote-debugging-port=$debug_port ;;
    darwin*) 
      echo "Detected macOS"
      /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d) --headless --remote-debugging-port=$debug_port ;;
    cygwin*|msys*|win32*) 
      echo "Detected Windows OS"
      start chrome --remote-debugging-port=$debug_port ;;
    *) 
      echo "Unsupported OS: $OSTYPE"
      exit 1 ;;
  esac
}

# Call the function
launch_chrome