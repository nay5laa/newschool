const userModel = require(`../models/index`).users
const Op = require(`sequelize`).Op
const md5 = require(`md5`)

exports.getUser = async (request, response) => {
    try {
      const idUser = request.params.id
      let dataUser = await userModel.findByPk(idUser)

      if (!dataUser) {
        return response.status(404).json({
          success: false,
          message: `User with ID ${idUser} not found`,
        })
      }
  
      dataUser = {
        id: dataUser.id,
        name: dataUser.name,
        username: dataUser.username,
        role: dataUser.role,
      }
  
      return response.json({
        success: true,
        data: dataUser,
        message: `User has been loaded`,
      })
    }
    
    catch (error) {
      console.error(error);
      return response.status(500).json({
        success: false,
        message: 'An error occurred while loading the user',
      })
    }
  }
  

exports.findUser = async (request, response) => {
    let keyword = request.body.keyword
    let users = await userModel.findAll({
        where: {
            [Op.or]: [
                { name: { [Op.susbtring]: keyword } },
                { username: { [Op.susbtring]: keyword } },
                { role: { [Op.susbtring]: keyword } }
            ]
        }
    })

    return response.json({
        success: true,
        data: users,
        message: `All users have been loaded`
    })
}

exports.addUser = (request, response) => {
    let newUser = {
        name: request.body.name,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role
    }

    userModel.create(newUser)
        .then(result => {
            return response.json({
                success: true,
                data: result,
                message: `New user has been inserted`
            })
        })

        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

exports.updateUser = (request, response) => {
    let dataUser = {
        name: request.body.name,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role
    }

    let idUser = request.params.id

    userModel.update(dataUser, { where: { id: idUser } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data user has been updated`,
                data: dataUser
            })
        })

        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

exports.deleteUser = (request, response) => {
    let idUser = request.params.id
    userModel.destroy({ where: { id: idUser } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data user has been deleted`
            })
        })

        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}