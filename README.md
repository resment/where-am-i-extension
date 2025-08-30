# Where am I 🌍

**A lightweight Chrome extension that instantly shows your IP location by displaying the corresponding country flag on the extension icon.**

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-blue)](https://chromewebstore.google.com/detail/where-am-i/pblkmgcemiedifjihjelpggkbhhimgom)
[![Version](https://img.shields.io/badge/version-1.0.1-green)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[🇨🇳 中文](README_CN.md) | 🇺🇸 English

## ✨ Features

- **🚩 Live Flag Display**: Extension icon automatically updates to show your current country flag
- **📍 Detailed Location Info**: View IP address, country, city, region, and last update time
- **🔄 Auto & Manual Refresh**: Updates every 30 minutes or refresh manually anytime
- **🌐 Bilingual Support**: Complete English and Simplified Chinese interface
- **🛡️ Privacy-Focused**: Only retrieves public IP geolocation data, no personal information collected
- **⚡ Lightning Fast**: Built-in flag resources for instant loading and offline functionality
- **🎨 Clean Design**: Modern, compact interface optimized for quick information access

## 🎯 Perfect For

- **Digital Nomads & Travelers** - Quickly verify your current location
- **VPN Users** - Confirm your VPN server location instantly
- **IT Professionals** - Monitor network locations and troubleshoot connectivity
- **Remote Workers** - Stay aware of your apparent geographic location
- **Privacy-Conscious Users** - Simple, transparent location awareness tool

## 🚀 Installation

### From Chrome Web Store (Recommended)
*Coming soon - currently in review process*

### Developer Installation
1. **Download**: Clone or download this repository
   ```bash
   git clone https://github.com/resment/where-am-i-extension.git
   ```

2. **Open Chrome Extensions**: Navigate to `chrome://extensions/`

3. **Enable Developer Mode**: Toggle the "Developer mode" switch in the top right

4. **Load Extension**: Click "Load unpacked" and select the project folder

## 📖 How to Use

### Quick View
- **Extension Icon**: Shows your current country flag in the browser toolbar
- **Hover Tooltip**: Displays basic IP and location information

### Detailed View
1. **Click the Flag Icon** in your browser toolbar
2. **View Complete Information**:
   - 🌐 IP Address
   - 🏳️ Country & Country Code  
   - 🏙️ City & Region
   - ⏰ Last Update Time

### Refresh Data
- **Auto Refresh**: Data updates automatically every 30 minutes
- **Manual Refresh**: Click the refresh icon (⟳) in the top-right corner of the popup

## 🔧 Advanced Features

### Error Handling
- **Unknown Location**: Displays UN flag 🇺🇳 when country cannot be determined
- **Network Issues**: Shows error message with clear troubleshooting guidance
- **Partial Data**: Warning indicators (⚠️) when location data is incomplete
- **Missing Flags**: Graceful fallback to UN flag or country code display

### Language Support
- **Auto-Detection**: Automatically adapts to your browser's language setting
- **Supported Languages**: English, Simplified Chinese
- **Easy Switching**: No configuration required - just change your browser language

## 🛠️ Technical Details

### Built With
- **Manifest V3**: Latest Chrome extension standard
- **Service Worker**: Efficient background processing
- **Vanilla JavaScript**: No external dependencies
- **CSS3**: Modern, responsive design
- **Chrome i18n API**: Native internationalization support

### Data Sources
- **IP Geolocation**: [ipapi.co](https://ipapi.co/) - Reliable IP location service
- **Flag Images**: [flagpedia.net](https://flagpedia.net/) - Comprehensive flag database
- **Local Storage**: All flag images stored locally for privacy and speed

### Privacy & Security
- ✅ **No Personal Data Collection** - Only public IP geolocation
- ✅ **Local Flag Storage** - No external image requests after installation  
- ✅ **Minimal Permissions** - Only necessary Chrome APIs
- ✅ **Open Source** - Fully transparent code

## 📁 Project Structure

```
where-am-i/
├── 📄 manifest.json          # Extension configuration
├── ⚙️ background.js          # Service worker script
├── 🎨 popup.html             # Popup interface
├── 🎨 popup.css              # Popup styles  
├── 📱 popup.js               # Popup functionality
├── 🌍 _locales/              # Internationalization
│   ├── 🇺🇸 en/               # English translations
│   └── 🇨🇳 zh_CN/            # Chinese translations
├── 🏳️ icons/                 # Extension and flag icons
│   ├── 🏳️ flags/             # Country flag images (240+ countries)
│   └── 📱 *.png              # Extension icons (16x16, 48x48, 128x128)
└── 📚 store-assets/          # Chrome Web Store materials
```

## 🚧 Development

### Setup Development Environment
```bash
# Clone the repository
git clone https://github.com/your-username/where-am-i-extension.git
cd where-am-i-extension

# Load in Chrome for development
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked" and select this folder
```

### Building for Production
```bash
# Create distribution package
./package-for-store.sh

# Output: dist/where-am-i-v1.0.1.zip (ready for Chrome Web Store)
```

### Testing
- **Manual Testing**: Load extension in Chrome and test all features
- **Language Testing**: Switch browser language to test internationalization
- **Error Testing**: Disconnect internet to test error handling
- **VPN Testing**: Use VPN to test different countries and flags

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🐛 Report Bugs**: Open an issue with details and steps to reproduce
2. **💡 Suggest Features**: Share your ideas in the issues section
3. **🔧 Submit Pull Requests**: 
   - Fork the repository
   - Create a feature branch
   - Make your changes
   - Submit a pull request with clear description

### Development Guidelines
- Follow existing code style and structure
- Test thoroughly across different scenarios
- Update documentation for new features
- Ensure all text is internationalized

## 📊 Browser Support

- ✅ **Chrome**: Fully supported (Manifest V3)
- ✅ **Chromium**: Fully supported
- ✅ **Edge**: Supported (Chromium-based)
- ⚠️ **Other Browsers**: May require adaptation

## 📋 Changelog

### Version 1.0.0
- ✅ Initial release
- ✅ Country flag display on extension icon
- ✅ Detailed IP information popup
- ✅ Bilingual support (English/Chinese)
- ✅ Auto-refresh every 30 minutes
- ✅ Manual refresh functionality
- ✅ UN flag fallback for unknown locations
- ✅ Comprehensive error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ipapi.co** for reliable IP geolocation services
- **flagpedia.net** for comprehensive flag image database
- **Chrome Extensions Team** for excellent documentation and APIs
- **Contributors** who help make this project better

## 📞 Support

- **🐛 Issues**: [GitHub Issues](https://github.com/your-username/where-am-i-extension/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-username/where-am-i-extension/discussions)
- **📧 Contact**: [Your Email](mailto:your-email@example.com)

---

**🌟 Star this repository if you find it helpful!**

Made with ❤️ for the global internet community 🌍
