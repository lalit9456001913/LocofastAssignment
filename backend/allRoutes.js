const controller = require('./controllers')
const middlewares = require('./allMiddlewares')
const express = require('express')
const swaggerJSDoc = require('swagger-jsdoc')
const router = express.Router()
const app=express()





/**
 * @swagger
 * definitions:
 *   Login:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 */

 
/**
 * @swagger
 * /login:
 *    post:
 *      description: login
 *      parameters:
 *        - in: body
 *          name: body
 *          required: true
 *          schema:
 *            $ref: '#/definitions/Login'
 *      responses:
 *         "200":
 *          description: success response
 *          schema:
 *            $ref: '#/definitions/User'
 *         "403":
 *          description: error
 *         "500":
 *          description: internal server error
 */


 router.post('/login',controller.login)
/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       apiKey:
 *         type: string
 *       role:
 *         type: string
 *       requestLimit:
 *         type: number
 */
/**
 * @swagger
 * definitions:
 *   updateUser:
 *     type: object
 *     properties:
 *       user:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *           username:
 *             type: string
 *           password:
 *             type: string
 *           email:
 *             type: string
 *           role:
 *             type: string
 *           requestLimit:
 *             type: number
 */

/**
 * @swagger
 * definitions:
 *   createUser:
 *     type: object
 *     properties:
 *       user:
 *         type: object
 *         properties:
 *           username:
 *             type: string
 *           password:
 *             type: string
 *           email:
 *             type: string
 *           role:
 *             type: string
 *           requestLimit:
 *             type: number
 */






/**
 * @swagger
 * definitions:
 *   blogPost:
 *     type: object
 *     properties:
 *       _id: 
 *          type: string
 *       title:
 *          type: string
 *       author:
 *          type: string
 *       content:
 *          type: string
 *          
 */

/**
 * @swagger
 * definitions:
 *   updateBlog:
 *     type: object
 *     properties:
 *       blog:
 *         type: object
 *         properties:
 *           _id: 
 *             type: string
 *           title:
 *             type: string
 *           author:
 *             type: string
 *           content:
 *             type: string
 *          
 */

/**
 * @swagger
 * definitions:
 *   blogId:
 *     type: object
 *     properties:
 *       blogId: 
 *          type: string
 */

/**
 * @swagger
 * definitions:
 *   blogPosts:
 *     type: array
 *     items:
 *       type: object
 *       properties:
 *         _id: 
 *            type: string
 *         title:
 *           type: string
 *         author:
 *           type: object
 *           properties:
 *             _id: 
 *                type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             role: 
 *               type: string
 *             requestLimit:
 *               type: string
 *             apiKey:
 *               type: string
 *         content:
 *           type: string
 *          
 */

/**
 * @swagger
 * definitions:
 *   apirequest:
 *     type: object
 *     properties:
 *       _id: 
 *          type: string
 *       apiKey:
 *          type: string
 *       hitTime:
 *          type: string
 *       userId:
 *          type: string
 *          
 */




 



/**
 * @swagger
 * /searchBlog/{search}:
 *    get:
 *      description: search Blog
 *      parameters:
 *        - name: x-auth-token
 *          in: header
 *        - name: search
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *         "200":
 *          description: success response
 *          schema:
 *            $ref: '#/definitions/blogPosts' 
 *         "403":
 *          description: error
 *         "500":
 *          description: internal server error
 */


router.get('/searchBlog/:search',middlewares.verifyUser,controller.search)


/**
 * @swagger
 * /logout:
 *    get:
 *      description: logout
 *      responses:
 *         "200":
 *          description: success response
 *         "403":
 *          description: error
 *         "500":
 *          description: internal server error
 */


router.get('/logout',controller.logout)

/**
 * @swagger
 * /updateUser:
 *    post:
 *      description: update User
 *      parameters:
 *        - name: x-auth-token
 *          in: header
 *        - in: body
 *          name: body
 *          required: true
 *          schema:
 *            $ref: '#/definitions/updateUser'
 *      responses:
 *         "200":
 *          description: updated object after success
 *          schema:
 *            $ref: '#/definitions/User' 
 *         "403":
 *          description: error
 *         "500":
 *          description: internal server error
 */

router.post('/updateUser',middlewares.verifyUser,controller.updateUser)
/**
 * @swagger
 * /getAllBlogs/{userId}:
 *    get:
 *      description: get all blogs
 *      parameters:
 *        - name: x-auth-token
 *          in: header
 *        - name: userId
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *         "200":
 *          description: success response
 *          schema:
 *            $ref: '#/definitions/blogPosts'
 *         "403":
 *          description: error
 *         "500":
 *          description: internal server error
 */
router.get('/getAllBlogs/:userId',middlewares.verifyUser,controller.getAllBlogs)


/**
 * @swagger
 * /createUser:
 *    post:
 *      description: update User
 *      parameters:
 *        - in: body
 *          name: blog
 *          required: true
 *          schema:
 *            $ref: '#/definitions/createUser'
 *      responses:
 *         "200":
 *          description: created object after success
 *          schema:
 *            $ref: '#/definitions/User' 
 *         "403":
 *          description: error
 *         "500":
 *          description: internal server error
 */
router.post('/createUser',middlewares.verifyUser,controller.createUser)
/**
 * @swagger
 * /getAllUserBlogsUsingApiKey:
 *    get:
 *      description: get all blogs using apikey
 *      parameters:
 *        - name: x-auth-token
 *          in: header
 *        - name: apiKey
 *          in: header
 *          required: true
 *      responses:
 *         "200":
 *          description: success response
 *          schema:
 *            $ref: '#/definitions/blogPosts'
 *         "403":
 *          description: error
 *         "500":
 *          description: internal server error
 */

router.get('/getAllUserBlogsUsingApiKey',middlewares.verifyUser,controller.getAllUserBlogsUsingApiKey)



/**
 * @swagger
 * /getOneBlog/{blogId}:
 *    get:
 *      description: get one Blog
 *      parameters:
 *        - name: x-auth-token
 *          in: header
 *        - name: blogId
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *         "200":
 *          description: success response
 *          schema:
 *            $ref: '#/definitions/blogPost' 
 *         "403":
 *          description: error
 *         "500":
 *          description: internal server error
 */

router.get('/getOneBlog/:blogId',middlewares.verifyUser,controller.getOneBlog)

/**
 * @swagger
 * /updateBlog:
 *    post:
 *      description: get one Blog
 *      parameters:
 *        - name: x-auth-token
 *          in: header
 *        - in: body
 *          name: blog
 *          required: true
 *          schema:
 *            $ref: '#/definitions/updateBlog'
 *      responses:
 *         "200":
 *          description: updated object after success
 *          schema:
 *            $ref: '#/definitions/blogPost' 
 *         "403":
 *          description: error
 *         "500":
 *          description: internal server error
 */

router.post('/updateBlog',middlewares.verifyUser,controller.updateBlog)


/**
 * @swagger
 * /deleteBlog:
 *    delete:
 *      description: delete a Blog
 *      parameters:
 *        - name: x-auth-token
 *          in: header
 *        - in: body
 *          name: body
 *          required: true
 *          schema:
 *            $ref: '#/definitions/blogId'
 *      responses:
 *         "200":
 *          description: delete object after success
 *         "403":
 *          description: error
 *         "500":
 *          description: internal server error
 */




router.delete('/deleteBlog',middlewares.verifyUser,controller.deleteBlog)

/**
 * @swagger
 * definitions:
 *   requestLimit:
 *     type: object
 *     properties:
 *       userId: 
 *         type: string
 *       requestLimit:
 *         type: number
 */



/**
 * @swagger
 * /updateRequestLimit:
 *    post:
 *      description: update request limit
 *      parameters:
 *        - name: x-auth-token
 *          in: header
 *        - in: body
 *          name: blog
 *          required: true
 *          schema:
 *            $ref: '#/definitions/requestLimit'
 *      responses:
 *         "200":
 *          description: updated object after success
 *          schema:
 *            $ref: '#/definitions/User' 
 *         "403":
 *          description: error
 *         "500":
 *          description: internal server error
 */

router.post('/updateRequestLimit',middlewares.verifyUser,controller.updateRequestLimit)

module.exports = router;