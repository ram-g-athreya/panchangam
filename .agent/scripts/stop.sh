#!/usr/bin/env bash

set -euo pipefail

CODING_SESSION_NAME="panchangam_coding_agent"
CODE_REVIEW_SESSION_NAME="panchangam_code_review_agent"


UTILS_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "${UTILS_SCRIPT_DIR}/utils.sh" ]; then
    source "${UTILS_SCRIPT_DIR}/utils.sh"
else
    echo "Fatal Error: utils.sh not found at ${UTILS_SCRIPT_DIR}/utils.sh" >&2
    exit 1
fi

is_session_dead() {
    local session_name="$1"
    if ! tmux has-session -t "$session_name" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

log_info "Stopping Coding and Review Agents..."
tmux send-keys -t $CODING_SESSION_NAME "exit 0" C-m || true
tmux send-keys -t $CODE_REVIEW_SESSION_NAME "exit 0" || true
sleep 0.25
tmux kill-session -t $CODING_SESSION_NAME 2>/dev/null || true
tmux kill-session -t $CODE_REVIEW_SESSION_NAME 2>/dev/null || true

while true; do
    coding_dead=false
    review_dead=false
    
    if is_session_dead "$CODING_SESSION_NAME"; then
        coding_dead=true
        log_info "Coding Agent session has stopped..."
    fi
    
    if is_session_dead "$CODE_REVIEW_SESSION_NAME"; then
        review_dead=true
        log_info "Review Agent session has stopped..."
    fi
    
    if $coding_dead && $review_dead; then
        break
    fi
    
    sleep 1
done

osascript -e 'tell application "iTerm2"
    tell current tab of current window
        set activeID to id of current session
        set allSessions to every session
        repeat with i from (count of allSessions) to 1 by -1
            set aSession to item i of allSessions
            if id of aSession is not activeID then
                close aSession
            end if
        end repeat
    end tell
end tell'

sleep 0.25
log_info "Harness stopped successfully..."
