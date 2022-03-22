export function isFuntion(data) {
  return typeof data === 'function'
}

export function isObject(val) {
  return typeof val === 'object' && val != null
}

function flushCallBacks() {
  callbacks.forEach(cb => cb())
  watting = false
}
const callbacks = []
let watting = false

function timerFn() {}

if(Promise) {
  timerFn = () => {
    Promise.resolve().then(flushCallBacks)
  }
} else if (MutationObserver) {
  let textNode = document.createTextNode(1)
  let observe = new MutationObserver(flushCallBacks)
  observe.observe(textNode, {
    characterData: true
  })

  timerFn = () => {
    textNode.textContent = 3
  }
  // 微任务
} else if (setImmediate) {
  timerFn = () => {
    setImmediate(flushCallBacks)
  }
} else {
  timerFn = () => {
    setTimeout(flushCallBacks)
  }
}

export function nextTick(cb) {
  callbacks.push(cb)
  if(!watting) {
    // TODO 这里面到底用啥比较好
    // vue2 考虑了兼容性问题
    // vue3 直接用的Promise
    timerFn()
    watting = true
  }
}

// TODO 异步更新原理 记录nextTick 原理

// TODO 微任务是在页面渲染前执行，但是我取的是内存中的dom，不关心你渲染完毕没有
// dom树已经更新了...
// Promise.then

// 明天整理归纳