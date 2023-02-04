import { Router } from "express";
import { auth } from "../../middlewear/auth.js";
import {validation} from '../../middlewear/validate.js'
import * as validators from './user.validate.js'
import * as uController from './controller/user.js'
const router = Router()
router.get('/',uController.getAllUser)
router.get('/profile',validation(validators.token),auth(),uController.profile)
router.get('/sharelinkprofile/:id',validation(validators.token),uController.sharelinkprofile)
router.get('/shareprofile',validation(validators.token),auth(),uController.shareprofile)
router.put('/profile',validation(validators.updateProfile),auth(),uController.updateProfile)
router.patch('/',validation(validators.updatePassword),auth(),uController.updatePassword)
router.delete('/',validation(validators.token),auth(),uController.deleteProfile)
router.patch('/softdelete',validation(validators.token),auth(),uController.softdelete)
export default router