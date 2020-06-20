#查看系统中已经存在的shell变量,如果传回值!=0 则退出shell
set -e

echo "=== start building ==="
# 清理上一次的构建产物
if [ -d build ]; then
    rm -rf build;
fi

# 安装依赖
npm install
# 开始构建
npm run build

# 清理无用的文件
rm -rf build/asset-manifest.json
rm -rf build/service-worker.js
rm -rf build/precache-manifest.*.js
# 清理本次构建安装的node_modules
rm -rf node_modules

echo "=== finish building ==="