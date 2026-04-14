#!/bin/bash
# Simple Gumroad API test script
#
# REQUIREMENTS:
# - GUMROAD_ACCESS_TOKEN environment variable must be set
#
# Get your token from: https://app.gumroad.com/settings/advanced
#
# Usage:
#    chmod +x simple-test.sh
#    ./simple-test.sh

set -e  # Exit on error

# Check if token is set
if [ -z "$GUMROAD_ACCESS_TOKEN" ]; then
    echo "ERROR: GUMROAD_ACCESS_TOKEN environment variable not set" >&2
    echo "" >&2
    echo "Get your token from: https://app.gumroad.com/settings/advanced" >&2
    echo "Then set the environment variable before running this script." >&2
    exit 1
fi

echo "Testing Gumroad API connection..."
echo ""

# Test authentication
echo "1. Testing authentication..."
response=$(curl -s -H "Authorization: Bearer $GUMROAD_ACCESS_TOKEN" \
    https://api.gumroad.com/v2/user)

# Check if successful
if echo "$response" | grep -q '"success":true'; then
    echo "✓ Authentication successful!"
    echo ""
    echo "User info:"
    echo "$response" | python3 -m json.tool || echo "$response"
else
    echo "✗ Authentication failed!"
    echo "$response"
    exit 1
fi

echo ""
echo "2. Fetching your products..."
products=$(curl -s -H "Authorization: Bearer $GUMROAD_ACCESS_TOKEN" \
    https://api.gumroad.com/v2/products)

if echo "$products" | grep -q '"success":true'; then
    echo "✓ Products retrieved successfully!"
    echo ""
    echo "$products" | python3 -m json.tool || echo "$products"
else
    echo "✗ Failed to retrieve products"
    echo "$products"
fi

echo ""
echo "All tests completed!"
