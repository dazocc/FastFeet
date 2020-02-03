import * as Yup from 'yup';

import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import CancelamentoEncomenda from '../jobs/CancelamentoEncomenda';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async index(req, res) {
    const deliveryProblems = await DeliveryProblem.findAll({
      where: { delivery_id: req.id },
    });

    res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(req.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not exists' });
    }

    const deliveryProblem = await DeliveryProblem.create({
      description: req.body.description,
      delivery_id: req.id,
    });

    return res.json(deliveryProblem);
  }

  async update(req, res) {
    const deliveryProblem = await DeliveryProblem.findOne({
      where: { id: req.id },
      attributes: ['id', 'description', 'createdAt'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['id', 'product', 'canceledAt'],
          include: [
            {
              model: DeliveryMan,
              as: 'delivery_man',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    let { delivery } = deliveryProblem;

    if (delivery.canceledAt) {
      return res
        .status(400)
        .json({ error: 'This delivery has already been canceled' });
    }

    delivery = await delivery.update({ canceledAt: new Date() });

    await Queue.add(CancelamentoEncomenda.key, {
      deliveryProblem,
      delivery,
      deliveryMan: delivery.delivery_man,
    });

    return res.json(deliveryProblem);
  }
}

export default new DeliveryProblemController();
