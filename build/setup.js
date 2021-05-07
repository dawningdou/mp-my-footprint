console.log('进行项目初始化前请先npm install...')
const execSync = require('child_process').execSync;
const os = require('os');
var readlineSync = require('readline-sync');

const func =  error => {
    if (error) {
      console.error(`execSync error: ${error}`);
      return;
    }
}
if (os.type() === 'Darwin') {
    var overwrite = readlineSync.question('确定要用标准README覆盖当前README.md吗？是[y] 否[n]\n');
    if (overwrite === 'y' || overwrite === 'yes') {
        try {
            execSync("mv README.temp.md README.md", func)
        } catch (err) {
            console.log('覆盖失败。可尝试从documents项目中下载README.md模板')
        }
    }
    console.log('\n初始化完成')
} else {
    console.log("not mac")
}
