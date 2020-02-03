import * as Yup from 'yup';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryByControler {
  async index(req, res) {
    const { entregues } = req.query;

    const endDate = entregues
      ? {
          [Op.ne]: null,
        }
      : null;

    const deliveries = await Delivery.findAll({
      where: {
        canceledAt: null,
        endDate,
        deliveryman_id: req.id,
      },
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      startDate: Yup.date(),
      endDate: Yup.date(),
      signature_id: Yup.number().when('endDate', (endDate, field) =>
        endDate ? field.required() : field
      ),
    });
    const startDate = req.body.startDate ? parseISO(req.body.startDate) : null;
    const endDate = req.body.endDate ? parseISO(req.body.endDate) : null;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (req.body.signature_id) {
      const file = await File.findByPk(req.body.signature_id);

      if (!file) {
        return res.status(400).json({ error: 'Signature not exists' });
      }
    }

    let delivery = await Delivery.findByPk(req.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not exists' });
    }

    if (delivery.canceledAt) {
      return res.status(400).json({ error: 'Delivery has been canceled' });
    }

    if (!delivery.startDate && endDate) {
      return res.status(400).json({
        error:
          'Product must be removed before being delivered delivery has already been done',
      });
    }

    if (startDate) {
      const { count: qtdEntregasDia } = await Delivery.findAndCountAll({
        where: {
          deliveryman_id: delivery.deliveryman_id,
          canceledAt: null,
          startDate: {
            [Op.between]: [startOfDay(startDate), endOfDay(startDate)],
          },
        },
      });

      if (qtdEntregasDia > 5) {
        return res.status(400).json({
          error: 'There are already 5 withdrawals in the day',
        });
      }
    }

    if (delivery.startDate && startDate) {
      return res
        .status(400)
        .json({ error: 'Product withdrawal has already been done' });
    }

    if (delivery.endDate && endDate) {
      return res
        .status(400)
        .json({ error: 'Product delivery has already been done' });
    }

    delivery = await delivery.update(req.body);

    return res.json(delivery);
  }
}

export default new DeliveryByControler();
