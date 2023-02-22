const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DATABASE
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  return pool
    .query(
      `SELECT id, name, email, password 
    FROM users
    WHERE email = $1`, [email])
    .then((result) => result.rows[0] || null)
    .catch((err) => {
      throw err;
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  return pool
    .query(
      `SELECT id, name, email, password 
    FROM users
    WHERE id = $1`, [id])
    .then((result) => result.rows[0] || null)
    .catch((err) => {
      throw err;
    });

};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool
    .query(
      `INSERT INTO users (name, password, email) 
     VALUES ($1, $2, $3)
     RETURNING *`, [user.name, user.password, user.email])
    .then((result) => result.rows[0])
    .catch((err) => {
      throw err;
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(
      `
    SELECT reservations.*, properties.*, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2`, [guest_id, limit])
    .then((result) => result.rows)
    .catch((err) => {
      throw err;
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

// Query string assembly
const queryParams = [];
let queryString = `
SELECT properties.*, avg(property_reviews.rating) AS average_rating
FROM properties
JOIN property_reviews ON properties.id = property_id
`;

// WHERE 
if (options.city) {
  queryParams.push(`%${options.city}%`);
  queryString += `WHERE city LIKE $${queryParams.length} `;
}

if (options['owner_id']) {
  queryParams.push(options['owner_id']);
  queryString += queryParams.length ? `AND ` : `WHERE `;
  queryString += `owner_id = $${queryParams.length} `;
}

if (options['minimum_price_per_night']) {
  queryParams.push((options['minimum_price_per_night']) * 100);
  queryString += queryParams.length ? `AND ` : `WHERE `;
  queryString += `cost_per_night >= $${queryParams.length} `;
}

if (options['maximum_price_per_night']) {
  queryParams.push((options['maximum_price_per_night']) * 100);
  queryString += queryParams.length ? `AND ` : `WHERE `;
  queryString += `cost_per_night <= $${queryParams.length} `;
}

// GROUP BY
queryString += `
GROUP BY properties.id `;

// HAVING
if (options['minimum_rating']) {
  queryParams.push(options['minimum_rating']);
  queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
}

// ORDER BY / LIMIT
queryParams.push(limit);
queryString += `
ORDER BY cost_per_night
LIMIT $${queryParams.length};
  `;

return pool
  .query(queryString, queryParams)
  .then((result) => result.rows)
  .catch((err) => {
    throw err;
  });

};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  // Formatting the input object
  const orderedPropertyArray = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];

  return pool
    .query(
      `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`, orderedPropertyArray)
    .then((result) => result.rows[0])
    .catch((err) => {
      throw err;
    });
};
exports.addProperty = addProperty;
