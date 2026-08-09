#!/usr/bin/env python3
import os
import sys
from datetime import datetime

# 1. Get title from terminal argument
title = sys.argv[1] if len(sys.argv) > 1 else "new-post"

# 2. Format filename and current date
slug = title.lower().replace(" ", "-")
today = datetime.now().strftime("%Y-%m-%d")

# 3. Define Astro frontmatter template
content = f"""---
title: "{title}"
published: {today}
description: ""
draft: true
tags: []
categories: []
---
"""

# 4. Save to your Astro content folder
folder = "src/content/blog"
os.makedirs(folder, exist_ok=True)

with open(f"{folder}/{slug}.md", "w") as f:
    f.write(content)

print(f"✅ Generated: {folder}/{slug}.md")

