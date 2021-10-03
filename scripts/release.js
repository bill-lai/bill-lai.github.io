const execa = require('execa')
const { buildPath } = require('../config/paths')

// 运行bin文件的脚本， 运行参数 以及配置
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })


const main = async () => {
  const commitMsg = process.argv.slice(2).join('') || '发布文章'

  await run(`yarn`, ['build-serve'])

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    await run(`git`, ['add', '-A'])
    await run(`git`, ['commit', '-m', commitMsg])
    await run(`git`, ['subtree', 'push', '--prefix', buildPath, 'origin', 'gh-pages'])
  } else {
    console.log('没有需要发布的内容')
  }
};

main()