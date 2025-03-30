#!/bin/bash

# Check if a title was provided
if [ -z "$1" ]; then
    echo "Usage: ./new-post.sh \"Your Post Title\""
    exit 1
fi

# Format the date and title
YEAR=$(date +%Y)
MONTH=$(date +%m)
DAY=$(date +%d)
FULL_DATE=$(date +%Y-%m-%d)
TITLE=$1
FILENAME="_posts/$FULL_DATE-$(echo $TITLE | tr '[:upper:]' '[:lower:]' | tr ' ' '-').md"
IMAGE_DIR="assets/images/blog-posts/$FULL_DATE"

# Create image directory if it doesn't exist
if [ ! -d "$IMAGE_DIR" ]; then
    mkdir -p "$IMAGE_DIR"
    echo "Created image directory at $IMAGE_DIR"
else
    echo "Image directory already exists at $IMAGE_DIR"
fi

# Create the post with front matter
cat > "$FILENAME" << EOF
---
layout: post
title: "$TITLE"
date: $(date +"%Y-%m-%d %H:%M:%S %z")
categories: Satir
author: Darren Lai
excerpt: To be added
cover-photo:
cover-photo-alt:
---

EOF

echo "Created new post at $FILENAME"