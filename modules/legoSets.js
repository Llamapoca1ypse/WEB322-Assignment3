// Allow us to access DB values.
require("dotenv").config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });

// Models
const Theme = sequelize.define(
  "Theme",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

const Set = sequelize.define(
  "Set",
  {
    setNum: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);
// Association
Set.belongsTo(Theme, { foreignKey: "theme_id" });

function Initialize() {
  sequelize
    .sync()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.log("Unable to connect to the database:", err);
    });
}

function getAllSets() {
  return new Promise(async (resolve, reject) => {
    try {
      const sets = await Set.findAll({ include: [Theme] });
      resolve(sets);
    } catch {
      reject("Unable to retrieve sets.");
    }
  });
}

function getSetByNum(set_Num) {
  return new Promise(async (resolve, reject) => {
    try {
      const setno = await Set.findOne({
        where: { setNum: set_Num },
        include: [Theme],
      });
      resolve(setno);
    } catch {
      reject("Unable to find requested set.");
    }
  });
}

function getSetsByTheme(theme) {
  return new Promise(async (resolve, reject) => {
    try {
      const setTheme = await Set.findAll({
        include: [Theme],
        where: { "$Theme.name$": { [Sequelize.Op.iLike]: `%${theme}` } },
      });
      resolve(setTheme);
    } catch {
      reject("Unable to find requested sets.");
    }
  });
}

function addSet(setData) {
  return new Promise(async (resolve, reject) => {
    try {
      await Set.create(setData);
      resolve();
    } catch (err) {
      reject(err.message);
    }
  });
}

function getAllThemes() {
  return new Promise((resolve, reject) => {
    Theme.findAll()
      .then((themes) => {
        resolve(themes);
      })
      .catch((error) => {
        reject(error.errors[0].message);
      });
  });
}

function editSet(setno, setData) {
  return new Promise((resolve, reject) => {
    Set.update(
      {
        name: setData.name,
        year: setData.year,
        num_parts: setData.num_parts,
        theme_id: setData.theme_id,
        img_url: setData.img_url,
      },
      {
        where: { setNum: setno },
      }
    )
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error.errors[0].message);
      });
  });
}

function deleteSet(setno) {
  return new Promise((resolve, reject) => {
    Set.destroy({
      where: { setNum: setno },
    })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error.errors[0].message);
      });
  });
}
module.exports = {
  Initialize,
  getAllSets,
  getSetByNum,
  getSetsByTheme,
  getAllThemes,
  addSet,
  editSet,
  deleteSet,
};
