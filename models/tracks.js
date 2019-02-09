// Requires the basic database model
const db = require('./database');

/**
 *  Gets data for tracks
 *  @param column Represents which column to check 'name' or 'country'
 *  @param value Represents which value has to find
 *  * If any of the params are undefined it retruns everything
 *  * If not found retruns empty array.
 */
exports.get = (column, value) => {
  return new Promise((resolve, reject) => {
    let session = db.connect();
    session
      .select()
      .from('track')
      .where(builder => {
        if (column != undefined && value != undefined) {
          value = value.replace(/-/g, ' ');
          builder.where(column, value);
        }
      })
      .then(val => resolve(val))
      .catch(e => reject(e))
      .finally(() => session.destroy());
  });
};
