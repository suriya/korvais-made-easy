#!/usr/bin/env bash

./generate-diff-summary.py > diff-summary.tex
tamiltrans -i diff-summary.tex -o diff-summary.ttex
rubber --pdf diff-summary.ttex
rm -f diff-summary.aux diff-summary.log diff-summary.tex diff-summary.ttex

./generate-diff-basic-table.py > diff-basic-table.tex
rubber --pdf diff-basic-table.tex
rm -f diff-basic-table.aux diff-basic-table.log diff-basic-table.tex
