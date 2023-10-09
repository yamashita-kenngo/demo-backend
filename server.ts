import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { viewEngine, etaEngine, oakAdapter } from "https://deno.land/x/view_engine@v10.5.1c/mod.ts"
import  logger  from "https://deno.land/x/oak_logger/mod.ts";


const kv = await Deno.openKv();
const key = ["users", crypto.randomUUID()];
const value = { name: "John", created: new Date() };
await kv.set(key, value);

const app = new Application();

app.use(logger.logger);
app.use(logger.responseTime);

const router = new Router();

app.use(
  viewEngine(oakAdapter, etaEngine, {
    viewRoot: "./views/",
  })
);

router.get("/", (ctx) => {
  ctx.render("index.eta", { name: "John" } );
});

router.get("/home", (ctx) => {
  ctx.render("home.eta", { name: "home" } );
});

router.get("/data", async(ctx) => {
  const result = await kv.get(key);
  console.log(result);
  ctx.response.body = result;
})

app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });