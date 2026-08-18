#!/bin/bash
# Bash script to organize all documentation files into docs folder
# Keeps only essential MD files in root (README.md, START_HERE.md)

echo "🗂️  Organizing documentation files..."

# Create docs directory if it doesn't exist
mkdir -p docs

# Files to keep in root
keep_files=("README.md" "START_HERE.md")

moved=0
skipped=0

# Function to check if file should be kept in root
should_keep() {
    local file="$1"
    for keep in "${keep_files[@]}"; do
        if [ "$file" = "$keep" ]; then
            return 0
        fi
    done
    return 1
}

# Move all MD files except the ones we want to keep
for file in *.md; do
    # Skip if no MD files found
    [ -e "$file" ] || continue
    
    # Check if we should keep this file
    if should_keep "$file"; then
        continue
    fi
    
    # Check if file already exists in docs
    if [ -f "docs/$file" ]; then
        echo "⏭️  Skipping $file (already exists in docs)"
        ((skipped++))
    else
        mv "$file" "docs/"
        echo "✅ Moved: $file"
        ((moved++))
    fi
done

echo ""
echo "📊 Summary:"
echo "   Moved: $moved files"
echo "   Skipped: $skipped files (already in docs)"
echo "   Kept in root: ${#keep_files[@]} files (README.md, START_HERE.md)"
echo ""
echo "✨ Root directory is now clean!"
