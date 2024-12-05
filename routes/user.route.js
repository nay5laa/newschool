const express = require(`express`)
const app = express()

app.use(express.json())

const userController = require(`../controllers/user.controller`)
// const { midSimple } = require(`../middlewares/simple-middleware`)
const { authorize } = require(`../controllers/auth.controller`)
let { validateUser } = require(`../middlewares/user.validation`)

app.get("/:id", userController.getUser)
// app.get("/", [midSimple], userController.getAllUser)
app.get("/:id", [authorize], userController.getUser)

app.post("/", userController.addUser)
app.post("/", [validateUser], userController.addUser)
app.post("/", [authorize], userController.addUser)

app.post("/", userController.findUser)
app.post("/", [authorize], userController.findUser)

app.put("/:id", userController.updateUser)
app.put("/:id", [validateUser], userController.updateUser)
app.put("/:id", [authorize], userController.updateUser)

app.delete("/:id", userController.deleteUser)
app.delete("/:id", [authorize], userController.deleteUser)

module.exports = app