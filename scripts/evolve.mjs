#!/usr/bin/env node
/**
 * Ticket-Check-Bro — Self-Evolution Engine
 * 每次 push 后自动：健康度评估 + 进化轨迹记录 + 改进建议生成 + 回归门禁。
 * 纯 Node ESM，零新依赖。
 *
 * 退出码：0 健康 | 1 测试失败 | 2 测试数回归（门禁拦截）
 */
import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const docsDir = join(root, 'docs')
const logPath = join(docsDir, 'evolution-log.md')
const statePath = join(docsDir, '.evolution-state.json')

// ---------- 工具 ----------
function readJSON(p, fallback) {
  try {
    return JSON.parse(readFileSync(p, 'utf8'))
  } catch {
    return fallback
  }
}

function walk(dir, exts) {
  let out = []
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out = out.concat(walk(full, exts))
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full)
  }
  return out
}

function retryWrite(p, data) {
  let lastErr
  for (let i = 0; i < 3; i++) {
    try {
      writeFileSync(p, data)
      return
    } catch (e) {
      lastErr = e
      // 火绒等杀软可能瞬时锁定文件，短延迟后重试
      try {
        execSync('ping -n 1 127.0.0.1 >nul 2>&1')
      } catch {
        /* ignore */
      }
    }
  }
  console.warn('[warn] 写入失败（可能被杀软锁定）：' + p + ' — ' + (lastErr && lastErr.code))
}

function dirSize(dir) {
  let bytes = 0
  const stack = [dir]
  while (stack.length) {
    const cur = stack.pop()
    if (!existsSync(cur)) continue
    for (const e of readdirSync(cur, { withFileTypes: true })) {
      const full = join(cur, e.name)
      if (e.isDirectory()) stack.push(full)
      else bytes += statSync(full).size
    }
  }
  return bytes / (1024 * 1024)
}

// ---------- 1. 包信息 ----------
const pkg = readJSON(join(root, 'package.json'), {})
const version = pkg.version || '?.?.?'
const depsCount = Object.keys(pkg.dependencies || {}).length
const devDepsCount = Object.keys(pkg.devDependencies || {}).length

// ---------- 2. 测试（vitest json reporter） ----------
let tests = { total: 0, passed: 0, failed: 0 }
try {
  const raw = execSync('npx vitest run --reporter=json', {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  })
  const json = JSON.parse(raw)
  tests.total = json.numTotalTests || 0
  tests.passed = json.numPassedTests || 0
  tests.failed = json.numFailedTests || 0
} catch (e) {
  // vitest 失败时 stdout 仍可能含 JSON；尝试从错误输出解析
  const m = /"numTotalTests":(\d+)[^}]*"numPassedTests":(\d+)[^}]*"numFailedTests":(\d+)/.exec(
    String(e.stdout || ''),
  )
  if (m) {
    tests.total = +m[1]
    tests.passed = +m[2]
    tests.failed = +m[3]
  }
}

// ---------- 3. 结构指标 ----------
const srcFiles = walk(join(root, 'src'), ['.js', '.jsx'])
const parserFiles = walk(join(root, 'packages', 'core', 'src', 'parser'), ['.js']).filter(
  (f) => !f.endsWith('index.js') && !f.endsWith('InvoiceParser.js'),
)
const parserPluginCount = parserFiles.length
const distSizeMB = existsSync(join(root, 'dist')) ? dirSize(join(root, 'dist')) : 0
const buildOk = process.env.BUILD_OK === '1' || existsSync(join(root, 'dist', 'index.html'))
const commitHash = (() => {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim()
  } catch {
    return 'unknown'
  }
})()

// ---------- 4. 健康度评分（0-100） ----------
const testScore = tests.total > 0 ? (tests.failed === 0 ? 40 : (tests.passed / tests.total) * 40) : 0
const buildScore = buildOk ? 20 : 0
const depScore = depsCount <= 35 ? 15 : depsCount <= 45 ? 8 : 3
const pluginScore = parserPluginCount >= 8 ? 15 : parserPluginCount >= 4 ? 8 : 3
const health = Math.round(testScore + buildScore + depScore + pluginScore)

// ---------- 5. 改进建议 ----------
const suggestions = []
if (depsCount > 45) suggestions.push('依赖偏多，审查并移除未使用依赖（当前 ' + depsCount + ' 个）。')
if (distSizeMB > 5)
  suggestions.push('产物偏大（' + distSizeMB.toFixed(1) + 'MB），考虑路由级懒加载或进一步拆分 chunk。')
if (tests.total < 20) suggestions.push('测试数偏低（' + tests.total + '），为核心 parser 补充单测。')
if (parserPluginCount < 8)
  suggestions.push('parser 插件仅 ' + parserPluginCount + ' 个，可通过核心包插件注册表扩展新票据类型。')
if (!existsSync(join(root, '.eslintrc.cjs')))
  suggestions.push('尚未接入 ESLint/Prettier，建议补齐工程化护栏。')
else if (!existsSync(join(root, 'node_modules', '.bin', 'eslint')))
  suggestions.push('ESLint 配置已就位但依赖未安装（node_modules/.bin/eslint 缺失），运行 `npm i -D eslint prettier eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier` 完成接入。')
else suggestions.push('ESLint/Prettier 已接入，保持 lint:fix 在 pre-commit 运行。')

// ---------- 6. 回归门禁 ----------
const prev = readJSON(statePath, {})
let gate = 'PASS'
let exitCode = 0
if (tests.failed > 0) {
  gate = 'FAIL: tests failing'
  exitCode = 1
} else if (prev.total && tests.total < prev.total) {
  gate = 'REGRESSION: test count dropped ' + prev.total + ' -> ' + tests.total
  exitCode = 2
}

// ---------- 7. 写进化日志 ----------
const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
const entry = `
## [${version}] ${now} — ${commitHash}

- **健康度评分**: ${health}/100 (门禁: ${gate})
- **测试**: ${tests.passed}/${tests.total} 通过 (失败 ${tests.failed})
- **结构**: src ${srcFiles.length} 文件 | parser 插件 ${parserPluginCount} | 依赖 ${depsCount}+${devDepsCount}
- **产物**: dist ${distSizeMB ? distSizeMB.toFixed(2) + 'MB' : 'N/A'} | build ${buildOk ? 'OK' : 'MISSING'}
- **改进建议**:
${suggestions.map((s) => '  - ' + s).join('\n')}
`

let log = existsSync(logPath) ? readFileSync(logPath, 'utf8') : '# Ticket-Check-Bro 进化日志\n\n'
// 在标题后插入最新条目
const idx = log.indexOf('\n')
log = log.slice(0, idx + 1) + entry + log.slice(idx + 1)
retryWrite(logPath, log)

retryWrite(
  statePath,
  JSON.stringify(
    { version, total: tests.total, passed: tests.passed, health, updatedAt: now },
    null,
    2,
  ),
)

// ---------- 8. 输出摘要 ----------
console.log('========================================')
console.log(' Ticket-Check-Bro 自我进化引擎')
console.log('========================================')
console.log(` 版本       : ${version} (${commitHash})`)
console.log(` 健康度     : ${health}/100`)
console.log(` 测试       : ${tests.passed}/${tests.total} (失败 ${tests.failed})`)
console.log(` parser插件 : ${parserPluginCount} | 依赖 ${depsCount}+${devDepsCount}`)
console.log(` 产物       : ${distSizeMB ? distSizeMB.toFixed(2) + 'MB' : 'N/A'} | build ${buildOk ? 'OK' : 'MISSING'}`)
console.log(` 门禁       : ${gate}`)
console.log('----------------------------------------')
console.log(' 改进建议:')
suggestions.forEach((s) => console.log('  - ' + s))
console.log('========================================')

process.exit(exitCode)
