// Where am I - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
    // 初始化国际化
    initializeI18n();
    await loadIPInfo();
    setupEventListeners();
});

// 初始化国际化文本
function initializeI18n() {
    // 设置页面标题
    document.title = chrome.i18n.getMessage('appName');
    
    // 设置所有带有 data-i18n 属性的元素
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const message = chrome.i18n.getMessage(key);
        if (message) {
            element.textContent = message;
        }
    });
    
    // 设置所有带有 data-i18n-title 属性的元素
    const i18nTitleElements = document.querySelectorAll('[data-i18n-title]');
    i18nTitleElements.forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const message = chrome.i18n.getMessage(key);
        if (message) {
            element.title = message;
        }
    });
    
    // 设置所有带有 data-i18n-alt 属性的元素
    const i18nAltElements = document.querySelectorAll('[data-i18n-alt]');
    i18nAltElements.forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        const message = chrome.i18n.getMessage(key);
        if (message) {
            element.alt = message;
        }
    });
}

// 设置事件监听器
function setupEventListeners() {
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', handleRefresh);
}

// Load IP information
async function loadIPInfo() {
    try {
        // Get cached IP information from storage
        const result = await chrome.storage.local.get(['ipInfo', 'lastUpdate', 'errorState']);
        
        if (result.ipInfo) {
            displayIPInfo(result.ipInfo, result.lastUpdate);
        } else if (result.errorState) {
            showError(getErrorMessage(result.errorState));
        } else {
            // If no cached data, trigger background script to get data
            await requestIPRefresh();
        }
    } catch (error) {
        showError();
    }
}

// Get localized error message based on error type
function getErrorMessage(errorType) {
    switch (errorType) {
        case 'network_error':
            return chrome.i18n.getMessage('networkError') || 'Network connection failed. Please check your internet connection.';
        case 'api_error':
            return chrome.i18n.getMessage('apiError') || 'Location service temporarily unavailable. Please try again later.';
        default:
            return chrome.i18n.getMessage('errorMessage') || 'Unable to get location information.';
    }
}

// 显示IP信息
function displayIPInfo(ipInfo, lastUpdate) {
    hideLoading();
    hideError();
    
    const ipInfoElement = document.getElementById('ipInfo');
    const flagImage = document.getElementById('flagImage');
    const countryName = document.getElementById('countryName');
    const countryCode = document.getElementById('countryCode');
    const ipAddress = document.getElementById('ipAddress');
    const city = document.getElementById('city');
    const region = document.getElementById('region');
    const lastUpdateElement = document.getElementById('lastUpdate');
    
    // Clear any existing placeholders
    const existingPlaceholder = flagImage.parentNode.querySelector('.flag-placeholder');
    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }
    
    // Set flag image (using local resources)
    if (ipInfo.countryCode) {
        flagImage.src = chrome.runtime.getURL(`icons/flags/${ipInfo.countryCode.toLowerCase()}.png`);
        flagImage.alt = chrome.i18n.getMessage('countryFlag');
        flagImage.style.display = 'block';
        
        // Handle flag image loading errors
        flagImage.onerror = function() {
            this.style.display = 'none';
            // Try UN flag as fallback for missing country flags
            const fallbackImg = document.createElement('img');
            fallbackImg.src = chrome.runtime.getURL('icons/flags/un.png');
            fallbackImg.alt = 'Flag not available';
            fallbackImg.style.cssText = 'width: 40px; height: 30px; object-fit: cover; border-radius: 4px;';
            fallbackImg.onerror = function() {
                // Final fallback: show placeholder
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'flag-placeholder';
                placeholder.textContent = ipInfo.countryCode || '🌍';
                placeholder.style.cssText = 'width: 40px; height: 30px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 4px; font-size: 16px; font-weight: bold; color: #666;';
                this.parentNode.insertBefore(placeholder, this.nextSibling);
            };
            this.parentNode.insertBefore(fallbackImg, this.nextSibling);
        };
    } else {
        // Use UN flag for unknown countries
        flagImage.src = chrome.runtime.getURL('icons/flags/un.png');
        flagImage.alt = chrome.i18n.getMessage('unknownLocation') || 'Unknown Location';
        flagImage.style.display = 'block';
        
        // Handle UN flag loading error
        flagImage.onerror = function() {
            this.style.display = 'none';
            // Show unknown location indicator as final fallback
            const placeholder = document.createElement('div');
            placeholder.className = 'flag-placeholder';
            placeholder.textContent = '🌍';
            placeholder.style.cssText = 'width: 40px; height: 30px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 4px; font-size: 20px;';
            this.parentNode.insertBefore(placeholder, this.nextSibling);
        };
    }
    
    // Set country information with fallbacks
    const displayCountry = ipInfo.country && ipInfo.country !== 'Unknown' ? ipInfo.country : 
        (chrome.i18n.getMessage('unknownLocation') || 'Unknown Location');
    countryName.textContent = displayCountry;
    
    // Add warning indicator for partial data
    if (ipInfo.isPartialData) {
        const warningSpan = document.createElement('span');
        warningSpan.textContent = ' ⚠️';
        warningSpan.title = 'Partial location data available';
        warningSpan.style.color = '#FFA500';
        countryName.appendChild(warningSpan);
    }
    
    countryCode.textContent = ipInfo.countryCode || '-';
    
    // Set detailed information
    ipAddress.textContent = ipInfo.ip || '-';
    city.textContent = ipInfo.city || '-';
    region.textContent = ipInfo.region || '-';
    
    // Set update time
    if (lastUpdate) {
        const updateTime = new Date(lastUpdate);
        lastUpdateElement.textContent = formatTime(updateTime);
    } else {
        lastUpdateElement.textContent = '-';
    }
    
    ipInfoElement.style.display = 'block';
}

// 显示错误信息
function showError(message = null) {
    hideLoading();
    
    const errorElement = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const ipInfoElement = document.getElementById('ipInfo');
    
    // 如果没有提供自定义消息，使用默认的国际化消息
    if (message) {
        errorMessage.textContent = message;
    } else {
        errorMessage.textContent = chrome.i18n.getMessage('errorMessage');
    }
    
    errorElement.style.display = 'block';
    ipInfoElement.style.display = 'none';
}

// 隐藏加载状态
function hideLoading() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'none';
}

// 隐藏错误状态
function hideError() {
    const errorElement = document.getElementById('error');
    errorElement.style.display = 'none';
}

// 显示加载状态
function showLoading() {
    const loadingElement = document.getElementById('loading');
    const ipInfoElement = document.getElementById('ipInfo');
    const errorElement = document.getElementById('error');
    
    loadingElement.style.display = 'block';
    ipInfoElement.style.display = 'none';
    errorElement.style.display = 'none';
}

// 处理刷新按钮点击
async function handleRefresh() {
    const refreshBtn = document.getElementById('refreshBtn');
    const refreshIcon = refreshBtn.querySelector('.refresh-icon');
    
    // 设置按钮为加载状态
    refreshBtn.disabled = true;
    refreshBtn.classList.add('loading');
    refreshIcon.style.animation = 'spin 1s linear infinite';
    
    showLoading();
    
    try {
        await requestIPRefresh();
        
        // 等待一小段时间确保数据更新
        setTimeout(async () => {
            await loadIPInfo();
            
            // 恢复按钮状态
            refreshBtn.disabled = false;
            refreshBtn.classList.remove('loading');
            refreshIcon.style.animation = '';
        }, 1000);
        
    } catch (error) {
        showError(chrome.i18n.getMessage('refreshFailed'));
        
        // Restore button state
        refreshBtn.disabled = false;
        refreshBtn.classList.remove('loading');
        refreshIcon.style.animation = '';
    }
}

// 请求后台脚本刷新IP信息
function requestIPRefresh() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { action: 'refreshIP' },
            (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else if (response && response.success) {
                    resolve();
                } else {
                    reject(new Error('Refresh request failed'));
                }
            }
        );
    });
}

// 格式化时间显示
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // Less than 1 minute
        return chrome.i18n.getMessage('timeJustNow');
    } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        return chrome.i18n.getMessage('timeMinutesAgo', [minutes.toString()]);
    } else if (diff < 86400000) { // Less than 1 day
        const hours = Math.floor(diff / 3600000);
        return chrome.i18n.getMessage('timeHoursAgo', [hours.toString()]);
    } else {
        // Show specific time using browser language settings
        const locale = chrome.i18n.getUILanguage();
        return date.toLocaleString(locale, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Listen for storage changes and update display in real time
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.ipInfo) {
        const newIPInfo = changes.ipInfo.newValue;
        const lastUpdate = changes.lastUpdate?.newValue || Date.now();
        
        if (newIPInfo) {
            displayIPInfo(newIPInfo, lastUpdate);
        }
    }
});
