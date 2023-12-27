// Create and send token and save in the cookie.
require('dotenv').config();
const sendToken = (user, statusCode, res) => {
    // Create Jwt token
    const token = user.getJwtToken();
 
    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIES_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    let tokenAndoptions = {token , options}
    return tokenAndoptions
    
}

module.exports = sendToken;