// Where am I - Background Script

// Get IP address and country information
async function getIPInfo() {
  try {
    // Use ipapi.co free API to get IP information
    const response = await fetch('https://ipapi.co/json/');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.reason || 'API error');
    }
    
    // Validate essential data
    if (!data.ip) {
      throw new Error('No IP data received');
    }
    
    return {
      ip: data.ip,
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || null,
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      isPartialData: !data.country_code || !data.country_name
    };
  } catch (error) {
    return null;
  }
}

// Update extension icon with country flag
async function updateIconWithFlag(countryCode, isPartialData = false) {
  if (!countryCode) {
    // If no country code, use UN flag as fallback
    try {
      chrome.action.setIcon({
        path: {
          "16": "icons/flags/un.png",
          "48": "icons/flags/un.png",
          "128": "icons/flags/un.png"
        }
      });
      chrome.action.setBadgeText({ text: '?' });
      chrome.action.setBadgeBackgroundColor({ color: '#FF6B35' });
    } catch (error) {
      // If UN flag also fails, use default icon
      chrome.action.setIcon({
        path: {
          "16": "icons/icon-16.png",
          "48": "icons/icon-48.png",
          "128": "icons/icon-128.png"
        }
      });
      chrome.action.setBadgeText({ text: '?' });
      chrome.action.setBadgeBackgroundColor({ color: '#FF6B35' });
    }
    return;
  }

  try {
    // Set flag image directly as icon
    await chrome.action.setIcon({
      path: {
        "16": `icons/flags/${countryCode.toLowerCase()}.png`,
        "48": `icons/flags/${countryCode.toLowerCase()}.png`,
        "128": `icons/flags/${countryCode.toLowerCase()}.png`
      }
    });
    
    // Clear badge text for successful flag display
    chrome.action.setBadgeText({ text: '' });
    
    // Show warning if data is incomplete
    if (isPartialData) {
      chrome.action.setBadgeText({ text: '!' });
      chrome.action.setBadgeBackgroundColor({ color: '#FFA500' });
    }
    
  } catch (error) {
    // Fallback: use canvas rendering
    try {
      await updateIconWithCanvas(countryCode);
      if (isPartialData) {
        chrome.action.setBadgeText({ text: '!' });
        chrome.action.setBadgeBackgroundColor({ color: '#FFA500' });
      }
    } catch (canvasError) {
      // Last fallback: use UN flag with country code badge
      try {
        chrome.action.setIcon({
          path: {
            "16": "icons/flags/un.png",
            "48": "icons/flags/un.png", 
            "128": "icons/flags/un.png"
          }
        });
        chrome.action.setBadgeText({ text: countryCode });
        chrome.action.setBadgeBackgroundColor({ color: '#4285f4' });
      } catch (unError) {
        // Final fallback: default icon
        chrome.action.setIcon({
          path: {
            "16": "icons/icon-16.png",
            "48": "icons/icon-48.png", 
            "128": "icons/icon-128.png"
          }
        });
        chrome.action.setBadgeText({ text: countryCode });
        chrome.action.setBadgeBackgroundColor({ color: '#4285f4' });
      }
    }
  }
}

// Fallback Canvas rendering method
async function updateIconWithCanvas(countryCode) {
  return new Promise((resolve, reject) => {
    const flagUrl = chrome.runtime.getURL(`icons/flags/${countryCode.toLowerCase()}.png`);
    
    // Create image element
    const img = new Image();
    
    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');
        
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 48, 48);
        
        // Draw flag (centered, maintaining aspect ratio)
        const scale = Math.min(40/img.width, 30/img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (48 - width) / 2;
        const y = (48 - height) / 2;
        
        ctx.drawImage(img, x, y, width, height);
        
        // Convert to ImageData
        const imageData = ctx.getImageData(0, 0, 48, 48);
        
        // Update extension icon
        chrome.action.setIcon({ imageData: imageData });
        chrome.action.setBadgeText({ text: '' });
        
        resolve();
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Image loading failed'));
    };
    
    img.src = flagUrl;
  });
}

// Get and update IP information
async function updateIPInfo() {
  const ipInfo = await getIPInfo();
  
  if (ipInfo) {
    // Store IP information for popup use
    await chrome.storage.local.set({
      ipInfo: ipInfo,
      lastUpdate: Date.now(),
      errorState: null
    });
    
    // Update icon with partial data indicator
    await updateIconWithFlag(ipInfo.countryCode, ipInfo.isPartialData);
    
    // Update tooltip with internationalized text
    const tooltipTitle = chrome.i18n.getMessage('viewIPInfo') || 'Where am I - View your location';
    let tooltipText = `${tooltipTitle}\nIP: ${ipInfo.ip}`;
    
    if (ipInfo.country && ipInfo.country !== 'Unknown') {
      tooltipText += `\n${chrome.i18n.getMessage('appName') || 'Country'}: ${ipInfo.country}`;
    }
    
    if (ipInfo.isPartialData) {
      tooltipText += '\n⚠️ Partial location data';
    }
    
    chrome.action.setTitle({ title: tooltipText });
  } else {
    // Store error state for popup
    await chrome.storage.local.set({
      errorState: 'network_error',
      lastUpdate: Date.now()
    });
    
    // If failed, show error state with UN flag
    try {
      chrome.action.setIcon({
        path: {
          "16": "icons/flags/un.png",
          "48": "icons/flags/un.png",
          "128": "icons/flags/un.png"
        }
      });
    } catch (error) {
      // Fallback to default icon if UN flag fails
      chrome.action.setIcon({
        path: {
          "16": "icons/icon-16.png",
          "48": "icons/icon-48.png",
          "128": "icons/icon-128.png"
        }
      });
    }
    chrome.action.setBadgeText({ text: '!' });
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    chrome.action.setTitle({
      title: `${chrome.i18n.getMessage('appName') || 'Where am I'}\n❌ Unable to get location data`
    });
  }
}

// Execute when extension starts
chrome.runtime.onStartup.addListener(() => {
  updateIPInfo();
});

// Execute when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  updateIPInfo();
});

// Try to update when extension icon is clicked (if data is stale)
chrome.action.onClicked.addListener(async () => {
  const result = await chrome.storage.local.get(['lastUpdate']);
  const lastUpdate = result.lastUpdate || 0;
  const now = Date.now();
  
  // If not updated for more than 5 minutes, refresh
  if (now - lastUpdate > 5 * 60 * 1000) {
    updateIPInfo();
  }
});

// Periodic IP information update (every 30 minutes)
chrome.alarms.create('updateIP', { 
  delayInMinutes: 30, 
  periodInMinutes: 30 
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateIP') {
    updateIPInfo();
  }
});

// Manual refresh functionality
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'refreshIP') {
    updateIPInfo().then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Initialize icon immediately on startup using cached data
(async function initializeIcon() {
  try {
    const result = await chrome.storage.local.get(['ipInfo']);
    if (result.ipInfo && result.ipInfo.countryCode) {
      await updateIconWithFlag(result.ipInfo.countryCode);
    }
  } catch (error) {
    // Silent fail
  }
})();
