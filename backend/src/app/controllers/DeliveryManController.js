import * as Yup from 'yup';

import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryManController {
  async index(req, res) {
    const deliveryMans = await DeliveryMan.findAll();
    return res.json(deliveryMans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryMans = await DeliveryMan.create(req.body);

    return res.json(deliveryMans);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      avatar_id: Yup.number(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryMan = await DeliveryMan.findByPk(req.params.id);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Delivery Man not exists' });
    }

    if (req.body.avatar_id) {
      const file = await File.findByPk(req.body.avatar_id);

      if (!file) {
        return res.status(400).json({ error: 'Avatar not exists' });
      }
    }

    const { id, name, email, avatar_id } = await deliveryMan.update(req.body);

    return res.send({ id, name, email, avatar_id });
  }

  async delete(req, res) {
    const deliveryMan = await DeliveryMan.findByPk(req.params.id);

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Delivery Man not exists' });
    }

    await deliveryMan.destroy();

    return res.send();
  }
}

export default new DeliveryManController();
