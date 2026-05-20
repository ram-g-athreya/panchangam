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

log_info "Starting coding and code review sessions with iTerm2 and tmux..."

# Pass Bash variables as arguments ($1 and $2) into the AppleScript
osascript - "$CODING_SESSION_NAME" "$CODE_REVIEW_SESSION_NAME" <<EOF
on run argv
    set codingSession to item 1 of argv
    set reviewSession to item 2 of argv
    set currentPwd to do shell script "pwd"

    tell application "iTerm2"
        tell current session of current window
            # 1. Create right-side column
            set topRightPane to (split vertically with default profile)
            
            tell topRightPane
                # 2. Create bottom half
                set bottomRightPane to (split horizontally with default profile)
                
                # 3. Use the codingSession variable
                write text "tmux new-session -A -s " & codingSession & " -c " & quoted form of currentPwd
                delay 0.5
                write text "./.agent/scripts/coding-agent.sh"
            end tell

            # 4. Use the reviewSession variable
            tell bottomRightPane
                write text "tmux new-session -A -s " & reviewSession & " -c " & quoted form of currentPwd
                delay 0.5
                write text "./.agent/scripts/review-agent.sh"
            end tell
        end tell
    end tell
end run
EOF

log_info "Harness started successfully. Monitor progress in the coding and code review panes in iTerm2."
