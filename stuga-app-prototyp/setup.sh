#!/bin/bash

echo "🏘 Stuga Demo App - Quick Setup"
echo "================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Install Expo Go on your phone:"
    echo "   iOS: https://apps.apple.com/app/expo-go/id982107779"
    echo "   Android: https://play.google.com/store/apps/details?id=host.exp.exponent"
    echo ""
    echo "2. Run the app:"
    echo "   npm start"
    echo ""
    echo "3. Scan the QR code with:"
    echo "   - iOS: Camera app"
    echo "   - Android: Expo Go app"
    echo ""
else
    echo "❌ Installation failed"
    echo "   Try: rm -rf node_modules && npm install"
fi
