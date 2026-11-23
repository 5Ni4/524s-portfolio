#!/bin/sh
set -eu
cd "$(dirname "$0")/.."

# Build into a new directory so files from an older deployment cannot linger.
next=$(mktemp -d ./dist.build.XXXXXX)
trap 'rm -rf "$next"' EXIT HUP INT TERM
cp index.html styles.css cursor-dots.js design-toggle.js instagram-gallery.js \
  project-badge-hover.js speakerdeck-carousel.js "$next/"
cp -R assets LICENSES "$next/"
if [ -e dist ]; then
  backup=$(mktemp -d ./dist.old.XXXXXX)
  mv dist "$backup/"
  if ! mv "$next" dist; then mv "$backup/dist" dist; rmdir "$backup"; exit 1; fi
  rm -rf "$backup"
else
  mv "$next" dist
fi
