import { Router } from "express";
import {login} from '../auth/loginControlleur.js'

const routeLogin = Router()

routeLogin.post('/', login)

export {routeLogin}