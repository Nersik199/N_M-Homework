import Joi from 'joi'

const taskSchema = Joi.object({
	title: Joi.string()
		.min(3)
		.max(100)
		.required()
		.pattern(/^([a-zA-Z0-9]( )?)+$/)
		.messages(),
	description: Joi.string()
		.min(3)
		.max(5000)
		.required()
		.pattern(/^([a-zA-Z0-9]( )?)+$/)
		.messages(),
	taskDate: Joi.date().iso().greater('now').required(),
	userId: Joi.string().uuid().required(),
})

const updateSchema = Joi.object({
	title: Joi.string()
		.min(3)
		.max(100)
		.required()
		.pattern(/^([a-zA-Z0-9]( )?)+$/)
		.messages(),
	description: Joi.string()
		.min(3)
		.max(5000)
		.required()
		.pattern(/^([a-zA-Z0-9]( )?)+$/)
		.messages(),
	taskDate: Joi.date().iso().greater('now').required(),
	userId: Joi.string().uuid().required(),
	id: Joi.string().uuid().required(),
})

const schemaRegister = Joi.object({
	fName: Joi.string().min(1).max(50).required().messages(),
	lName: Joi.string().min(1).max(50).required().messages(),
	email: Joi.string().email().required().messages(),
	password: Joi.string().min(8).required().messages(),
})

const schemaLogin = Joi.object({
	email: Joi.string().email().required().messages(),
	password: Joi.string().min(8).required().messages(),
})

export function examinationTask(req) {
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
export function examinationUpdate(req) {
	const { error, value } = updateSchema.validate(req.body, {
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

export function examinationRegister(req) {
	const { error, value } = schemaRegister.validate(req.body, {
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

export function examinationLogin(req) {
	const { error, value } = schemaLogin.validate(req.body, {
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
