const m = require('sendinblue');

const sendEmail = async (data) => m.sendTemplate(data);

const sendForgotPassword = async (user, token) => {
  const url = `${process.env.FRONT_BASE_URL}/account/${token}`;

  const data = {
    params: {
      BOILERPLATE_USERNAME: user.name,
      BOILERPLATE_URL: url,
    },
    subject: 'Petición de restablecimiento de la contraseña',
    to: [
      {
        email: user.email,
        name: user.name,
      },
    ],
    templateId: 12,
  };

  return sendEmail(data);
};
const sendOrderConfirmationMessage = async (order, user) => {
  const orderDate = `${order.createdAt.getDate()}/${
    order.createdAt.getMonth() + 1
  }/${order.createdAt.getFullYear()}`;

  const data = {
    params: {
      EMAIL: user.email,
      NAME: user.name,
      ORDER: {
        id: order.uuid,
        address: order.address,
        totalPrice: `${order.totalPrice.toFixed(2)}`,
        createdAt: orderDate,
      },
      PRODUCTS: order.productLines,
    },
    subject: 'Confirmación del pedido',
    to: [
      {
        email: user.email,
        name: user.name,
      },
    ],
    templateId: 1,
  };
  return sendEmail(data);
};

module.exports = {
  sendForgotPassword,
  sendOrderConfirmationMessage,
};
