#!/usr/bin/env bash

set -euo pipefail

# --- Color Constants for Logging ---
# Using printf/echo with these makes terminal output much easier to read
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0;3m' # No Color

# --- Helper Functions ---

# Log an informational message (Green)
log_info() {
    printf "${GREEN}[INFO] [%s] %b${NC}\n" "$(date +'%Y-%m-%d %H:%M:%S')" "$1"
}

# Log a warning message (Yellow)
log_warn() {
    printf "${YELLOW}[WARN] [%s] %b${NC}\n" "$(date +'%Y-%m-%d %H:%M:%S')" "$1"
}

# Log an error message (Red)
log_error() {
    printf "${RED}[ERROR] [%s] %b${NC}\n" "$(date +'%Y-%m-%d %H:%M:%S')" "$1"
}

# Check if a specific command/program is installed
# Usage: if check_cmd "git"; then ...
check_cmd() {
    if ! command -v "$1" &> /dev/null; then
        log_error "Required command '$1' is not installed."
        return 1
    fi
    return 0
}

_check_task_status() {
    local target_path="${1:-task_list.yaml}"
    local target_status="$2"
    
    if [ ! -f "$target_path" ]; then
        echo "Error: File not found at target path: '$target_path'" >&2
        return 1
    fi

    # Pass the target status directly into awk as a variable
    awk -v target="$target_status" '
    # 1. Turn ON the switch only when we hit the explicit tasks section
    /^tasks:/ { 
        in_tasks = 1 
        next 
    }
    
    # 2. Turn OFF the switch if we hit any other root level key
    /^[A-Za-z0-9_-]+:/ { 
        in_tasks = 0 
    }
    
    # 3. Only look at lines that match "status:" while inside the tasks section
    in_tasks && /^[[:space:]]+status:/ {
        # Extract the value, remove any quotes or spaces
        current_status = $2
        gsub(/[ \r"'\''[:space:]]/, "", current_status)
        
        # If it matches what we want, register a match and stop immediately
        if (current_status == target) {
            found = 1
            exit 0
        }
    }
    
    END {
        if (found == 1) exit 0
        exit 1
    }
    ' "$target_path"
}

has_not_started_task() {
    _check_task_status "${1:-task_list.yaml}" "not_started"
}

has_in_progress_task() {
    _check_task_status "${1:-task_list.yaml}" "in_progress"
}

has_ready_for_review_task() {
    _check_task_status "${1:-task_list.yaml}" "ready_for_review"
}

has_changes_requested_task() {
    _check_task_status "${1:-task_list.yaml}" "changes_requested"
}

has_approved_task() {
    _check_task_status "${1:-task_list.yaml}" "approved"
}