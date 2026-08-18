#!/bin/bash

echo "🔧 Fixing utils imports in UI library..."
echo ""

UI_LIB_PATH="libs/frontend/ui/src/lib"
fixed_count=0

# Find all .tsx files and fix imports
find "$UI_LIB_PATH" -name "*.tsx" -type f | while read file; do
    # Check if file contains the wrong imports
    if grep -q "from ['\"]../../lib/utils['\"]" "$file" || grep -q "from ['\"]@/lib/utils['\"]" "$file"; then
        # Fix pattern 1: ../../lib/utils -> ./utils
        sed -i "s|from ['\"]../../lib/utils['\"]|from './utils'|g" "$file"
        
        # Fix pattern 2: @/lib/utils -> ./utils
        sed -i "s|from ['\"]@/lib/utils['\"]|from './utils'|g" "$file"
        
        echo "✅ Fixed: $(basename $file)"
        ((fixed_count++))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Fixed $fixed_count files!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Now try running:"
echo "  yarn dev:frontend"
echo ""
