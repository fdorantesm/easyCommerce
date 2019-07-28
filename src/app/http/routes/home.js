import Router from 'router';

// eslint-disable-next-line new-cap
const router = Router();

router.get('/', (req, res) => {
  const data = {
    title: process.env.APP_NAME,
  };
  res.render('index', data);
});

router.get('/me', (req, res) => {
  res.send({name: 'Fer'});
});

export default router;
