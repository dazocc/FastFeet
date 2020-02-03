import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryWithProblemsController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveries = await DeliveryProblem.findAll({
      order: ['delivery_id', 'createdAt'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: [],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product', 'canceledAt', 'startDate', 'endDate'],
          where: { canceledAt: null },
        },
      ],
    });

    res.json(deliveries);
  }
}

export default new DeliveryWithProblemsController();
