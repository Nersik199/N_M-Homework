import { v4 as uuid } from 'uuid'

const users = []
function register(req, res, next) {
	res.render('register', {
		title: 'register',
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

const fromRegister = (req, res) => {
	try {
		const { name, email, password } = req.body

		if (users.some(user => user.email === email)) {
			return res.render('register', {
				errorMessage: 'Email already exists',
			})
		}
		const newData = { id: uuid(), name, email, password }
		users.push(newData)

		console.log('Registration data:', newData)
		res.redirect('/')
	} catch (error) {
		res.status(404).json({ message: e.message, status: 404 })
	}
}

const fromLogin = (req, res) => {
	try {
		const { email, password } = req.body

		const user = users.find(
			user => user.email === email && user.password === password
		)
		if ((!email && !password) || !email || !password) {
			return res.render('register', {
				errorMessage: 'Please provide email and password',
			})
		}

		if (user) {
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
		res.status(404).json({ message: e.message, status: 404 })
	}
}

export default { register, fromRegister, fromLogin, home }
