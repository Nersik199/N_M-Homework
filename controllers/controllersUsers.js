import { v4 as uuid } from 'uuid'
import md5 from 'md5'
import fs from 'fs/promises'
import path from 'path'
import dotEnv from 'dotenv'

dotEnv.config()
const usersFilePath = path.resolve(`./public/users`)

const examinationEmail = async email => {
	const filePath = path.resolve(usersFilePath, `${email}.json`)
	try {
		const data = await fs.readFile(filePath, 'utf8')
		const response = JSON.parse(data)
		return response.email === email
	} catch (error) {
		throw error
	}
}

const fromRegister = async (req, res) => {
	try {
		const { fName, lName, email, password } = req.body
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

const fromLogin = async (req, res) => {
	try {
		const { email, password } = req.body

		const filePath = path.resolve(usersFilePath, `${email}.json`)
		const data = await fs.readFile(filePath, 'utf8')
		const response = JSON.parse(data)

		if (
			response.email === email &&
			response.password === md5(md5(password) + process.env.MD5CONFIG)
		) {
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
		const files = await fs.readdir(usersFilePath)
		const listUsers = []

		for (const file of files) {
			if (path.extname(file) === '.json') {
				const filePath = path.join(usersFilePath, file)
				const data = await fs.readFile(filePath, 'utf8')
				listUsers.push(JSON.parse(data))
			}
		}
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
		const query = req.query
		const profileUser = []
		const filePath = path.resolve(usersFilePath, `${query.email}.json`)

		const data = await fs.readFile(filePath, 'utf8')
		const response = JSON.parse(data)
		profileUser.push(response)

		if (response.email === query.email) {
			res.status(200).render('getUserProfile', {
				title: 'getUserProfile',
				usersList: profileUser,
			})
		}
	} catch (e) {
		res.status(500).json({ message: e.message, status: 500 })
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
	register,
	home,
	updateUser,
}
