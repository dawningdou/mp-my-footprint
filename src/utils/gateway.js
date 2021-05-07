// import CryptoJS from 'crypto-js/crypto-js'
export default {
  auth (header, gatewayConfig) {
    // const { key, id } = gatewayConfig
    // const date = new Date().toUTCString()
    // header['X-Date'] = date
    // const content = `x-date: ${date}`
    // const hmacSha1 = CryptoJS.HmacSHA1(content, key)
    // const sign = CryptoJS.enc.Base64.stringify(hmacSha1)
    // const Authorization = `hmac id="${id}", algorithm="hmac-sha1", headers="X-Date", signature="${sign}"`
    // header.Authorization = Authorization
    return header
  }
}
