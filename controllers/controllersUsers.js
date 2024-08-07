import { v4 as uuid } from 'uuid'
import md5 from 'md5'
import path from 'path'
import dotEnv from 'dotenv'
import fs from 'fs/promises'
import CryptoJS from 'crypto-js'

const usersFilePath = path.resolve(`./public/users`)

dotEnv.config()
import { examinationRegister, examinationLogin } from '../utils/validate.js'

let tokens = []
const createToken = (email, id) => {
	const token = {
		email: email,
		id: id,
	}
	const secret = process.env.TOKEN_KEY
	const bytes = CryptoJS.AES.encrypt(JSON.stringify(token), secret).toString()
	console.log(bytes)
	tokens.push(bytes)
	return bytes
}

const examinationEmail = async email => {
	const filePath = path.resolve(usersFilePath, `${email}.json`)
	try {
		const data = await fs.readFile(filePath, 'utf8')
		const response = JSON.parse(data)
		return response.email === email
	} catch (error) {
		if (error.code === 'ENOENT') {
			return false
		}
		throw error
	}
}

const fromRegister = async (req, res) => {
	try {
		const errors = examinationRegister(req)
		const { fName, lName, email, password } = req.body
		await fs.mkdir(usersFilePath, { recursive: true })
		if (errors.haveErrors) {
			let message = Object.values(errors.fields)
			res.status(422).render('register', {
				errors: message,
			})
			return
		}

		const emailExists = await examinationEmail(email)
		if (emailExists) {
			return res.render('register', {
				errorMessage: 'Email already exists',
			})
		}

		const newData = {
			id: uuid(),
			fName,
			lName,
			email,
			password: md5(md5(password) + process.env.MD5CONFIG),
		}

		const filePath = path.resolve(usersFilePath, `${newData.email}.json`)
		await fs.writeFile(filePath, JSON.stringify(newData, null, 2))

		console.log('Registration data:', newData)
		res.redirect('/')
	} catch (error) {
		console.error('Error during registration:', error)
		res.status(500).json({ message: error.message, status: 500 })
	}
}
async function usersList() {
	const files = await fs.readdir(usersFilePath)
	const listUsers = []

	for (const file of files) {
		if (path.extname(file) === '.json') {
			const filePath = path.join(usersFilePath, file)
			const data = await fs.readFile(filePath, 'utf8')
			listUsers.push(JSON.parse(data))
		}
	}
	return listUsers
}

const fromLogin = async (req, res) => {
	try {
		const errors = examinationLogin(req)

		if (errors.haveErrors) {
			let message = Object.values(errors.fields)
			res.status(422).render('register', {
				errors: message,
			})
			return
		}

		const { email, password } = req.body

		const users = await usersList()
		const user = users.find(user => user.email === email)
		// createToken(user.email, user.id)
		if (user && user.password === md5(md5(password) + process.env.MD5CONFIG)) {
			const token = createToken(user.email, user.id)
			res.setHeader('x-token', `Bearer ${token}`)
			res.status(200).render('index', {
				title: 'Responsive NFT website - Bedimcode',
				homeTitle: 'Discover Collect,',
				homeSubtitle: 'and Sell NFTs',
				homeDescription: 'Explore on the world best largest NFT marketplace.',
				homeBtn: 'New Post',
			})
		} else {
			return res.render('register', {
				errorMessage: 'Invalid email or password',
			})
		}
	} catch (error) {
		res.status(500).json({ message: error.message, status: 500 })
	}
}

const getUsersList = async (req, res) => {
	try {
		const listUsers = await usersList()
		const { page = 1 } = req.query
		const limit = 5

		let list = [...listUsers]

		list.sort((a, b) => new Date(a.taskDate) - new Date(b.taskDate))

		const maxPageCount = Math.ceil(list.length / limit)

		const offset = (page - 1) * limit
		list = list.slice(offset, offset + limit)

		if (list) {
			res.status(200).render('getUsersList', {
				title: 'getUsersList',
				usersList: listUsers,
				currentPage: +page,
				maxPageCount: maxPageCount,
			})
		}
	} catch (e) {
		res.status(500).json({ message: e.message, status: 500 })
	}
}

const getUserProfile = async (req, res) => {
	try {
		const { email } = req.query
		const users = await usersList()
		const result = users.find(user => user.email === email)

		if (result) {
			return res.status(200).render('getUserProfile', {
				title: 'User Profile',
				usersList: [result],
			})
		}
	} catch (e) {
		res.status(500).json({ message: e.message, status: 500 })
	}
}

async function findUserById(userId) {
	const users = await usersList()
	return users.find(user => user.id === userId)
}

const updateUserProfile = async (req, res) => {
	try {
		const { id, fName, lName, email, password } = req.body
		const user = await findUserById(id)
		if (user) {
			const filePath = path.resolve(usersFilePath, `${user.email}.json`)
			const newData = {
				id: id,
				fName: fName,
				lName: lName,
				email: email,
				password: md5(md5(password) + process.env.MD5CONFIG),
			}
			await fs.writeFile(filePath, JSON.stringify(newData, null, 2))
			res.status(200).json(newData)
		} else {
			res.status(404).render('updateUserProfile', {
				errorMessage: 'User not found',
			})
		}
	} catch (error) {
		res.status(500).json({ message: error.message, status: 500 })
	}
}

function register(req, res, next) {
	res.render('register', {
		title: 'register',
	})
}
function updateUser(req, res, next) {
	res.render('updateUserProfile', {
		title: 'updateUserProfile',
	})
}

function home(req, res, next) {
	res.render('index', {
		title: 'Responsive NFT website - Bedimcode',
		homeTitle: 'Discover Collect,',
		homeSubtitle: 'and Sell NFTs',
		homeDescription: 'Explore on the world best largest NFT marketplace.',
		homeBtn: 'New Post',
	})
}

export default {
	fromRegister,
	fromLogin,
	getUsersList,
	getUserProfile,
	updateUserProfile,
	register,
	home,
	updateUser,
}
