import { v4 as uuid } from 'uuid'
// import validate from '../utils/validate.js'
import path from 'path'
import fs from 'fs/promises'

const postFilePath = path.resolve(`./public/posts`)

let posts = []

async function createPost(req, res) {
	try {
		const { userId, title, description, taskDate } = req.body

		const allowToCreate = checkTaskDate(taskDate)

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

function checkTaskDate(taskDate) {
	let count = 0

	posts.forEach(task => {
		if (task.taskDate === taskDate) {
			count++
		}
	})

	return count < 3
}

async function getTasks(req, res) {
	try {
		const files = await fs.readdir(postFilePath)
		const postList = []

		for (const file of files) {
			if (path.extname(file) === '.json') {
				const filePath = path.join(postFilePath, file)
				const data = await fs.readFile(filePath, 'utf8')
				postList.push(JSON.parse(data))
			}
		}
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
		const query = req.query
		const SinglePost = []
		const filePath = path.resolve(postFilePath, `${query.id}.json`)

		try {
			await fs.access(filePath)
		} catch (err) {
			return res.status(404).render('getTasks', {
				errorMessage: 'Invalid email',
			})
		}
		const data = await fs.readFile(filePath, 'utf8')
		const response = JSON.parse(data)
		SinglePost.push(response)

		if (response.id === query.id) {
			res.status(200).render('getSinglePost', {
				title: 'getSinglePost',
				postList: SinglePost,
			})
		}
	} catch (e) {
		res.status(500).json({ message: e.message, status: 500 })
	}
}
function post(req, res, next) {
	res.render('createPost', {
		title: 'post',
	})
}
export default { post, createPost, getTasks, getSinglePost }
