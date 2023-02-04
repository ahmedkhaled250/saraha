import { Router } from "express";
import { auth } from "../../middlewear/auth.js";
import {validation} from '../../middlewear/validate.js'
import * as validators from './message.validate.js'
import * as mController from './controller/message.js'
const router = Router()
router.get('/',validation(validators.token),auth(),mController.getAllMessages)
router.get('/:messageId',validation(validators.sendMessageAndToken),auth(),mController.messagebyid)
router.post('/:recievedId',validation(validators.sendMessage),mController.sendMessage)
router.delete('/:messageId',validation(validators.sendMessageAndToken),auth(),mController.deleteMessage)
router.patch('/:messageId',validation(validators.sendMessageAndToken),auth(),mController.softDeleteMessage)
export default router