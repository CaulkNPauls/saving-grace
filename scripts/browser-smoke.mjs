const version = await fetch("http://localhost:9222/json/version").then((r) => r.json());
const socket = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
const pending = new Map();
const consoleErrors = [];
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    return message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown" || message.method === "Log.entryAdded") {
    consoleErrors.push(message.params);
  }
});

function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const messageId = ++id;
    pending.set(messageId, { resolve, reject });
    socket.send(JSON.stringify({ id: messageId, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
await send("Log.enable", {}, sessionId);

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }, sessionId);
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function navigate(path) {
  await send("Page.navigate", { url: `http://localhost:3000${path}` }, sessionId);
  await wait(1200);
}
async function touch(selector) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block:"center"})`);
  await wait(100);
  const point = await evaluate(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); if (!e) return null; const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,width:r.width,height:r.height,display:getComputedStyle(e).display,top:document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)?.outerHTML?.slice(0,120)}; })()`);
  if (!point) throw new Error(`Missing touch target: ${selector}`);
  if (!point.width || !point.height) throw new Error(`Hidden touch target: ${selector} ${JSON.stringify(point)}`);
  const receivesPointer = await evaluate(`(() => { const e=document.querySelector(${JSON.stringify(selector)}); const r=e.getBoundingClientRect(); return e.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)); })()`);
  if (!receivesPointer) throw new Error(`Intercepted touch target: ${selector} ${JSON.stringify(point)}`);
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  await wait(250);
}
async function touchButton(text) {
  const selector = `[data-test-button="${text.replaceAll(" ", "-")}"]`;
  const found = await evaluate(`(() => { const e=[...document.querySelectorAll("button")].find((b)=>b.textContent.trim()===${JSON.stringify(text)}); if(!e)return false; e.dataset.testButton=${JSON.stringify(text.replaceAll(" ", "-"))}; return true; })()`);
  if (!found) throw new Error(`Missing button: ${text}`);
  await touch(selector);
}
function assert(value, message) {
  if (!value) throw new Error(message);
}
async function openMenu() {
  for (let attempt = 0; attempt < 8; attempt++) {
    if (await evaluate('Boolean(document.querySelector("[role=dialog]"))')) return;
    await touch('button[aria-controls]');
    await wait(250);
  }
  throw new Error("Menu did not hydrate/open");
}
async function waitForPath(path) {
  for (let attempt = 0; attempt < 12; attempt++) {
    if ((await evaluate("location.pathname")) === path) return true;
    await wait(250);
  }
  return false;
}

const viewports = [
  [375, 812],
  [390, 844],
  [412, 915],
  [430, 932],
];
const routes = ["/tattoos", "/hair", "/nails", "/about", "/faq", "/booking"];

for (let index = 0; index < viewports.length; index++) {
  const [width, height] = viewports[index];
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 2, mobile: true }, sessionId);
  await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 }, sessionId);
  await navigate("/");
  assert((await evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth")), `${width}: horizontal overflow`);
  await openMenu();
  const expanded = await evaluate('document.querySelector("button[aria-controls]").getAttribute("aria-expanded")');
  assert(expanded === "true", `${width}: did not open; errors=${JSON.stringify(consoleErrors)}`);
  assert(await evaluate('Boolean(document.querySelector("[role=dialog]"))'), `${width}: dialog missing`);
  assert(await evaluate('getComputedStyle(document.body).overflow === "hidden"'), `${width}: body not locked`);
  await touch('[role=dialog] button');
  assert((await evaluate('document.querySelector("button[aria-controls]").getAttribute("aria-expanded")')) === "false", `${width}: did not close`);
  assert(await evaluate('getComputedStyle(document.body).overflow !== "hidden"'), `${width}: body lock remained`);

  for (let routeIndex = index; routeIndex < routes.length; routeIndex += viewports.length) {
    await openMenu();
    await touch(`[role=dialog] a[href="${routes[routeIndex]}"]`);
    assert(await waitForPath(routes[routeIndex]), `${width}: failed ${routes[routeIndex]}`);
    assert(!(await evaluate('Boolean(document.querySelector("[role=dialog]"))')), `${width}: menu stayed open`);
    await navigate("/");
  }
  await openMenu();
  assert(await evaluate('Boolean(document.querySelector("[role=dialog]"))'), `${width}: failed after navigation`);
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" }, sessionId);
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape" }, sessionId);
  await wait(200);
  assert(!(await evaluate('Boolean(document.querySelector("[role=dialog]"))')), `${width}: Escape failed`);
}

for (const [width, height] of [[768, 900], [1280, 900]]) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false }, sessionId);
  await navigate("/");
  assert(await evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth"), `${width}: horizontal overflow`);
}

await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, sessionId);
await navigate("/faq");
await touch("details summary");
assert(await evaluate('document.querySelector("details").open'), "FAQ did not open");

await navigate("/booking");
assert(!(await evaluate('Boolean(document.querySelector("[data-mobile-book-bar]"))')), "Booking bar visible on booking route");
await evaluate('document.querySelector("input[value=hair]").click(); document.querySelector("input[value=tattoo]").click()');
await touchButton("Next");
await touchButton("Next");
assert((await evaluate('document.querySelector("input[name=name]").checkValidity()')) === false, "Blank validation did not run");
await evaluate('document.querySelector("input[name=name]").value="Grace Tester"; document.querySelector("input[name=email]").value="grace@example.com"');
await touchButton("Next");
await evaluate('document.querySelector("textarea[name=idea]").value="Botanical blackwork"; document.querySelector("input[name=placement]").value="Forearm"');
await touchButton("Back");
assert((await evaluate('document.querySelector("input[name=name]").value')) === "Grace Tester", "Back lost entered values");
await touchButton("Next");
await touchButton("Next");
await evaluate('document.querySelectorAll("input[type=checkbox]").forEach((e)=>e.click())');
assert(await evaluate('[...document.querySelectorAll("input[type=checkbox]")].every((e)=>e.checked)'), "Checkboxes did not remain checked");
await touchButton("Send Request");
assert((await evaluate("document.body.innerText.toLowerCase().includes('development preview only')")), `UI-only submit failed: ${await evaluate('document.body.innerText.slice(-500)')}`);

const summary = { viewports: [...viewports, [768, 900], [1280, 900]], routes, consoleErrors: consoleErrors.length };
console.log(JSON.stringify(summary));
await send("Target.closeTarget", { targetId });
socket.close();
