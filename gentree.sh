#!/bin/bash

find . -not -path "*/\.git/*" -not -path "*/node_modules/*" -not -path "*/\.next/*" | sed -e 's;[^/]*/;|;g' -e 's;|; |;g' > tree.txt