import CryptoJS from 'crypto-js'

const cheekToken = (req, res, next) => {
	try {
		const token = req.headers['x-token'].trim()
		const secret = process.env.TOKEN_KEY
		const bytes = CryptoJS.AES.decrypt(token, secret)
		const originalText = bytes.toString(CryptoJS.enc.Utf8)
		const result = JSON.parse(originalText)
		console.log(result)

		next()
	} catch (error) {
		res.status(401).json({ message: 'Unauthorized' })
	}
}

export default cheekToken
