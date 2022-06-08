import express from "express"

const app = express()
const port = 3009

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello Worlds!')
})

app.post('/user', (req, res) => {
  // 在服务器，可以使用 req.body 这个属性，来接收客户端发送过来的请求体数据
  // 默认情况下，如果不配置解析表单数据中间件，则 req.body 默认等于 undefined
  console.log(req.body)
  res.send(req.body)
})

app.post('/song', (req, res) => {
  // 在服务器，可以使用 req.body 这个属性，来接收客户端发送过来的请求体数据
  // 默认情况下，如果不配置解析表单数据中间件，则 req.body 默认等于 undefined
  console.log(req.body)
  res.send(req.body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})