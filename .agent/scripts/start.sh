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

log_info "Waiting for Claude to start in the tmux sessions..."
while true; do
    tmux has-session -t "$CODING_SESSION_NAME" 2>/dev/null
    CODING_EXISTS=$?
    
    tmux has-session -t "$CODE_REVIEW_SESSION_NAME" 2>/dev/null
    REVIEW_EXISTS=$?

    if [ "$CODING_EXISTS" = 0 ] && [ "$REVIEW_EXISTS" = 0 ]; then
        log_info "Claude is running in both targeted tmux sessions"
        break
    fi
    
    sleep 2
done

log_info "Harness started successfully. Monitor progress in the coding and code review panes"

CURRENT_STATE=""
NOT_STARTED_PROMPT="You are a coding assistant. You will work on the new task specified in @\".agent/task_list.yaml\" based on @\".agent/AGENTS-CODING.md\""
READY_FOR_REVIEW_PROMPT="You are a code review assistant. Review the completed task specified in @\".agent/task_list.yaml\" based on @\".agent/AGENTS-CODE-REVIEW.md\" and provide feedback or approval."
CHANGES_REQUESTED_PROMPT="You are a coding assistant. Work on the feedback provided for the task specified in @\".agent/task_list.yaml\" based on @\".agent/AGENTS-CODING.md\""
APPROVED_PROMPT="You are a coding assistant. The task specified in @\".agent/task_list.yaml\" has been approved. Finalize the implementation and mark the task as done based on @\".agent/AGENTS-CODING.md\""

while true; do
    # 1. Detect what state the task list is currently in
    if has_not_started_task .agent/task_list.yaml; then
        DETECTED_STATE="not_started"
    elif has_in_progress_task .agent/task_list.yaml; then
        DETECTED_STATE="in_progress"
    elif has_ready_for_review_task .agent/task_list.yaml; then
        DETECTED_STATE="ready_for_review"
    elif has_under_review_task .agent/task_list.yaml; then
        DETECTED_STATE="under_review"
    elif has_changes_requested_task .agent/task_list.yaml; then
        DETECTED_STATE="changes_requested"
    elif has_approved_task .agent/task_list.yaml; then
        DETECTED_STATE="approved"
    elif has_done_task .agent/task_list.yaml; then
        DETECTED_STATE="done"
    else
        log_info "No active tasks found... Exiting harness loop."
        break
    fi

    # 2. Check if the state has changed since our last evaluation
    if [ "$DETECTED_STATE" != "$CURRENT_STATE" ]; then
        log_info "State transition detected: '$CURRENT_STATE' -> '$DETECTED_STATE'"
        
        # Update our tracker immediately before executing commands
        CURRENT_STATE="$DETECTED_STATE"

        # 3. Route the unique send-keys payload based on the fresh state
        case "$CURRENT_STATE" in
            "not_started")
                log_info "Triggering Coding Agent to start working on new tasks..."        
                tmux send-keys -t "$CODING_SESSION_NAME" "${NOT_STARTED_PROMPT}" Enter
                sleep 1.5
                tmux send-keys -t "$CODING_SESSION_NAME" C-m
                ;;
            
            "in_progress")
                log_info "Task is in progress. No state transition action needed..."
                ;;

            "ready_for_review")
                log_info "Tasks are ready for review. Triggering Review Agent..."        
                tmux send-keys -t "$CODE_REVIEW_SESSION_NAME" "${READY_FOR_REVIEW_PROMPT}" Enter
                sleep 1.5
                tmux send-keys -t "$CODE_REVIEW_SESSION_NAME" C-m
                ;;

            "under_review")
                log_info "Task is under review. No state transition action needed..."
                ;;
                
            "changes_requested")
                log_info "Feedback provided. Triggering Coding Agent to address changes..."
                tmux send-keys -t "$CODING_SESSION_NAME" "${CHANGES_REQUESTED_PROMPT}" Enter
                sleep 1.5
                tmux send-keys -t "$CODING_SESSION_NAME" C-m
                ;;
                
            "approved")
                log_info "Task approved! Triggering Coding Agent to finalize and mark as done..."
                tmux send-keys -t "$CODING_SESSION_NAME" "${APPROVED_PROMPT}" Enter
                sleep 1.5
                tmux send-keys -t "$CODING_SESSION_NAME" C-m
                ;;

            "done")
                log_info "Task is done. Exiting..."
                break
                ;;
        esac
    fi

    # 4. Breathe. Give Claude time to work and update the YAML before we poll again.
    sleep 5
done

log_info "All tasks are done. Stopping coding and review sessions..."
sleep 0.25
tmux send-keys -t $CODING_SESSION_NAME "exit 0" C-m 
tmux send-keys -t $CODE_REVIEW_SESSION_NAME "exit 0" C-m
sleep 0.25
tmux kill-session -t $CODING_SESSION_NAME
tmux kill-session -t $CODE_REVIEW_SESSION_NAME

osascript <<EOF
tell application "iTerm2"
    tell current window
        tell current session
            # 1. Get a reference to all split panes (sessions) in the current tab
            set allPanes to sessions of current tab
            
            # 2. Check if we have split panes to close
            # Your layout creates 3 panes total (Main, Top-Right, Bottom-Right)
            if (count of allPanes) ≥ 3 then
                
                # Close the bottom-right pane (the last pane created in the index)
                set bottomRightPane to item 3 of allPanes
                tell bottomRightPane to close
                
                delay 0.25
                
                # Close the top-right pane (now the 2nd pane in the remaining index)
                set topRightPane to item 2 of allPanes
                tell topRightPane to close
                
            else if (count of allPanes) is 2 then
                # Fallback: If one was already closed, just kill the remaining split
                set remainingSplit to item 2 of allPanes
                tell remainingSplit to close
            end if
        end tell
    end tell
end tell
EOF

log_info "Ending harness..."
