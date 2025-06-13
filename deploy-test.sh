#! /bin/bash

# This script is used to deploy the test version of the app to the test server.

# This script is run from the root of the project.

# 执行构建
echo $(date)
echo -e "\033[35m上传测试.\033[0m"

# 复制文件到服务器
scp -r temp/* ecs-user@47.108.213.244:/home/ecs-user/nginx/html/test/recycle_bin/dist
echo  "Copy complete."