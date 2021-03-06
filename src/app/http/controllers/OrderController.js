import moment, {dateformat} from 'libraries/moment';
import {Order as ConektaOrder} from 'libraries/conekta';
import Order from 'models/Order';
import Payment from 'models/Payment';
import Delivery from 'models/Delivery';
import deepPopulate from 'deep-populate';
import OrderProducts from 'models/OrderProducts';
import Coupon from 'models/Coupon';
import casbin from 'libraries/casbin';
import merge from 'lodash/merge';
import Barcode from 'libraries/Barcode';
import PDF from 'libraries/PDF';

/**
 * Order Controller
 */
class OrderController {
  /**
   * Create order
   * @param {Request} req
   * @param {Response} res
   */
  static async create(req, res) {
    console.log('order create');
    const cart = req.cart;
    const shipping = 150;
    const grantTotal = cart.total + shipping;
    let discountable = false;
    let gatewayable = true;
    let conekta;
    let coupon;

    req.body.from_latitude = 19.4328333
    req.body.from_longitude = -99.1331602
    req.body.from_address_line1 = 'Juárez 701'
    req.body.from_address_line3 = 'Centro'
    req.body.from_address_city = 'Cuantémoc'
    req.body.from_address_state = 'Ciudad de México'
    req.body.from_address_country = 'Mexico'
    req.body.from_address_references = 'Edificio verde'
    req.body.from_address_between_streets = 'Oxxo y / 7 eleven'
    req.body.from_address_zip = '02100'
    req.body.from_sender_name = 'Juan Hernandez'
    req.body.from_sender_phone = '+525555555555'
    req.body.amount = 150
    req.body.carrier = 'redpack'
    req.body.type = '2 day'
    req.body.secured = false

    // eslint-disable-next-line max-len
    const payBefore = moment().startOf('hour').add(1, 'hour').add(7, 'day').hours(20);
    try {
      const orderParams = {};
      orderParams.products = cart.content;

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
        amount: shipping
      }];

      orderParams.discounts = [];

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

      if (req.body.coupon) {
        coupon = await Coupon.findOne({code: req.body.coupon});
        if (!coupon) {
          return res.boom.badData(res.__(`The coupon code doesn't exist.`));
        } else if (!coupon.enabled) {
          return res.boom.badData(res.__('The coupons is not available.'));
        } else {
          const redemptions = await Order.count({coupon: coupon._id});
          // eslint-disable-next-line max-len
          const redeptionsByUser = await Order.count({customer: req.user._id, coupon: coupon._id});
          if (redemptions >= coupon.limits.uses && coupon.limits.uses > 0) {
            // eslint-disable-next-line max-len
            return res.boom.badData(res.__('The coupon has reached its redemption limit.'));
          }
          // eslint-disable-next-line max-len
          if (redeptionsByUser >= coupon.limits.user && coupon.limits.user > 0) {
            // eslint-disable-next-line max-len
            return res.boom.badData(res.__('You have used this coupon.'));
          }
          // eslint-disable-next-line max-len
          if (coupon.limits.minimumAmount && coupon.limits.minimumAmount > grantTotal) {
            // eslint-disable-next-line max-len
            return res.boom.badData(res.__(`The minimum amount to apply this coupon is $${coupon.limits.minimumAmount}`));
          }

          discountable = true;
          const discountCoupon = {
            code: coupon.code,
            type: 'coupon',
            amount: 0
          };

          if (coupon.type === 'amount') {
            discountCoupon.amount = coupon.value;
          }

          if (coupon.type === 'percentage') {
            const discountAmount = (cart.total + shipping) * (coupon.value/100);
            // eslint-disable-next-line max-len
            if (coupon.limits.maximumAmount && discountAmount > coupon.limits.maximumAmount && coupon.limits.maximumAmount > 0) {
              discountCoupon.amount = coupon.limits.maximumAmount;
            } else {
              discountCoupon.amount = discountAmount;
            }
          }

          orderParams.discounts.push(discountCoupon);

          if (!(cart.total - discountCoupon.amount > 0)) {
            gatewayable = false;
          }
        }
      }

      const orderData = {};

      if (gatewayable) {
        conekta = await ConektaOrder.create(orderParams);
      }


      orderData.customer = req.user._id;
      orderData.subtotal = cart.subtotal;
      orderData.gatewayCustomerId = req.user.profile.conekta;
      orderData.total = cart.total;

      if (discountable) {
        orderData.coupon = coupon._id;
      }

      if (gatewayable) {
        orderData.gatewayOrderId = conekta.order._id;
      }

      orderData.bill = req.body.bill;
      orderData.gift = req.body.gift;
      orderData.summary = [];
      const orderDB = new Order();

      cart.content.map(async (product) => {
        const orderProduct = new OrderProducts({
          order: orderDB._id,
          product: product.id,
          qty: product.qty,
          price: product.price
        });
        orderData.summary.push(orderProduct._id);
        await orderProduct.save();
      });

      Object.keys(orderData).map((prop) => orderDB[prop] = orderData[prop]);

      await orderDB.save();

      await casbin.assignRole(req.user.id, 'owner', `order:${orderDB._id}`);
      await casbin.createPolicy('owner', `order:${orderDB._id}`, 'order', 'read');
      await casbin.createPolicy('admin', `order:${orderDB._id}`, 'order', 'read');
      await casbin.createPolicy('admin', `order:${orderDB._id}`, 'order', 'update');
      await casbin.createPolicy('admin', `order:${orderDB._id}`, 'order', 'delete');
      await casbin.createPolicy('admin', `order:${orderDB._id}`, 'payment', 'create');
      await casbin.createPolicy('admin', `order:${orderDB._id}`, 'payment', 'read');
      await casbin.createPolicy('admin', `order:${orderDB._id}`, 'payment', 'update');
      await casbin.createPolicy('admin', `order:${orderDB._id}`, 'delivery', 'create');
      await casbin.createPolicy('admin', `order:${orderDB._id}`, 'delivery', 'read');
      await casbin.createPolicy('admin', `order:${orderDB._id}`, 'delivery', 'update');
      await casbin.createPolicy('logistics', `order:${orderDB._id}`, 'order', 'read');
      await casbin.createPolicy('logistics', `order:${orderDB._id}`, 'order', 'update');
      await casbin.createPolicy('logistics', `order:${orderDB._id}`, 'delivery', 'read');
      await casbin.createPolicy('logistics', `order:${orderDB._id}`, 'delivery', 'update');
      await casbin.createPolicy('logistics', `order:${orderDB._id}`, 'payment', 'read');

      const wilds = await casbin.assignRoleWildcardUsers(['admin', 'root', 'logistics'], `order:${orderDB._id}`);

      Promise.all(wilds).then((data) => {
        console.log({data});
      });

      const paymentData = {};
      if (gatewayable) {
        paymentData.gatewayChargeId = conekta.charge.id;
        paymentData.status = conekta.charge.status;
        paymentData.amount = conekta.charge.amount / 100;
        paymentData.fee = conekta.charge.fee / 100;
        paymentData.method = req.body.method;
      } else {
        paymentData.method = 'coupon';
        paymentData.amount = 0;
        paymentData.fee = 0;
        paymentData.status = 'paid';
        paymentData.paidAt = moment();
      }

      paymentData.order = orderDB._id;

      if (gatewayable) {
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

      // await cart.clear();

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
      const fields = ['total', 'summary', 'deliveries', 'payments', 'customer', 'status', 'gift', 'createdAt', 'updatedAt'];
      let order = Order.findById(req.params.order);
      if (req.query.with) {
        order.populate(deepPopulate(req.query.with));
      }
      order = await order.select(fields);
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
      const options = {};
      options.page = req.query.page || 1;
      if (req.query.with) {
        options.populate = deepPopulate(req.query.with);
      }
      const orders = await Order.paginate({}, options);
      res.send({
        data: orders
      });
    } catch (err) {
      res.boom.badData(err);
    }
  }

  /**
   * Update order
   * @param {Request} req
   * @param {Response} res
   */
  static async updateOrder(req, res) {
    try {
      const order = await Order.findById(req.params.order);
      const data = merge(order, req.body);
      await order.update(data);
      res.send({
        data: order
      });
    } catch (err) {
      res.boom.badData(err);
    }
  }
  /**
   * Get pdf recepipt
   * @param {Request} req
   * @param {Response} res
   */
  static async receipt(req, res) {
    try {
      // eslint-disable-next-line max-len
      const order = await Order.findById(req.params.order).populate(['payments', 'deliveries']);
      const data = {};
      if (['spei', 'oxxo'].includes(order.payments[0].method)) {
        const barcode = new Barcode({'text': order.payments[0].reference});
        data.code = barcode.image;
      }
      data.moment = moment;
      data.dateformat = dateformat;
      data.order = order;
      const options = {format: 'Letter'};
      const pdf = new PDF('receipt', data, options);
      const file = pdf.render();
      res.set('Content-Disposition', `attachment;filename=order-${order._id}.pdf`);
      res.set('Content-Type', 'application/octet-stream');
      res.end(await file, 'binary');
    } catch (err) {
      console.log(err);
      res.boom.badRequest(err);
    }
  }
}

export default OrderController;
