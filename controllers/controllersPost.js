import { v4 as uuid } from 'uuid'
import validate from '../utils/validate.js'
function post(req, res, next) {
	res.render('createPost', {
		title: 'post',
	})
}

let posts = []

function createPost(req, res) {
	try {
		const errors = validate.createTask(req)

		if (errors.haveErrors) {
			res.render('createPost', {
				errors: JSON.stringify(errors.fields, null, 2),
			})
			return
		}
		const { title, description, taskDate } = req.body

		const allowToCreate = checkTaskDate(taskDate)

		if (!allowToCreate) {
			res.render('createPost', {
				info: 'You can create only 3 tasks per day',
			})
			return
		}

		const newData = {
			id: uuid(),
			title,
			description,
			taskDate,
			completed: false,
		}

		posts.push(newData)
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

function getTasks(req, res) {
	try {
		const { page = 1 } = req.query
		const limit = 5

		let list = [...posts]

		list.sort((a, b) => new Date(a.taskDate) - new Date(b.taskDate))

		const maxPageCount = Math.ceil(list.length / limit)

		const offset = (page - 1) * limit
		list = list.slice(offset, offset + limit)

		res.render('getTasks', {
			posts: list,
			currentPage: +page,
			maxPageCount: maxPageCount,
			title: 'All Posts',
		})
	} catch (e) {
		res.status(500).json({
			message: e.message,
			status: 500,
		})
	}
}

export default { post, createPost, getTasks }
