const packageConfig = require('./package.json')
const { exec } = require('child_process')

// 这段脚本的作用是读取package.json中kmap包的版本号，从公司私服中进行安装

let kmapEdition = packageConfig.dependencies.kmap
let registry = ' --registry=http://10.200.0.5:8081/repository/npm-group/'
let cmd = 'yarn add kmap@' + kmapEdition + registry

if (!kmapEdition){
  console.log('kmap is not found, quiting.')
  return
}
console.log('excuting command: ' + cmd)

exec(cmd, (err, stdout, stderr) => {
  if (err){
    console.log(err)
    return
  }
  console.log(`stdout: ${stdout}`)
  console.log(`stderr: ${stderr}`)
})

