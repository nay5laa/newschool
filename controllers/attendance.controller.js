const { attendances, users, Sequelize } = require(`../models`)
const { Op, sequelize } = require(`sequelize`)
const user = require("../models/users").users
const attendance = require("../models/attendances").attendances

exports.recordAttendance = async (request, response) => {
        try {
            const { id_user, date, time, status } = request.body
            const user = await users.findByPk(id_user)

            if (!user) {
                return response.status(404).json({
                    success: false,
                    message: `User not found`
                })
            }

            const attendance = await attendances.create({ id_user,  date, time, status })
            return response.status(201).json({
                success: true,
                message: `Attendance success`,
                data: attendance
            })
        }

        catch (error) {
            console.error(error)
            return response.status(500).json({
                success: false,
                message: `There's something wrong from the server`,
                error: error.message
            })
        }
}

exports.getHistory = async (request, response) => {
        try {
            const { id_user } = request.params
            const user = await users.findByPk(id_user)

            if (!user) {
                return response.status(404).json({
                    success: false,
                    message: `User not found`
                })
            }

            const history = await attendances.findAll({
                where: { id_user },
                order: [['date', 'DESC'], ['time', 'DESC']]
            })

            if (history.length === 0) {
                return response.status(404).json({
                    success: false,
                    message: `Attendance history not found`
                })
            }

            return response.status(200).json({
                success: true,
                data: history
            })
        }

        catch (error) {
            console.error(error)
            return response.status(500).json({
                success: false,
                message: `There's something wrong from the server`,
                error: error.message
            })
        }
}

exports.getSummary = async (request, response) => {
        try {
            const { id_user } = request.params
            let { month, year } = request.query

            month = month.trim()
            year = year.trim()

            if (!month || !year) {
                return response.status(400).json({
                    success: false,
                    message: `Month and year parameter needed`
                })
            }

                const user = await users.findByPk(id_user)
                if (!user) {
                    return response.status(404).json({
                        success: false,
                        message: `User not found`
                    })
                }

                const startDate = `${year}-${month}-01`
                const endDate = `${year}-${month}-31`

                const summary = await attendances.findAll({
                    where: {
                        id_user,
                        date: {
                            [Op.gte]: startDate,
                            [Op.lte]: endDate
                        }
                    }
                })

                const attendanceSummary = {
                    hadir: 0,
                    izin: 0,
                    sakit: 0,
                    alpa: 0
                }

                summary.forEach((record) => {
                    if (record.status === `hadir`){
                        attendanceSummary.hadir++
                    }

                    else if (record.status === `izin`) {
                        attendanceSummary.izin++
                    }

                    else if (record.status === `sakit`) {
                        attendanceSummary.sakit++
                    }

                    else if (record.status === `alpa`) {
                        attendanceSummary.alpa++
                    }
                })

                return response.status(200).json({
                    status: `success`,
                    data: {
                        id_user: id_user,
                        month: `${month}-${year}`,
                        attendanceSummary: attendanceSummary
                    }
                })
        }
        
        catch (error) {
            console.error(error)
            return response.status(500).json({
                success: false,
                message: `There's something wrong from the server`,
                error: error.message
            })
        }
}

exports.getAnalysis = async (request, response) => {
        try {
            const { startDate, endDate, category } = request.body
            
            if (!startDate || !endDate ) {
                return response.status(400).json({
                    success: false,
                    message: `Start date and end date parameter needed`
                })
            }

            const analysis = await attendances.findAll({
                attributes: [
                    `status`,
                    [Sequelize.fn('COUNT', Sequelize.col(`status`)), `count`],
                ],
                
                where: {
                    date: {
                        [Op.between]: [startDate, endDate],
                    }
                },

                include: [
                    {
                        model: users,
                        attributes: [`id`, `role`],
                        where: category ? { role: category } : {},
                    }
                ],

                group: [`status`, `users.role`]
            })

            const groupedAnalysis = analysis.reduce((resullt, record) => {
                const group = record.users.role
                const status = record.users.status

                if (!result [group]) {
                    result [group] = {
                        group,
                        totalUsers: 0,
                        attendanceRate: {
                            hadirPercentage: 0,
                            izinPercentage: 0,
                            sakitPercentage: 0,
                            alpaPercentage: 0
                        },

                        totalAttendance: {
                            hadir: 0,
                            izin: 0,
                            sakit: 0,
                            alpa: 0
                        }
                    }
                }

                result[group].totalAttendance[status.toLowerCase()] += parseInt(record.dataValues.count)
                result[group].totalUsers += 1

                return result
            }, {})

            Object.values(groupedAnalysis).forEach((group) => {
                const total = Object.values(group.totalAttendance).reduce((sum, val) => sum + val, 0)

                if (total > 0) {
                    group.attendanceRate.hadirPercentage = parseFloat((group.totalAttendance.hadir / total * 100).toFixed(2))
                    group.attendanceRate.izinPercentage = parseFloat((group.totalAttendance.izin / total * 100).toFixed(2))
                    group.attendanceRate.sakitPercentage = parseFloat((group.totalAttendance.sakit / total * 100).toFixed(2))
                    group.attendanceRate.alpaPercentage = parseFloat((group.totalAttendance.alpa / total * 100).toFixed(2))
                }
            })

            return response.status(200),json({
                status: `success`,
                data: {
                    analysisPeriod: {
                        startDate,
                        endDate
                    },
                    groupedAnalysis: Object.values(groupedAnalysis),
                }
            })
        }

        catch (error) {
            console.error(error)
            return response.status(500).json({
                success: false,
                message: `There's something wrong from the server`,
                error: error.message
            })
        }
}