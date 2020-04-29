export const prompt = (question: string): Promise<string> => {
  var rl = require("readline")
  var r = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  })
  return new Promise(resolve => {
    r.question(question, (answer: string) => {
      r.close()
      resolve(answer)
    })
  })
}
