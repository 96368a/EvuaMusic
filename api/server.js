const express = require("express")
const expressWs = require('express-ws');
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

async function initWebSocket(app) {
    //初始化webscoket
    const wsClients = {}
    app.wsClients = wsClients;
    console.log("webscoket初始化完成");
    //监听websocket
    app.ws('/sync/:wid', (ws, req) => {
        if (!wsClients[req.params.wid]) {
            wsClients[req.params.wid] = []
        }
        // 将连接记录在连接池中
        wsClients[req.params.wid].push(ws);
        //给同id其他客户端发送消息
        ws.on('message', (msg) =>{
            wsClients[req.params.wid].forEach(client => {
                if (client !== ws) {
                    client.send(msg)
                }
            }
            )
            // ws.send(msg);
        });

        ws.onclose = () => {
            // 连接关闭时，wsClients进行清理
            wsClients[req.params.wid] = wsClients[req.params.wid].filter((client) => {
                return client !== ws;
            });
            if (wsClients[req.params.wid].length === 0) {
                delete wsClients[req.params.wid];
            }
        }
    });
/*     setInterval(() => {
        // 定时打印连接池数量
        console.log('websocket connection counts:')
        Object.keys(wsClients).forEach(key => {
            console.log(key, ':', wsClients[key].length);
        })
        console.log('-----------------------------');
    }, 5000); */
}

async function startServer() {
    const app = express()
    //开启websocket
    expressWs(app);
    await initWebSocket(app);
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