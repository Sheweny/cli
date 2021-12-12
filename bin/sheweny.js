#!/usr/bin/env  node

import("../lib/cli.js").then((i) => i.cli(process.argv));
