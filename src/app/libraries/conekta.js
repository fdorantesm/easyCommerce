import conekta from 'conekta';

conekta.locale = process.env.CONEKTA_LOCALE;
conekta.api_key = process.env.CONEKTA_PRIVATE;

export default {

  Customer: {

    async create(params) {
      const data = {};
      data.name = params.name;
      data.email = params.email;
      data.phone = params.phone;

      if (params.contacts) {
        data.shipping_contacts = params.contacts;
      }

      const customer = await conekta.Customer.create(data);
      return customer;
    },

    async all() {
      const customers = await conekta.Customer.find();
      return customers;
    },

    async get(id) {
      return await conekta.Customer.find(id);
    },

  },

  Card: {

    create: async (customer, token) => {
      return await customer.createPaymentSource({
        type: 'card',
        token_id: token,
      });
    },

    remove: async (customer, token) => {
      try {
        if (customer.payment_sources) {
          const cards = customer.payment_sources.toObject();
          const index = cards.data.findIndex((card) => card.id == token);
          console.log(index);
          if (index >= 0) {
            const removed = await customer.payment_sources.get(index).delete();
            return removed;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

  },

  Plan: {

  }

};

/**
 * Conekta Customer Class
 */
export class Customer {
  /**
   * Create customer method
   * @param {Object} params
   * @return {Customer}
   */
  static async create(params) {
    const data = {};
    data.name = params.name;
    data.email = params.email;
    data.phone = params.phone;

    if (params.contacts) {
      data.shipping_contacts = params.contacts;
    }

    const customer = await conekta.Customer.create(data);
    return customer;
  }

  /**
   * Get all customers from conekta
   * @return {Array}
   */
  static async all() {
    const customers = await conekta.Customer.find();
    return customers;
  }

  /**
   * Get a single customer from conekta
   * @param {String} id
   * @return {Promise}
   */
  static async get(id) {
    return await conekta.Customer.find(id);
  }
}

/**
 * Plan class
 */
export class Plan {}

/**
 * Card Class
 */
export class Card {
  /**
   * Create card method
   * @param {String} customer
   * @param {String} token
   */
  static async create(customer, token) {
    return await customer.createPaymentSource({
      type: 'card',
      token_id: token,
    });
  }

  /**
   * Remove card method
   * @param {String} customer
   * @param {String} token
   */
  static async remove(customer, token) {
    try {
      if (customer.payment_sources) {
        const cards = customer.payment_sources.toObject();
        const index = cards.data.findIndex((card) => card.id == token);
        console.log(index);
        if (index >= 0) {
          const removed = await customer.payment_sources.get(index).delete();
          return removed;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * Order Class
 */
export class Order {
  /**
   * Create charge
   * @param {Object} params
   * @return {Charge}
   */
  static async create(params) {
    try {
      const conektaOrder = {};
      const paymentMethod = {};
      conektaOrder.shipping_lines = [];
      conektaOrder.line_items = [];
      conektaOrder.shipping_contact = {};
      conektaOrder.customer_info = {};

      conektaOrder.line_items = params.products.map((product) => ({
        name: product.name,
        quantity: product.qty,
        unit_price: product.price * 100,
        metadata: product.metadata || {}
      }));

      if (params.discounts) {
        if (params.discounts.length > 0) {
          conektaOrder.discount_lines = params.discounts.map((discount) => {
            discount.amount *= 100;
            return discount;
          });
        }
      }

      conektaOrder.currency = 'MXN';
      conektaOrder.customer_info.customer_id = params.customer.id;
      conektaOrder.metadata = params.metadata;

      if (params.shippings[0].amount > 0) {
        conektaOrder.shipping_lines.push({
          amount: params.shippings[0].amount * 100,
          carrier: process.env.APP_ALIAS
        });
      }

      conektaOrder.shipping_contact.receiver = params.receiver.name;
      conektaOrder.shipping_contact.phone = params.receiver.phone;
      // eslint-disable-next-line max-len
      conektaOrder.shipping_contact.between_streets = params.receiver.address.between_streets;

      conektaOrder.shipping_contact.address = {};
      // eslint-disable-next-line max-len
      conektaOrder.shipping_contact.address.street1 = params.receiver.address.street;
      // eslint-disable-next-line max-len
      conektaOrder.shipping_contact.address.street2 = params.receiver.address.reference;
      // eslint-disable-next-line max-len
      // eslint-disable-next-line max-len
      conektaOrder.shipping_contact.address.residential = params.receiver.address.residential;
      // eslint-disable-next-line max-len
      conektaOrder.shipping_contact.address.city = params.receiver.address.city;
      // eslint-disable-next-line max-len
      conektaOrder.shipping_contact.address.postal_code = params.receiver.address.zip.toString();
      // eslint-disable-next-line max-len
      conektaOrder.shipping_contact.address.country = params.receiver.address.country;
      conektaOrder.shipping_contact.address.object = 'shipping_address';
      // eslint-disable-next-line max-len
      paymentMethod.type = params.payment_method.type === 'oxxo' ? 'oxxo_cash' : params.payment_method.type === 'spei' ? 'spei' : 'card';

      if (paymentMethod.type === 'card') {
        paymentMethod.token_id = params.payment_method.token;
      } else {
        paymentMethod.expires_at = params.payment_method.expires_at;
      }

      const order = await conekta.Order.create(conektaOrder);
      // eslint-disable-next-line max-len
      const charge = await order.createCharge({payment_method: paymentMethod});

      return {
        order,
        charge
      };
    } catch (err) {
      throw err;
    }
  }
}
