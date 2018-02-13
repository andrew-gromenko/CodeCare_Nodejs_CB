const { omit } = require('lodash');

module.exports = {
  exist,
  prettify,
  populate,
  byAction,
};


const id = ({ _id }) => _id.toString();

function exist(model) {
  if (!model) throw new Error('Entity not found.');
}


function prettify(model, values = []) {
  const object = typeof model.toObject === 'function' ? model.toObject() : model;
  const prettified = omit(object, ['_id', '__v', ...values]);

  return {
    id: id(model),
    ...prettified,
  };
}

// @params model - String. Model which should be populated
// @params field - String. Path in model which should be populated
// @params values - String. Fields which should be selected
function populate(model, field, values) {
  const population = {
    user: {
      path: field,
      select: values ? values : 'id name username picture',
    },

    media: {
      path: field,
      select: values ? values : void(0),
    },

    comment: {
      path: field,
      select: values ? values : void(0),
    },

    workspace: {
      path: field,
      select: values ? values : void(0),
    }
  };

  return population[model];
}

function byAction(action, query) {
  const options = {};

  switch (action) {
    case 'push': {
      options['$addToSet'] = query;

      return options;
    }

    case 'pull': {
      options['$pull'] = query;

      return options;
    }

    default: {
      throw new Error(`Action should be one of the ["push", "pull"]. Given ${action}`);
    }
  }
}