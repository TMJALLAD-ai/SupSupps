module.exports = async function handler(req, res) {
  res.status(200).send(JSON.stringify({ test: 'works' }))
}
