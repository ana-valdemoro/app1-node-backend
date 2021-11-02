const { Activity } = require('../../../models');

const listActivity = async () => Activity.findAll();

const getActivity = async (uuid) => Activity.findOne({ where: { uuid } });

const createActivity = async (data) => {
  const activity = await Activity.create(data);
  return activity.save();
};

module.exports = {
  listActivity,
  getActivity,
  createActivity,
};
