#!/usr/bin/env bash
# og-audit.sh — run against the built output directory
fail=0
grep -rn 'og:image" content="data:' dist/ && fail=1
grep -rEn 'og:image:(width|height)" content="[^"]*[^0-9"]' dist/ && fail=1
grep -rin '\bconcierge\b\|\bprivate viewing\b\|\bprivate appointment\b' dist/ | grep -v 'concierge-bell' && fail=1
exit $fail
