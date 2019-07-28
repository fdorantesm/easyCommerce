import conekta from 'libraries/conekta';

const api = {
  customer: {},
  order: {},
  card: {},
};

api.customer.create = async (params) => {
  const customer = await conekta.Customer.create(params);
  return customer;
};

api.customer.all = async () => {
  const clientes = await conekta.Customer.find();
  if (clientes.toObject().total) {
    return clientes;
  }

  const err = new Error('Bad Request');
  err.status = 400;
  err.text = 'NotFound';
  throw err;
};

export default api;
