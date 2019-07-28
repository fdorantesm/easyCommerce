import Router from 'router';

const APP_NAME = process.env.APP_NAME;

// eslint-disable-next-line new-cap
const router = Router();

// Routes
import auth from 'routes/auth';
import test from 'routes/test';

router.get('/', async (req, res) => {
  res.render('index', {app: APP_NAME});
});

router.use('/auth', auth);
router.use('/test', test);

export default router;
