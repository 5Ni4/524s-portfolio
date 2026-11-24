#!/bin/sh
# Check source identity only. This script never deploys or changes settings.
# The caller must obtain the candidate ref from the build provider and
# read the current main SHA from the canonical repository before calling this.
set -eu

if [ "$#" -ne 3 ]; then
    printf 'Usage: %s BUILD_REF CHECKOUT_SHA CURRENT_MAIN_SHA\n' "$0" >&2
    exit 2
fi

case "$1" in
    refs/heads/main) ;;
    *) printf 'Ref rejected: expected refs/heads/main; got %s\n' "$1" >&2; exit 1 ;;
esac

is_full_sha() {
    [ "${#1}" -eq 40 ] || return 1
    case "$1" in
        *[!0123456789abcdef]*) return 1 ;;
    esac
}

if ! is_full_sha "$2" || ! is_full_sha "$3"; then
    printf 'Source rejected: full lowercase Git SHA required for checkout and current main.\n' >&2
    exit 1
fi

if [ "$2" != "$3" ]; then
    printf 'Source rejected: checkout %s is not current main %s.\n' "$2" "$3" >&2
    exit 1
fi

printf 'Source eligible: %s at %s (no deployment).\n' "$1" "$2"
