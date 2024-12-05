const express = require(`express`)
const app = express()
const PORT = 8000
const cors = require(`cors`)

app.use(cors())

const userRoute = require(`./routes/user.route`)
const attendanceRoute = require(`./routes/attendance.route`)
const auth = require(`./routes/auth.route`)

app.use(`/user`, userRoute)
app.use(`/present`, attendanceRoute)
app.use(`/auth`, auth)

app.listen(PORT, () => {
    console.log(`Server of School's Present runs on port ${PORT}`)
})

app.listen()