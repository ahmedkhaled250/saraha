import { Router } from "express";
import { auth } from "../../middlewear/auth.js";
import { validation } from "../../middlewear/validate.js";
import * as validators from './auth.validate.js'
import * as aController from './controller/auth.js'
const router = Router()
router.get('/confirmemail/:token',validation(validators.token),aController.confirmEmail)
router.get('/requestreftoken/:token',validation(validators.token),aController.requestreftoken)
router.post('/signup',validation(validators.signup),aController.signup)
router.post('/signin',validation(validators.signin),aController.signin)
router.patch('/logout',validation(validators.logOut),auth(),aController.logOut)
router.post('/sendcode',validation(validators.sendCode),aController.sendCode)
router.patch('/forgetpassword',validation(validators.forgetPssword),aController.forgetPssword)
export default router