import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class CancelamentoEncomenda {
  get key() {
    return 'CancelamentoEncomenda';
  }

  async handle({ data }) {
    const { deliveryMan, delivery, deliveryProblem } = data;

    await Mail.sendMail({
      to: `${deliveryMan.name}<${deliveryMan.email}>`,
      subject: 'Cancelamento de Encomenda',
      template: 'cancelamentoEncomenda',
      context: {
        deliveryMan: deliveryMan.name,
        id: delivery.id,
        description: deliveryProblem.description,
        product: delivery.product,
        date: format(
          parseISO(deliveryProblem.createdAt),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancelamentoEncomenda();
