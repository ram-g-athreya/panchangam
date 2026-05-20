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
while true; do
    if [[ -f "/tmp/panchangam_stop_coding_session" ]]; then
        log_info "Stop session initiated. Gracefully exiting coding agent loop..."        
        break
    fi

    if has_not_started_task .agent/task_list.yaml; then
        log_info "Found tasks that have not started. Triggering Claude Code to start working on them..."
        claude "you are a coding assistant. You will work on the new task specified in @/.agent/task_list.yaml based on @/.agent/AGENTS-CODING.md"
    elif has_ready_for_review_task .agent/task_list.yaml; then
        log_info "Found tasks that are ready for review. Waiting for them to be approved..."
        sleep 5
    elif has_changes_requested_task .agent/task_list.yaml; then
        log_info "Found tasks with requested changes. Triggering Claude Code to start working on them..."
        claude "you are a coding assistant. Work on the feedback provided for the task specified in @/.agent/task_list.yaml based on @/.agent/AGENTS-CODING.md"
    elif has_approved_task .agent/task_list.yaml; then
        log_info "Found approved tasks. Triggering Claude Code to mark them as done..."
        claude "you are a coding assistant. Mark the approved task specified in @/.agent/task_list.yaml as done based on @/.agent/AGENTS-CODING.md"
    else
        log_info "No active tasks found..."
        sleep 5
    fi
done

log_info "Stopping Coding Agent..."
sleep 0.25
if [ -n "${TMUX:-}" ]; then
    tmux kill-session
fi
exit 0