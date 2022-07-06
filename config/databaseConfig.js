const mysql = require("mysql2/promise");
const config = require("./index");
const pool = mysql.createPool(config.mysql);
const Logger = require("../utils/logger");

const logger = new Logger();
const dbConnect = () => {
  const mysql = require("mysql2");
  const con = mysql.createConnection(config.mysql);

  con.connect(function (err) {
    if (err) throw err;
    logger.log("DB Connected!!", "info");
  });
};

async function query(sql) {
  let connection;
  try {
    connection = await pool.getConnection(async (conn) => conn);
    try {
      const [result] = await connection.query(sql);
      return result;
    } catch (error) {
      const e = new Error(error);
      e.name = "Query Error";
      throw e;
    }
  } catch (error) {
    const e = new Error(error);
    e.name = "DB Error";
    throw e;
  } finally {
    connection.release();
  }
}

async function execute(sql, params) {
  let connection;
  try {
    connection = await pool.getConnection(async (conn) => conn);
    try {
      const [result] = await connection.execute(sql, params);
      return result;
    } catch (error) {
      const e = new Error(error);
      e.name = "Query Error";
      throw e;
    }
  } catch (error) {
    const e = new Error(error);
    e.name = "DB Error";
    throw e;
  } finally {
    connection.release();
  }
}

module.exports = {
  query,
  execute,
  dbConnect,
};
