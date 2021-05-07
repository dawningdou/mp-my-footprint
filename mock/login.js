module.exports = {
  // GET
  'GET /login': function (req, res, next) {
    // response json format
    const result = {
      ret: 0,
      errorcode: '0',
      msg: 'ok',
      data: {
        wxa_session_id: 'abcd'
      }
    }
    res.send(result)
  }
}