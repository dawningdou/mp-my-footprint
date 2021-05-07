const ci = require('miniprogram-ci')
const path = require('path');
const fs = require("fs");
const argv = require('minimist')(process.argv.slice(2));
const package = require('./package.json')
const appDirectory = fs.realpathSync(process.cwd());
const ProjectConfig = require('./dist/build/mp-weixin/project.config.json');
const previewPath = path.resolve(appDirectory, './preview.jpg');
 
 
(async () => {
    try {
        const project = new ci.Project({
            appid: ProjectConfig.appid,
            type: "miniProgram",
            projectPath: path.resolve(appDirectory, './dist/build/mp-weixin'),
            privateKeyPath: argv.p,
            ignores: ["node_modules/**/*"],
        })
        await ci.upload({
            project,
            version: package.version,
            desc: package.versionDesc,
            setting: {
                ...ProjectConfig.setting
            },
            onProgressUpdate: console.log,
        })
        await ci.preview({
            project,
            version: package.version,
            desc: package.versionDesc,
            qrcodeFormat: "image",
            qrcodeOutputDest: previewPath,
            setting: {
                ...ProjectConfig.setting
            },
            onProgressUpdate: console.log,
        })
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
 
})()
