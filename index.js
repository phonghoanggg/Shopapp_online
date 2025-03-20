import express from 'express'
import dotenv from 'dotenv'
import {AppRoute} from './AppRoute'

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true})) // Corrected line

AppRoute(app)

const port  = process?.env?.PORT ?? 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})