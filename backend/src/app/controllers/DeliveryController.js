import * as Yup from 'yup';
import { parseISO, getHours } from 'date-fns';

import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CadastramentoEncomenda from '../jobs/CadastramentoEncomenda';

class DeliveryController {
  async index(req, res) {
    const delivery = await Delivery.findAll({ where: { canceledAt: null } });
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
      startDate: Yup.date(),
      endDate: Yup.date(),
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

    if (delivery.canceledAt) {
      return res.status(400).json({ error: 'Delivery has been canceled' });
    }

    if (delivery.startDate && req.body.startDate) {
      return res
        .status(400)
        .json({ error: 'Product withdrawal has already been done' });
    }

    if (!delivery.startDate && req.body.endDate) {
      return res.status(400).json({
        error:
          'Product must be removed before being delivered delivery has already been done',
      });
    }

    if (delivery.endDate && req.body.endDate) {
      return res
        .status(400)
        .json({ error: 'Product delivery has already been done' });
    }

    if (req.body.startDate) {
      const startHour = getHours(parseISO(req.body.startDate));

      if (startHour < 8 || startHour > 18) {
        return res.status(400).json({
          error: 'Withdrawals can only be made between 08:00 and 18:00',
        });
      }
    }

    const {
      id,
      product,
      canceledAt,
      startDate,
      endDate,
    } = await delivery.update(req.body);

    return res.send({ id, product, canceledAt, startDate, endDate });
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
