const express = require(`express`)
const app = express()

app.use(express.json())

const attendanceController = require(`../controllers/attendance.controller`)
const { authorize } = require(`../controllers/auth.controller`)

let { validateAttendanceInput } = require(`../middlewares/attendance.validation`)

app.post("/", [authorize, validateAttendanceInput], attendanceController.recordAttendance)

app.get("/find/:id_user", [authorize], attendanceController.getHistory)
app.get("/summary/:id_user", [authorize], (request, response) => {
    const { id_user } = request.params
    const { month, year } = request.query
    attendanceController.getSummary(request, response, id_user, month, year)
})

app.get("/analysis", [authorize], attendanceController.getAnalysis)

module.exports = app