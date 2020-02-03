import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CadastramentoEncomenda from '../jobs/CadastramentoEncomenda';

class DeliveryController {
  async index(req, res) {
    const delivery = await Delivery.findAll();
    return res.json(delivery);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryMan = await DeliveryMan.findByPk(req.body.deliveryman_id);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Delivery Man not exists' });
    }

    const recipient = await Recipient.findByPk(req.body.recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not exists' });
    }

    const delivery = await Delivery.create(req.body);

    await Queue.add(CadastramentoEncomenda.key, {
      deliveryMan,
      delivery,
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      deliveryman_id: Yup.number(),
      recipient_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not exists' });
    }

    if (req.body.deliveryman_id) {
      const deliveryMan = await DeliveryMan.findByPk(req.body.deliveryman_id);

      if (!deliveryMan) {
        return res.status(400).json({ error: 'Delivery Man not exists' });
      }
    }

    if (req.body.recipient_id) {
      const recipient = await Recipient.findByPk(req.body.recipient_id);

      if (!recipient) {
        return res.status(400).json({ error: 'Recipient not exists' });
      }
    }

    const { id, product } = await delivery.update(req.body);

    return res.send({ id, product });
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not exists' });
    }

    delivery.canceled_at = new Date();

    await delivery.save();

    return res.send();
  }
}

export default new DeliveryController();
