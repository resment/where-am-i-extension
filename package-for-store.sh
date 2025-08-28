#!/bin/bash
# Chrome Web Store 打包脚本

echo "🚀 开始为Chrome Web Store打包..."

# 创建输出目录
mkdir -p dist
rm -rf dist/extension-release

# 创建临时目录
mkdir -p dist/extension-release

# 复制必需文件
echo "📄 复制核心文件..."
cp manifest.json dist/extension-release/
cp background.js dist/extension-release/
cp popup.html dist/extension-release/
cp popup.css dist/extension-release/
cp popup.js dist/extension-release/

# 复制图标文件夹
echo "🖼️ 复制图标文件..."
cp -r icons/ dist/extension-release/

# 复制本地化文件
echo "🌍 复制本地化文件..."
cp -r _locales/ dist/extension-release/

# 复制说明文档
echo "📚 复制文档文件..."
cp README.md dist/extension-release/
cp INSTALL.md dist/extension-release/
cp package.json dist/extension-release/

# 获取版本号
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": "\(.*\)".*/\1/')

# 创建ZIP包
echo "📦 创建ZIP包..."
cd dist/extension-release
zip -r ../where-am-i-v${VERSION}.zip .
cd ../..

# 清理临时文件
echo "🧹 清理临时文件..."
rm -rf dist/extension-release

echo "✅ 打包完成！"
echo "📁 输出文件: dist/where-am-i-v${VERSION}.zip"
echo "📊 文件大小: $(du -h dist/where-am-i-v${VERSION}.zip | cut -f1)"

# 验证ZIP包内容
echo ""
echo "📋 ZIP包内容预览:"
echo "总文件数: $(unzip -l dist/where-am-i-v${VERSION}.zip | tail -1 | awk '{print $2}')"
echo ""
echo "主要文件:"
unzip -l dist/where-am-i-v${VERSION}.zip | grep -E "\.(json|js|html|css|png)$" | head -10
echo "..."
echo ""
echo "🎉 打包成功！现在可以上传到Chrome Web Store了！"
