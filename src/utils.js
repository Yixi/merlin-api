const generateProcessId = () => parseInt(`${Math.random() * 100000000}`, 10)

module.exports = {
  generateProcessId
}
