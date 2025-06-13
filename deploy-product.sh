#! /bin/bash

# This script is used to deploy the test version of the app to the test server.

# This script is run from the root of the project.

# 执行构建
echo $(date)
echo -e "\033[35m上传生产.\033[0m"

# 复制文件到服务器
scp -r dist ecs-user@47.108.213.244:/home/ecs-user/nginx/html/release/recycle_bin
echo  "Copy complete."