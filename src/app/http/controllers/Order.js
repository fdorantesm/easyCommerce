import moment from 'libraries/moment';
import {Order as ConektaOrder} from 'libraries/conekta';
import Order from 'models/Order';
import Payment from 'models/Payment';
import Delivery from 'models/Delivery';

/**
 * Order Controller
 */
export default class OrderController {
  /**
   * Create order
   * @param {Request} req
   * @param {Response} res
   */
  static async create(req, res) {
    const cart = req.cart;
    // eslint-disable-next-line max-len
    const payBefore = moment().startOf('hour').add(1, 'hour').add(7, 'day').hours(20);

    if (cart.total === 0) {
      return res.boom.conflict(res.__('The cart amount is not greater than 0'));
    }

    if (cart.total > 10000 && req.body.method === 'oxxo') {
      // eslint-disable-next-line max-len
      return res.boom.conflict(res.__('The maximum cash amount is $10,000 pesos, try again using SPEI method.'));
    }

    if (cart.total > 5000 && req.body.method === 'card') {
      // eslint-disable-next-line max-len
      return res.boom.conflict(res.__('The maximum card amount is $5,000 pesos, try again using SPEI method.'));
    }

    if (cart.total > 9999999 && req.body.method === 'spei') {
      // eslint-disable-next-line max-len
      return res.boom.conflict(res.__(`The maximum SPEI amount is $9'999,999 pesos.`));
    }

    try {
      const orderParams = {};
      orderParams.products = cart.content;
      orderParams.discounts = [
        // {
        //   code: 'Youtube',
        //   amount: 999,
        //   type: 'campaign'
        // },
        {
          code: 'freeShipping',
          amount: 150,
          type: 'coupon'
        },
        // {
        //   code: 'perdonanos',
        //   amount: 200,
        //   type: 'loyalty'
        // },
        // {
        //   code: 'agostolocochon',
        //   amount: 100,
        //   type: 'coupon'
        // }
      ];

      orderParams.customer = {
        id: req.user.profile.conekta
      };

      orderParams.metadata = {};

      Object.keys(req.headers).map((header) => {
        if (header.toLowerCase() !== 'authorization') {
          orderParams.metadata[header] = req.headers[header];
        }
      });

      orderParams.shippings = [{
        amount: 150
      }];

      orderParams.receiver = {
        // eslint-disable-next-line max-len
        name: req.body.to_receiver_name || `${req.user.profile.firstName} ${req.user.profile.firstName}`,
        phone: req.body.to_receiver_phone || req.user.profile.phone,
        address: {
          // eslint-disable-next-line max-len
          street: `${req.body.to_address_line1} ${req.body.to_address_line2} ${req.body.to_address_line3}`,
          reference: req.body.to_address_references,
          city: req.body.to_address_city,
          state: req.body.to_address_state,
          zip: req.body.to_address_zip,
          country: 'MX',
          between_streets: req.body.to_address_between_streets,
          residential: req.body.to_address_residential
        }
      };

      orderParams.payment_method = {
        type: req.body.method
      };

      if (req.body.method === 'card') {
        orderParams.payment_method.token = req.body.token;
      }

      if (['oxxo', 'spei'].includes(req.body.method)) {
        // eslint-disable-next-line max-len
        orderParams.payment_method.expires_at = payBefore.unix();
      }

      const conekta = await ConektaOrder.create(orderParams);

      const orderData = {};
      orderData.customer = req.user._id;
      orderData.subtotal = cart.subtotal;
      orderData.total = cart.total;
      orderData.gatewayCustomerId = req.user.profile.conekta;

      orderData.gatewayOrderId = conekta.order._id;
      orderData.bill = req.body.bill;
      orderData.gift = req.body.gift;
      orderData.products = cart.content.map((item) => ({
        _id: item.id,
        price: item.price,
        qty: item.qty
      }));
      const orderDB = new Order(orderData);
      await orderDB.save();

      const paymentData = {};
      paymentData.gatewayChargeId = conekta.charge.id;
      paymentData.status = conekta.charge.status;
      paymentData.amount = conekta.charge.amount / 100;
      paymentData.fee = conekta.charge.fee / 100;
      paymentData.method = req.body.method;
      paymentData.order = orderDB._id;

      if (['oxxo', 'spei'].includes(req.body.method)) {
        paymentData.referenceExpiration = payBefore;
      }

      if (req.body.method === 'spei') {
        // eslint-disable-next-line max-len
        paymentData.receivingAccountBank = conekta.charge.payment_method.receiving_account_bank;
        // eslint-disable-next-line max-len
        paymentData.receivingAccountNumber = conekta.charge.payment_method.receiving_account_number;
        paymentData.clabe = conekta.charge.payment_method.clabe;
      }

      if (req.body.method === 'oxxo') {
        paymentData.reference = conekta.charge.payment_method.reference;
      }

      if (req.body.method === 'card') {
        paymentData.paidAt = moment();
      }

      const paymentDB = new Payment(paymentData);
      await paymentDB.save();

      const deliveryData = {};

      // From delivery
      deliveryData.from = {};
      deliveryData.from.address = {};
      deliveryData.from.location = {};
      deliveryData.from.location.coordinates = {};
      deliveryData.from.sender = {};

      deliveryData.from.address.line1 = req.body.from_address_line1;
      deliveryData.from.address.line2 = req.body.from_address_line2;
      deliveryData.from.address.line3 = req.body.from_address_line3;
      // eslint-disable-next-line max-len
      deliveryData.from.address.betweenStreets = req.body.from_address_between_streets;
      deliveryData.from.address.references = req.body.from_address_references;
      deliveryData.from.address.line3 = req.body.from_address_line3;
      deliveryData.from.address.zip = req.body.from_address_zip;
      deliveryData.from.address.city = req.body.from_address_city;
      deliveryData.from.address.state = req.body.from_address_state;
      deliveryData.from.address.country = req.body.from_address_country;

      deliveryData.from.location.type = 'Point';
      // eslint-disable-next-line max-len
      deliveryData.from.location.coordinates = [Number(req.body.from_longitude), Number(req.body.from_latitude)];

      deliveryData.from.sender.name = req.body.from_sender_name;
      deliveryData.from.sender.phone = req.body.from_sender_phone;

      // To Delivery
      deliveryData.to = {};
      deliveryData.to.address = {};
      deliveryData.to.location = {};
      deliveryData.to.location.coordinates = {};
      deliveryData.to.sender = {};
      deliveryData.to.receiver = {};

      deliveryData.to.address.line1 = req.body.to_address_line1;
      deliveryData.to.address.line2 = req.body.to_address_line2;
      deliveryData.to.address.line3 = req.body.to_address_line3;
      // eslint-disable-next-line max-len
      deliveryData.to.address.betweenStreets = req.body.to_address_between_streets;
      deliveryData.to.address.references = req.body.to_address_references;
      deliveryData.to.address.zip = req.body.to_address_zip;
      deliveryData.to.address.city = req.body.to_address_city;
      deliveryData.to.address.state = req.body.to_address_state;
      deliveryData.to.address.country = req.body.to_address_country;

      deliveryData.to.location.type = 'Point';
      // eslint-disable-next-line max-len
      deliveryData.to.location.coordinates = [Number(req.body.to_longitude), Number(req.body.to_latitude)];

      deliveryData.to.receiver.name = req.body.to_receiver_name;
      deliveryData.to.receiver.phone = req.body.to_receiver_phone;

      deliveryData.amount = 150;
      deliveryData.carrier = 'redpack';
      deliveryData.type = req.body.shipping_type;
      deliveryData.secured = req.body.shipping_secured;
      deliveryData.order = orderDB._id;

      const deliveryDB = new Delivery(deliveryData);
      await deliveryDB.save();

      // eslint-disable-next-line max-len
      const attachPaymentAndDelivery = await Order.findById(orderDB._id);
      attachPaymentAndDelivery.payments.push(paymentDB._id);
      attachPaymentAndDelivery.deliveries.push(deliveryDB._id);
      await attachPaymentAndDelivery.save();

      await cart.clear();

      // eslint-disable-next-line max-len
      res.status(201).send({
        payment: paymentDB,
        order: attachPaymentAndDelivery,
        delivery: deliveryDB
      });
    } catch (err) {
      console.log(err);
      res.boom.badData(err);
    }
  }

  /**
   * Get single order
   * @description Returns order entry
   * @param {Request} req
   * @param {Response} res
   */
  static async getOrder(req, res) {
    try {
      // eslint-disable-next-line max-len
      const fields = ['total', 'products', 'deliveries', 'payments', 'customer', 'status', 'gift', 'createdAt', 'updatedAt'];
      // eslint-disable-next-line max-len
      const order = await Order.findById(req.params.order).populate([
        {
          path: 'payments',
          select: ['status', 'method', 'amount', 'currency', 'paidAt'],
        },
        {
          path: 'deliveries',
          select: ['from', 'to', 'status', 'amount', 'carrier']
        },
        {
          path: 'products._id'
        },
        {
          path: 'customer',
          select: ['profile'],
          populate: {
            path: 'profile',
            select: ['firstName', 'lastName']
          }
        }
      ]).select(fields);
      res.send({
        data: order
      });
    } catch (err) {
      res.boom.badData(err);
    }
  }

  /**
   * Get orders
   * @param {Request} req
   * @param {Response} res
   */
  static async getAll(req, res) {
    try {
      const orders = await Order.paginate({}, {page: req.query.page || 1});
      res.send({
        data: orders
      });
    } catch (err) {
      res.boom.badData(err);
    }
  }
}
