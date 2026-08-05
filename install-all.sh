#!/bin/bash

echo "🚀 Installing all dependencies for Snake Rescue Platform..."
echo ""

# Install root dependencies
echo "📦 Step 1/4: Installing root dependencies..."
yarn install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi
echo "✅ Root dependencies installed"
echo ""

# Install UI library dependencies
echo "🎨 Step 2/4: Installing UI library dependencies..."
cd libs/frontend/ui
yarn install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install UI library dependencies"
    exit 1
fi
cd ../../../
echo "✅ UI library dependencies installed"
echo ""

# Install frontend app dependencies
echo "💻 Step 3/4: Installing frontend app dependencies..."
cd apps/frontend
yarn install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend app dependencies"
    exit 1
fi
cd ../../
echo "✅ Frontend app dependencies installed"
echo ""

# Build shared library
echo "🏗️  Step 4/4: Building shared library..."
yarn build:shared
if [ $? -ne 0 ]; then
    echo "❌ Failed to build shared library"
    exit 1
fi
echo "✅ Shared library built"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All dependencies installed successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 You can now run:"
echo ""
echo "   yarn dev:frontend    # Start frontend development server"
echo "   yarn dev:backend     # Start backend development server"
echo "   yarn dev             # Start both frontend & backend"
echo "   yarn build:all       # Build everything for production"
echo ""
echo "📚 Documentation:"
echo "   - FIX_DEPENDENCIES.md  # Dependency fixes details"
echo "   - QUICK_START.md       # Quick start guide"
echo "   - COMMANDS.md          # All available commands"
echo ""
