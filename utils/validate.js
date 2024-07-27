import Joi from 'joi'

const taskSchema = Joi.object({
	title: Joi.string()
		.min(3)
		.max(100)
		.required()
		.pattern(/^([a-zA-Z0-9]( )?)+$/)
		.messages({
			'string.base': 'Title field must be a string',
			'string.empty': 'Title field is required',
			'string.min': 'Title must be at least {#limit} characters long',
			'string.max': 'Title cannot exceed {#limit} characters',
			'any.required': 'Title field is required (min 3, max 100 characters)',
			'string.pattern.base':
				'Invalid description value: allow only text, number, and space (max space count between word is one space)',
		}),
	description: Joi.string()
		.min(3)
		.max(5000)
		.required()
		.pattern(/^([a-zA-Z0-9]( )?)+$/)
		.messages({
			'string.base': 'Description field must be a string',
			'string.empty': 'Description field is required',
			'string.min': 'Description must be at least {#limit} characters long',
			'string.max': 'Description cannot exceed {#limit} characters',
			'any.required': 'Description field is required',
			'string.pattern.base':
				'Invalid description value: allow only text, number, and space (max space count between word is one space)',
		}),
	taskDate: Joi.date().iso().greater('now').required().messages({
		'date.base': 'Task date must be a valid date',
		'date.isoDate': 'Invalid date format: YYYY-mm-dd',
		'date.greater': 'Please provide a future date',
		'any.required': 'Task date is required',
	}),
})

const pageSchema = Joi.object({
	page: Joi.number()
		.integer()
		.min(1)
		.max(99999)
		.default(1)
		.required()

		.messages({
			'number.base': 'Page param must be a number',
			'number.integer': 'Page param must be an integer',
			'number.min': 'Page param must be at least {#limit}',
			'number.max': 'Page param cannot exceed {#limit}',
			'any.required': 'Page param is required',
		}),
})

function createTask(req) {
	const { error, value } = taskSchema.validate(req.body, {
		abortEarly: false,
	})

	if (error) {
		const fields = {}
		error.details.forEach(detail => {
			console.log(detail)
			fields[detail.path[0]] = detail.message
		})

		return {
			fields,
			haveErrors: true,
		}
	}

	return {
		fields: {},
		haveErrors: false,
	}
}

function getTasks(req) {
	const { error } = pageSchema.validate(req.query, {
		abortEarly: false,
	})

	if (error) {
		const fields = {}

		error.details.forEach(detail => {
			console.log(detail)
			fields[detail.path[0]] = detail.message
		})

		return {
			fields,
			haveErrors: true,
		}
	}

	return {
		fields: {},
		haveErrors: false,
	}
}

export default { createTask, getTasks }
