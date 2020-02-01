import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json({ recipient });
  }

  async update(req, res) {
    const recipient = await Recipient.findByPk(req.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Id not exists' });
    }

    const recipientAtualizado = await recipient.update(req.body);

    return res.json({ recipientAtualizado });
  }
}

export default new RecipientController();
