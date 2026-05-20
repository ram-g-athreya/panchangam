#!/usr/bin/env bash

set -euo pipefail

UTILS_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "${UTILS_SCRIPT_DIR}/utils.sh" ]; then
    source "${UTILS_SCRIPT_DIR}/utils.sh"
else
    echo "Fatal Error: utils.sh not found at ${UTILS_SCRIPT_DIR}/utils.sh" >&2
    exit 1
fi

log_info "Started Review Agent..."
while true; do
    if [[ -f "/tmp/panchangam_stop_review_session" ]]; then
        log_info "Stop session initiated. Gracefully exiting review agent loop..."        
        break
    fi

    if has_not_started_task .agent/task_list.yaml; then
        log_info "Found tasks that have not started. Waiting for them to be ready for review..."        
        sleep 5
    elif has_in_progress_task .agent/task_list.yaml; then
        log_info "Found tasks that are in progress. Waiting for them to be ready for review..."        
        sleep 5
    elif has_ready_for_review_task .agent/task_list.yaml; then
        log_info "Found tasks that are ready for review. Triggering Claude Code to review them..."
        claude -p "you are a code reviewer. You will review the task submitted for review in @\".agent/task_list.yaml\" based on @\".agent/AGENTS-REVIEW.md\""
    elif has_changes_requested_task .agent/task_list.yaml; then
        log_info "Found tasks with requested changes. Waiting for them to be addressed..."
        sleep 5
    elif has_approved_task .agent/task_list.yaml; then
        log_info "Found approved tasks. Moving on..." 
        sleep 5
    else
        log_info "No active tasks found..."
        sleep 5
    fi
done

log_info "Stopping Review Agent..."
sleep 0.25
if [ -n "${TMUX:-}" ]; then
    tmux kill-session
fi
exit 0