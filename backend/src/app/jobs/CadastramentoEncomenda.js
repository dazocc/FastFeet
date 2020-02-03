import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class CadastramentoEncomenda {
  get key() {
    return 'CadastramentoEncomenda';
  }

  async handle({ data }) {
    const { deliveryMan, delivery } = data;

    await Mail.sendMail({
      to: `${deliveryMan.name}<${deliveryMan.email}>`,
      subject: 'Cadastramento de Encomenda',
      template: 'cadastramentoEncomenda',
      context: {
        deliveryMan: deliveryMan.name,
        product: delivery.product,
        date: format(
          parseISO(delivery.createdAt),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CadastramentoEncomenda();
