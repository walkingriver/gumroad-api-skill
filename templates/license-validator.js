/**
 * Gumroad License Validator
 *
 * Client-side license validation example.
 *
 * IMPORTANT: License verification does NOT require an API token!
 * This endpoint is designed to be called directly from client-side code.
 *
 * You DO need:
 * - Your product_id (from your Gumroad product settings)
 * - The customer's license key (they get this after purchase)
 *
 * USAGE:
 * 1. Replace 'YOUR_PRODUCT_ID' with your actual Gumroad product ID
 * 2. Include this script in your HTML
 * 3. Call verifyLicense(licenseKey, productId) when user enters their key
 */

/**
 * Verify a Gumroad license key
 *
 * @param {string} licenseKey - The license key to verify
 * @param {string} productId - Your Gumroad product ID
 * @param {boolean} incrementUses - Whether to increment use count (default: false for checks)
 * @returns {Promise<Object>} - Verification result
 */
async function verifyLicense(licenseKey, productId, incrementUses = false) {
  try {
    const formData = new URLSearchParams();
    formData.append('license_key', licenseKey);
    formData.append('product_id', productId);

    if (!incrementUses) {
      formData.append('increment_uses_count', 'false');
    }

    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      return {
        valid: true,
        purchase: data.purchase,
        uses: data.uses,
        message: 'License verified successfully'
      };
    } else {
      return {
        valid: false,
        message: data.message || 'License verification failed'
      };
    }

  } catch (error) {
    console.error('License verification error:', error);
    return {
      valid: false,
      message: 'Network error during verification'
    };
  }
}

/**
 * Check license and handle UI updates
 */
async function checkAndActivateLicense() {
  const licenseInput = document.getElementById('license-key');
  const statusDiv = document.getElementById('license-status');
  const productId = 'YOUR_PRODUCT_ID'; // Replace with your product ID

  const licenseKey = licenseInput.value.trim();

  if (!licenseKey) {
    showStatus('Please enter a license key', 'error');
    return;
  }

  showStatus('Verifying license...', 'info');

  // First check without incrementing (validation only)
  const checkResult = await verifyLicense(licenseKey, productId, false);

  if (!checkResult.valid) {
    showStatus(`Invalid license: ${checkResult.message}`, 'error');
    return;
  }

  // If valid, increment and activate
  const activateResult = await verifyLicense(licenseKey, productId, true);

  if (activateResult.valid) {
    const purchase = activateResult.purchase;

    showStatus('License activated successfully!', 'success');

    // Store license info
    localStorage.setItem('gumroad_license', licenseKey);
    localStorage.setItem('gumroad_email', purchase.email);

    // Show license details
    displayLicenseInfo(activateResult);

    // Grant access to your app
    grantAccess(purchase);
  } else {
    showStatus(`Activation failed: ${activateResult.message}`, 'error');
  }
}

/**
 * Display license information to user
 */
function displayLicenseInfo(result) {
  const infoDiv = document.getElementById('license-info');
  const { purchase, uses } = result;

  infoDiv.innerHTML = `
    <h3>License Details</h3>
    <p><strong>Product:</strong> ${purchase.product_name}</p>
    <p><strong>Email:</strong> ${purchase.email}</p>
    <p><strong>Purchase Date:</strong> ${new Date(purchase.created_at).toLocaleDateString()}</p>
    <p><strong>Activations:</strong> ${uses}</p>
    ${purchase.subscription_id ? '<p><strong>Type:</strong> Subscription</p>' : ''}
  `;

  infoDiv.style.display = 'block';
}

/**
 * Show status message
 */
function showStatus(message, type) {
  const statusDiv = document.getElementById('license-status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
}

/**
 * Grant access to your application
 */
function grantAccess(purchase) {
  // Implement your access granting logic here
  console.log('Granting access to:', purchase.email);

  // Example: Enable app features
  document.getElementById('premium-features').style.display = 'block';
  document.getElementById('license-prompt').style.display = 'none';
}

/**
 * Check for existing license on page load
 */
async function checkExistingLicense() {
  const storedLicense = localStorage.getItem('gumroad_license');

  if (storedLicense) {
    const productId = 'YOUR_PRODUCT_ID';
    const result = await verifyLicense(storedLicense, productId, false);

    if (result.valid) {
      // License still valid
      displayLicenseInfo(result);
      grantAccess(result.purchase);
    } else {
      // License no longer valid (refunded, disabled, etc.)
      localStorage.removeItem('gumroad_license');
      localStorage.removeItem('gumroad_email');
      showStatus('Your license is no longer valid. Please contact support.', 'error');
    }
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', checkExistingLicense);

// Example HTML structure:
/*
<div id="license-prompt">
  <h2>Activate Your License</h2>
  <input type="text" id="license-key" placeholder="Enter your license key">
  <button onclick="checkAndActivateLicense()">Activate</button>
  <div id="license-status"></div>
</div>

<div id="license-info" style="display:none;"></div>

<div id="premium-features" style="display:none;">
  <!-- Your app content here -->
</div>

<style>
.status {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
}
.status.success { background: #d4edda; color: #155724; }
.status.error { background: #f8d7da; color: #721c24; }
.status.info { background: #d1ecf1; color: #0c5460; }
</style>
*/
