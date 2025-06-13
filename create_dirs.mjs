import fs from 'fs'
import path from 'path'
import { promises as fsPromises } from 'fs'
import pkg from './package.json' with { type: 'json' }

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const baseDir = __dirname
const tempDir = path.join(baseDir, 'temp')

const subDirs = ['apps', 'auto-updates', 'smallest-updates']

// 检查并创建 temp 目录
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
  console.log(`目录 '${tempDir}' 已创建。`)
} else {
  console.log(`目录 '${tempDir}' 已存在。`)
}

// 在 temp 目录下创建子目录
subDirs.forEach((dir) => {
  const fullPath = path.join(tempDir, dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log(`子目录 '${fullPath}' 已创建。`)
  } else {
    console.log(`子目录 '${fullPath}' 已存在。`)
  }
})

async function copyFile(fromPath, toPath) {
  try {
    // 确保目标目录存在
    const toDir = path.dirname(toPath)
    await fsPromises.mkdir(toDir, { recursive: true })

    // 拷贝文件，如果目标文件存在则覆盖
    await fsPromises.copyFile(fromPath, toPath)
    console.log(`文件从 '${fromPath}' 成功拷贝到 '${toPath}'。`)
  } catch (error) {
    console.error(`拷贝文件失败: ${error.message}`)
    throw error // 抛出错误以便调用者处理
  }
}
// smallest - updates
copyFile('./dist/latest-smallest.json', './temp/smallest-updates/latest-smallest.json')

copyFile(
  `./dist/garbage-classification-${pkg.version}-smallest.zip`,
  `./temp/smallest-updates/garbage-classification-${pkg.version}-smallest.zip`
)

// 将 dist 目录下的所有文件拷贝到 temp/auto-updates 目录下
const distDir = path.resolve(__dirname, 'dist')
const autoUpdatesDir = path.resolve(tempDir, 'auto-updates')

try {
  const files = await fsPromises.readdir(distDir, { withFileTypes: true })
  for (const file of files) {
    const srcPath = path.join(distDir, file.name)
    const destPath = path.join(autoUpdatesDir, file.name)
    if (file.isFile()) {
      await fsPromises.copyFile(srcPath, destPath)
      console.log(`Successfully copied file '${srcPath}' to '${destPath}'`)
    } else {
      console.log(`Skipping directory '${srcPath}'`)
    }
  }
  console.log(`Successfully processed contents of '${distDir}' for copying to '${autoUpdatesDir}'`)
} catch (error) {
  console.error(`Error processing contents from '${distDir}' to '${autoUpdatesDir}':`, error)
  if (error.code !== 'ENOENT') {
    throw error
  }
}
