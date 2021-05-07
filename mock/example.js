module.exports = {
  // GET
  'GET /example/detail': function (req, res, next) {
    console.log(req)
    const { id } = req.query
    const result = {
      ret: 0,
      errorcode: 0,
      msg: 'ok',
      data: {
        id,
        title: 'example' + id
      }
    }
    res.send(result)
  }
}
