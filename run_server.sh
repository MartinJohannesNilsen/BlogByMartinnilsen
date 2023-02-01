#!/bin/zsh

# Pyenv
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv init --path)"

# Run
cd server
source .venv/bin/activate
python3 app.py
