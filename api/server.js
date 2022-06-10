const express = require("express")
const path = require('path')
const fs = require('fs')


const port = Number(process.env.PORT || '3009')
const host = process.env.HOST || ''

async function getModulesDefinitions(
    modulesPath,
    specificRoute,
    doRequire = true,
) {
    const files = await fs.promises.readdir(modulesPath)
    const parseRoute = (/** @type {string} */ fileName) =>
        specificRoute && fileName in specificRoute
            ? specificRoute[fileName]
            : `/${fileName.replace(/\.js$/i, '').replace(/_/g, '/')}`

    const modules = files
        .reverse()
        .filter((file) => file.endsWith('.js'))
        .map((file) => {
            const identifier = file.split('.').shift()
            const route = parseRoute(file)
            const modulePath = path.join(modulesPath, file)
            const module = doRequire ? require(modulePath) : modulePath

            return { identifier, route, module }
        })

    return modules
}

async function startServer() {
    const app = express()
    /**
     * CORS 跨域设置
     */
    app.use((req, res, next) => {
        if (req.path !== '/' && !req.path.includes('.')) {
            res.set({
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': req.headers.origin || '*',
                'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
                'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
                'Content-Type': 'application/json; charset=utf-8',
            })
        }
        req.method === 'OPTIONS' ? res.status(204).end() : next()
    })
    /**
     * json 解析
     */
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    const special = {
        'daily_signin.js': '/daily_signin'
    }

    const moduleDefinitions = (await getModulesDefinitions(path.join(__dirname, 'app/module'), special))
    for (const moduleDef of moduleDefinitions) {
        // Register the route.
        app.use(moduleDef.route, async (req, res) => {

            let query = Object.assign(
                {},
                { cookie: req.cookies },
                req.query,
                req.body,
                req.files,
            )


            const moduleResponse = await moduleDef.module(query, res)


            // res.send(moduleResponse)

        })
    }
    app.listen(port, host, () => {
        console.log(`server running @ http://${host ? host : 'localhost'}:${port}`)
    })
}

async function initModel() {
    const models = path.join(__dirname, 'app/models');
    fs.readdirSync(models)
        .filter(file => ~file.search(/^[^.].*\.js$/))
        .forEach(file => require(path.join(models, file)));
}
async function start() {
    require('mongoose').connect('mongodb://localhost:27017/', {
        authSource: 'admin',
        user: 'logs404',
        pass: 'logs#404',
        dbName: 'EvuaMusic'
    }).then(async () => {
        console.log('数据库连接成功');
        initModel();
        await startServer()
    }).catch(err => {
        console.log(err);
    })
}


exports.start = start