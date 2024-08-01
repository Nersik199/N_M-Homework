import { v4 as uuid } from 'uuid'
import path from 'path'
import fs from 'fs/promises'
import { examinationTask, examinationUpdate } from '../utils/validate.js'

const postFilePath = path.resolve(`./public/posts`)

let posts = []

async function createPost(req, res) {
	try {
		const errors = examinationTask(req)
		const { userId, title, description, taskDate } = req.body
		await fs.mkdir(postFilePath, { recursive: true })
		if (errors.haveErrors) {
			let message = Object.values(errors.fields)
			res.status(422).render('createPost', {
				errors: message,
			})
			return
		}

		const allowToCreate = await checkTaskDate(taskDate)

		if (!allowToCreate) {
			res.render('createPost', {
				info: 'You can create only 3 tasks per day',
			})
			return
		}

		const newData = {
			id: uuid(),
			userId,
			title,
			description,
			taskDate,
			completed: false,
		}

		posts.push(newData)
		const filePath = path.resolve(postFilePath, `${newData.id}.json`)
		await fs.writeFile(filePath, JSON.stringify(newData, null, 2))
		res.status(200).render('getTasks', {
			posts: posts,
			title: 'All Posts',
		})
	} catch (e) {
		res.status(404).json({ message: e.message, status: 404 })
	}
}
async function postsContent() {
	const files = await fs.readdir(postFilePath)
	const post = []

	for (const file of files) {
		if (path.extname(file) === '.json') {
			const filePath = path.join(postFilePath, file)
			const data = await fs.readFile(filePath, 'utf8')
			post.push(JSON.parse(data))
		}
	}
	return post
}

async function checkTaskDate(taskDate) {
	let count = 0
	const postDate = await postsContent()

	postDate.forEach(task => {
		console.log(task.taskDate)
		if (task.taskDate === taskDate) {
			count++
		}
	})

	return count < 3
}

async function getTasks(req, res) {
	try {
		const postList = await postsContent()
		const { page = 1 } = req.query
		const limit = 5

		let list = [...postList]

		list.sort((a, b) => new Date(a.taskDate) - new Date(b.taskDate))

		const maxPageCount = Math.ceil(list.length / limit)

		const offset = (page - 1) * limit
		list = list.slice(offset, offset + limit)

		if (list) {
			res.status(200).render('getTasks', {
				title: 'getTasks',
				posts: postList,
				currentPage: +page,
				maxPageCount: maxPageCount,
			})
		}
	} catch (e) {
		res.status(500).json({ message: e.message, status: 500 })
	}
}

const getSinglePost = async (req, res) => {
	try {
		const { id } = req.query
		const posts = await postsContent()
		const singlePost = posts.find(post => post.id === id.trim())

		if (singlePost) {
			return res.status(200).render('getSinglePost', {
				title: 'Single Post',
				postList: [singlePost],
			})
		}
	} catch (e) {
		res.status(500).json({ message: e.message, status: 500 })
	}
}

async function findPostById(postId, userId) {
	const posts = await postsContent()
	const result = posts.find(post => {
		if (post.id === postId && post.userId === userId) {
			return posts
		}
	})
	return result
}

const updatePost = async (req, res) => {
	try {
		const errors = examinationUpdate(req)

		if (errors.haveErrors) {
			let message = Object.values(errors.fields)
			res.status(422).render('updatePost', {
				errors: message,
			})
			return
		}

		const { id, title, description, userId, taskDate } = req.body
		const post = await findPostById(id, userId)
		console.log(post)
		if (post) {
			const filePath = path.resolve(postFilePath, `${post.id}.json`)
			const newData = {
				id: id,
				title: title,
				description: description,
				taskDate: taskDate,
				userId: userId,
				completed: true,
			}
			await fs.writeFile(filePath, JSON.stringify(newData, null, 2))
			res.status(200).json(newData)
		} else {
			res.status(404).json({ errorMessage: 'Post not found' })
		}
	} catch (error) {
		res.status(500).json({ message: error.message, status: 500 })
	}
}

function post(req, res, next) {
	res.render('createPost', {
		title: 'post',
	})
}

function postUpdate(req, res) {
	res.render('updatePost', {
		title: 'updatePost',
	})
}
export default {
	post,
	createPost,
	getTasks,
	getSinglePost,
	postUpdate,
	updatePost,
}
