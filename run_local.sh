#!/usr/bin/env bash
set -euo pipefail

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8000}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 未安装，请先安装 Python 3。" >&2
  exit 1
fi

echo "启动中: http://${HOST}:${PORT}"
HOST="$HOST" PORT="$PORT" python3 serve.py
