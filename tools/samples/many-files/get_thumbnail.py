#!/usr/bin/python3

import os
import re
import sys

q = os.environ.get("QUERY_STRING", "No Query String in url")
file = re.compile('DIR=(.*)').search(q).group(1)
jpg_file = file[1:].replace("ORF", "JPG")

print("Content-Type: image/jpeg")
print("Content-Length: " + str(os.stat(jpg_file).st_size))
print("")

with open(jpg_file, 'rb') as f:
    sys.stdout.flush()
    sys.stdout.buffer.write(f.read())
