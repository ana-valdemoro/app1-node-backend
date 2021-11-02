// const m = require('sendinblue');

const sendEmail = async (data) => {
  console.log(data);
};

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

module.exports = {
  sendForgotPassword,
};
