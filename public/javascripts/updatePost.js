const postForm = document.getElementById('task-form')
const confirmation = document.getElementById('confirmation-message')

postForm.addEventListener('submit', async function (event) {
	event.preventDefault()

	const formData = new FormData(this)
	const formObject = {}
	formData.forEach((value, key) => {
		formObject[key] = value
	})

	try {
		const response = await fetch('/updatePost', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formObject),
		})

		if (response.ok) {
			confirmation.classList.remove('hidden')
		}
	} catch (error) {
		console.error('Error:', error)
	}
})
