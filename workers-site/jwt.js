const wellKnownJwks = require('./jwks.json');

/**
 * Parse the JWT and validate it.
 *
 * We are just checking that the signature is valid, but you can do more that. 
 * For example, check that the payload has the expected entries or if the signature is expired..
 */ 
async function isValidJwt(request) {
  const encodedToken = getJwt(request);
  if (encodedToken === null) {
    return false
  }
  const token = decodeJwt(encodedToken);

  // Is the token expired?
  let expiryDate = new Date(token.payload.exp * 1000)
  let currentDate = new Date(Date.now())
  if (expiryDate <= currentDate) {
    console.log('expired token')
    return false
  }

  return isValidJwtSignature(token)
}

/**
 * For this example, the JWT is passed in as part of the Authorization header,
 * after the Bearer scheme.
 * Parse the JWT out of the header and return it.
 */
function getJwt(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader.substring(0, 6) !== 'Bearer') {
    return null
  }
  return authHeader.substring(6).trim()
}

/**
 * Parse and decode a JWT.
 * A JWT is three, base64 encoded, strings concatenated with ‘.’:
 *   a header, a payload, and the signature.
 * The signature is “URL safe”, in that ‘/+’ characters have been replaced by ‘_-’
 * 
 * Steps:
 * 1. Split the token at the ‘.’ character
 * 2. Base64 decode the individual parts
 * 3. Retain the raw Bas64 encoded strings to verify the signature
 */
function decodeJwt(token) {
  const parts = token.split('.');
  // const header = JSON.parse(atob(parts[0]));
  // const payload = JSON.parse(atob(parts[1]));
  // const signature = atob(parts[2].replace(/_/g, '/').replace(/-/g, '+')); // TODO: fix
  const { header, payload, signature } = jwtDecode2(token);
  console.log(header)
  return {
    header: header,
    payload: payload,
    signature: signature,
    raw: { header: parts[0], payload: parts[1], signature: parts[2] }
  }
}

// Taken from https://stackoverflow.com/a/58907605
const jwtDecode2 = function (jwt) {
  function b64DecodeUnicode(str) {
      return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
          var code = p.charCodeAt(0).toString(16).toUpperCase();
          if (code.length < 2) {
              code = '0' + code;
          }
          return '%' + code;
      }));
  }

  function decode(str) {
      var output = str.replace(/-/g, "+").replace(/_/g, "/");
      switch (output.length % 4) {
          case 0:
              break;
          case 2:
              output += "==";
              break;
          case 3:
              output += "=";
              break;
          default:
              throw "Illegal base64url string!";
      }

      try {
          return b64DecodeUnicode(output);
      } catch (err) {
          return atob(output);
      }
  }

  var jwtArray = jwt.split('.');

  return {
      header: decode(jwtArray[0]),
      payload: decode(jwtArray[1]),
      signature: decode(jwtArray[2])
  };
};

/**
 * Validate the JWT.
 *
 * Steps:
 * Reconstruct the signed message from the Base64 encoded strings.
 * Load the RSA public key into the crypto library.
 * Verify the signature with the message and the key.
 */
async function isValidJwtSignature(token) {
  const encoder = new TextEncoder();
  const data = encoder.encode([token.raw.header, token.raw.payload].join('.'));
  const signature = new Uint8Array(Array.from(token.signature).map(c => c.charCodeAt(0)));
/*
  const jwk = {
    alg: 'RS256',
    e: 'AQAB',
    ext: true,
    key_ops: ['verify'],
    kty: 'RSA',
    n: RSA_PUBLIC_KEY
  };
*/
  // You need to JWK data with whatever is your public RSA key. If you're using Auth0 you
  // can download it from https://[your_domain].auth0.com/.well-known/jwks.json
  const jwk = wellKnownJwks.keys[0];
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  return crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data)
}

export { isValidJwt, getJwt, decodeJwt };
