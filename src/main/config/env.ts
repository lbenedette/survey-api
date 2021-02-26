export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.jwtSecret ?? '$2y$12$fpBjQZDsW4GJoQgbj/2M8eo.4LWXzjU1YX1eqi5yvn0VJO/D2VzUi'
}
