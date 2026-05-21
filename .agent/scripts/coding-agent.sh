#!/usr/bin/env bash

set -euo pipefail

UTILS_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "${UTILS_SCRIPT_DIR}/utils.sh" ]; then
    source "${UTILS_SCRIPT_DIR}/utils.sh"
else
    echo "Fatal Error: utils.sh not found at ${UTILS_SCRIPT_DIR}/utils.sh" >&2
    exit 1
fi

log_info "Started Coding Agent..."
claude --model sonnet

log_info "Stopping Coding Agent..."
sleep 0.25
if [ -n "${TMUX:-}" ]; then
    tmux kill-session
fi
exit 0