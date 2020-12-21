const _ = require("lodash");

async function updateResolver(model, args, context) {
  const data = _.omit(args, ["id"]);
  return await context.model[model].findOneAndUpdate({ _id: args.id }, data, {
    returnOriginal: false,
  });
}

async function deleteResolver(model, args, context) {
  const { ok } = await context.model.attendance.deleteOne({ _id: args.id });
  return ok;
}

module.exports = { updateResolver, deleteResolver };
