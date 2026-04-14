#!/usr/bin/env python3
"""
Gumroad Webhook Handler Example

This script demonstrates how to receive and process Gumroad webhooks.
It includes signature verification, sale processing, and error handling.

REQUIREMENTS:
- GUMROAD_ACCESS_TOKEN environment variable must be set
- Optional: GUMROAD_WEBHOOK_SECRET for signature verification

Install dependencies:
    pip install flask requests

Run:
    python webhook-handler.py
"""

from flask import Flask, request, jsonify
import os
import requests
import hmac
import hashlib
import sys

app = Flask(__name__)

# Read configuration from environment variables
GUMROAD_ACCESS_TOKEN = os.environ.get('GUMROAD_ACCESS_TOKEN')
GUMROAD_WEBHOOK_SECRET = os.environ.get('GUMROAD_WEBHOOK_SECRET')  # Optional

# Validate required environment variables
if not GUMROAD_ACCESS_TOKEN:
    print("ERROR: GUMROAD_ACCESS_TOKEN environment variable not set!", file=sys.stderr)
    print("This is required for verifying webhook authenticity.", file=sys.stderr)
    sys.exit(1)

@app.route('/webhook/gumroad', methods=['POST'])
def gumroad_webhook():
    """
    Handle incoming Gumroad webhooks.

    Webhook types:
    - sale: New purchase
    - refund: Purchase refunded
    - cancellation: Subscription cancelled
    - subscription_ended: Subscription expired
    - subscription_restarted: Subscription reactivated
    - dispute: Chargeback initiated
    - dispute_won: Chargeback won
    """

    # Get webhook data
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Optional: Verify webhook signature
    # if GUMROAD_WEBHOOK_SECRET:
    #     if not verify_webhook_signature(request):
    #         return jsonify({'error': 'Invalid signature'}), 401

    # Verify the sale with Gumroad API (recommended for security)
    sale_id = data.get('sale_id')
    if sale_id and GUMROAD_ACCESS_TOKEN:
        verified_sale = verify_sale(sale_id)
        if not verified_sale:
            return jsonify({'error': 'Could not verify sale'}), 400

    # Process based on webhook type
    # Determine type by checking which fields are present
    if data.get('refunded'):
        process_refund(data)
    elif data.get('subscription_id') and data.get('cancelled_at'):
        process_cancellation(data)
    else:
        process_sale(data)

    return jsonify({'success': True}), 200


def verify_sale(sale_id):
    """
    Verify a sale by fetching it from the Gumroad API.
    This prevents fraudulent webhook calls.
    """
    headers = {
        'Authorization': f'Bearer {GUMROAD_ACCESS_TOKEN}'
    }

    response = requests.get(
        f'https://api.gumroad.com/v2/sales/{sale_id}',
        headers=headers
    )

    data = response.json()

    if data.get('success'):
        return data.get('sale')

    return None


def process_sale(data):
    """
    Process a new sale.

    Common actions:
    - Send welcome email
    - Grant access to content
    - Add to mailing list
    - Provision license
    """
    email = data.get('email') or data.get('purchase_email')
    product_name = data.get('product_name')
    license_key = data.get('license_key')
    sale_id = data.get('sale_id')

    print(f"New sale: {product_name}")
    print(f"Customer: {email}")
    print(f"License: {license_key}")
    print(f"Sale ID: {sale_id}")

    # Example: Grant access to your service
    # grant_access(email, license_key)

    # Example: Send to your database
    # save_sale_to_database(data)

    # Example: Add to email list
    # add_to_email_list(email, product_name)


def process_refund(data):
    """
    Process a refund.

    Common actions:
    - Revoke access
    - Remove from mailing list
    - Disable license
    """
    email = data.get('email') or data.get('purchase_email')
    product_name = data.get('product_name')
    license_key = data.get('license_key')

    print(f"Refund: {product_name}")
    print(f"Customer: {email}")
    print(f"License: {license_key}")

    # Example: Revoke access
    # revoke_access(email, license_key)


def process_cancellation(data):
    """
    Process a subscription cancellation.

    Common actions:
    - Schedule access removal at period end
    - Send cancellation email
    - Update subscription status
    """
    email = data.get('email') or data.get('purchase_email')
    subscription_id = data.get('subscription_id')

    print(f"Subscription cancelled: {subscription_id}")
    print(f"Customer: {email}")

    # Example: Schedule access removal
    # schedule_access_removal(email, data.get('subscription_ended_at'))


def verify_webhook_signature(request):
    """
    Optional: Verify webhook signature if you've implemented signing.
    This is an additional security measure beyond API verification.
    Requires GUMROAD_WEBHOOK_SECRET environment variable.
    """
    if not GUMROAD_WEBHOOK_SECRET:
        return False

    signature = request.headers.get('X-Gumroad-Signature')

    if not signature:
        return False

    # Create signature from payload
    payload = request.get_data()
    expected_signature = hmac.new(
        GUMROAD_WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(signature, expected_signature)


if __name__ == '__main__':
    # For development only - use proper WSGI server in production
    app.run(host='0.0.0.0', port=5000, debug=True)
