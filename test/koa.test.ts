import koa from "koa";
import supertest from "supertest";

const cors = require("@koa/cors");

async function responseTime(ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
}

const app = new koa();

app.use(async (ctx, next) => {
  ctx.body = "Hello World";
  await next();
});

app.use(responseTime);
app.use(cors());

test("koa", async () => {
  let server = app.listen();
  let request = supertest(server);

  request
    .get("/")
    .expect(200)
    .expect("X-Response-Time", /\d+ms/)
    .expect("Access-Control-Allow-Origin", "127.0.0.1")
    .end((err, res) => {
      expect(res.text).toBe("Hello World");
    });
});
