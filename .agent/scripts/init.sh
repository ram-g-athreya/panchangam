#!/usr/bin/env bash

set -euo pipefail

UTILS_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "${UTILS_SCRIPT_DIR}/utils.sh" ]; then
    source "${UTILS_SCRIPT_DIR}/utils.sh"
else
    echo "Fatal Error: utils.sh not found at ${UTILS_SCRIPT_DIR}/utils.sh" >&2
    exit 1
fi

# Replace these commands with the correct commands for your repository.
INSTALL_CMD=(npm install)
VERIFY_CMD=(npm run check)
START_CMD=(npm run dev-agent)

log_info "==> Working directory: $PWD"
log_info "==> Syncing dependencies"
"${INSTALL_CMD[@]}"

log_info "==> Running baseline verification"
"${VERIFY_CMD[@]}"

log_info "==> Startup command"
printf '    %q' "${START_CMD[@]}"
printf '\n'

if [ "${RUN_START_COMMAND:-0}" = "1" ]; then
  log_info "==> Starting the app"
  exec "${START_CMD[@]}"
fi

log_info "Set RUN_START_COMMAND=1 if you want init.sh to launch the app directly."
