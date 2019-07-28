/**
 * Test controller class
 */
export default class TestController {
  /**
   * Hello test controller
   * @param {Request} req
   * @param {Response} res
   */
  static async hello(req, res) {
    const response = {
      'message': 'Hello world :*',
      'status': 200,
    };
    res.send(response);
  };
};
