const Conekta = {};
Conekta.locale = 'en';

const CONEKTA_PUBLIC_KEY = process.env.CONEKTA_PUBLIC_KEY;
const CONEKTA_PRIVATE_KEY = process.env.CONEKTA_PRIVATE_KEY;

Conekta.keys = () => {
  return {
    'public': CONEKTA_PUBLIC_KEY,
    'private': CONEKTA_PRIVATE_KEY,
  };
};

export default Conekta;
