/**
 * Order class
 */
export class Order {
  /**
     * Create order method
     * @param {Object} params
     * @return {Object}
     */
  static async create(params) {
    return {
      'order': {
        '_id': 'ord_2m8CZ3mJXGjeT1dTq',
        'classUrl': '/orders',
        'children_resources': {
          'line_items': 'LineItem',
          'tax_lines': 'TaxLine',
          'shipping_lines': 'ShippingLine',
          'discount_lines': 'DiscountLine',
          'charges': 'Charge'
        },
        '_json': {
          'livemode': false,
          'amount': 25025,
          'currency': 'MXN',
          'amount_refunded': 0,
          'customer_info': {
            'email': 'fdorantesm@gmail.com',
            'phone': '+524771179504',
            'name': 'Fernando Dorantes',
            'corporate': false,
            'customer_id': 'cus_2m48aLFZjNLR1CPtc',
            'object': 'customer_info'
          },
          'shipping_contact': {
            'address': {
              'street1': 'Taxqueña 1938 301',
              'city': 'Ciudad de México',
              'country': 'mx',
              'residential': true,
              'object': 'shipping_address',
              'postal_code': '04420'
            },
            'id': 'ship_cont_2m8CZ3mJXGjeT1dTp',
            'object': 'shipping_contact',
            'created_at': 0
          },
          'object': 'order',
          'id': 'ord_2m8CZ3mJXGjeT1dTq',
          'metadata': {},
          'created_at': 1565411516,
          'updated_at': 1565411516,
          'line_items': {
            'object': 'list',
            'has_more': false,
            'total': 1,
            'data': [
              {
                'name': 'Test product',
                'unit_price': 10025,
                'quantity': 1,
                'object': 'line_item',
                'id': 'line_item_2m8CZ3mJXGjeT1dTm',
                'parent_id': 'ord_2m8CZ3mJXGjeT1dTq',
                'metadata': {},
                'antifraud_info': {}
              }
            ]
          },
          'shipping_lines': {
            'object': 'list',
            'has_more': false,
            'total': 1,
            'data': [
              {
                'amount': 15000,
                'carrier': 'expression',
                'object': 'shipping_line',
                'id': 'ship_lin_2m8CZ3mJXGjeT1dTn',
                'parent_id': 'ord_2m8CZ3mJXGjeT1dTq'
              }
            ]
          }
        },
        '_items': [],
        'line_items': {
          'classUrl': '/orders',
          'children_resources': {},
          '_json': {
            'object': 'list',
            'has_more': false,
            'total': 1,
            'data': [
              {
                'name': 'Test product',
                'unit_price': 10025,
                'quantity': 1,
                'object': 'line_item',
                'id': 'line_item_2m8CZ3mJXGjeT1dTm',
                'parent_id': 'ord_2m8CZ3mJXGjeT1dTq',
                'metadata': {},
                'antifraud_info': {}
              }
            ]
          },
          '_items': []
        },
        'shipping_lines': {
          'classUrl': '/orders',
          'children_resources': {},
          '_json': {
            'object': 'list',
            'has_more': false,
            'total': 1,
            'data': [
              {
                'amount': 15000,
                'carrier': 'expression',
                'object': 'shipping_line',
                'id': 'ship_lin_2m8CZ3mJXGjeT1dTn',
                'parent_id': 'ord_2m8CZ3mJXGjeT1dTq'
              }
            ]
          },
          '_items': []
        }
      },
      'charge': {
        'id': '5d4e48bc431e7278b6daaecb',
        'livemode': false,
        'created_at': 1565411516,
        'currency': 'MXN',
        'payment_method': {
          'service_name': 'OxxoPay',
          'barcode_url': 'https://s3.amazonaws.com/cash_payment_barcodes/sandbox_reference.png',
          'object': 'cash_payment',
          'type': 'oxxo',
          'expires_at': 1566090000,
          'store_name': 'OXXO',
          'reference': '98000003288639'
        },
        'object': 'charge',
        'description': 'Payment from order',
        'status': 'pending_payment',
        'amount': 25025,
        'fee': 1016,
        'customer_id': '',
        'order_id': 'ord_2m8CZ3mJXGjeT1dTq'
      }
    };
  }
}
