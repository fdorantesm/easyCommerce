import Router from 'router'

const router = Router()

// Routes
import auth from 'routes/auth'
import test from 'routes/test'

router.get('/', async (req, res) => {
    res.render('index', {app: process.env.APP_NAME})
})

router.use('/auth', auth)
router.use('/test', test)

export default router
