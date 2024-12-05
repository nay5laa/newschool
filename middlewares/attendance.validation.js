const Joi = require(`joi`)

const validateAttendanceInput = (request, response, next) => {
    const schema = Joi.object({
        id_user: Joi.number().integer().required(),
        date: Joi.date().iso().required(),
        time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).required(),
        status: Joi.string()
            .valid(`hadir`, `tidak hadir`, `izin`, `sakit`, `alpa`)
            .required()
    })

    .options({ abortEarly: false })

    const { error } = schema.validate(request.body)

    if (error) {
        const errMessage = error.details.map(detail => detail.message).join(`, `)
        return response.status(422).json({
            success: false,
            message: errMessage
        })
    }

    next()
}

module.exports = { validateAttendanceInput }