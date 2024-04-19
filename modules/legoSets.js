// Allow us to access DB values.
require("dotenv").config();
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const setData = require("../data/setData");
const themeData = require("../data/themeData");

// function Initialize()
// {
//   const initPromise = new Promise(async function(resolve, reject)
//   {
//    {
  //   try 
  //   {
    //   await sequelize.sync();
    //   // Query the Themes table to count the number of rows
    //   const noOfThemes = await Themes.count();
    //   const noOfSets = await Sets.count();
      
    //   // If themesCount is 0, Add themes to DB
    //   if (noOfThemes === 0) 
    //   {
    //     for(let i = 0; i < themeData.length; i++)
    //     {
    //       await Themes.create(
    //       {
    //         id: themeData[i].id,
    //         name: themeData[i].name
    //       })
    //     }
    //     console.log("Themes is empty.");
    //   } 
    //   else 
    //   {
    //     // for(let i = 0; i < themeData.length; i++)
    //     // {
    //     // console.log(themeData[i]);
    //     // }
    //     console.log("Themes has data.");
    //   }
    //   // If Sets count is 0, Add Sets to DB
    //   if (noOfSets === 0) 
    //   {
    //     for (let i = 0; i < setData.length; i++) 
    //     {
    //       await Sets.create(
    //       {
    //         setNum: setData[i].set_num,
    //         name: setData[i].name,
    //         year: setData[i].year,
    //         num_parts: setData[i].num_parts,
    //         theme_id: setData[i].theme_id,
    //         img_url: setData[i].img_url,
    //       });

    //       console.log("Sets inserted into Database");
    //     }
    //   } 
      
    //   else
    //   {
    //     console.log("Sets has data.");
    //   }

       // checks if setData and themeData exist
//       if (setData && themeData) 
//       {
//         for (let i = 0; i < setData.length; i++) 
//         {
//           // assigns set data to set
//           sets[i] = setData[i];

//           // Searches themeData for matching theme ID and assigns theme name to set object
//           const found = themeData.find((themeData) => themeData.id == setData[i].theme_id);
//           sets[i].theme = found.name;
//         }
//       }

//       //  promise resolved
//       resolve("All sets initialized!");
//     } 
//     catch (error) 
//     {
//       // promise rejected
//       reject("Initialization Failed!");
//     }
//   });

//   initPromise.then(function(data) 
//   {
//     console.log(data);
//   })
//   .catch(function(error) 
//   {
//     console.error(error);
//   });
// }
//   }
// }

// Theme Schema  
const themeSchema = new Schema(
  {
    _id: Number,
    name: String
  },
  {
    timestamps: false,
  }
);

// Set Schema
const setSchema = new Schema(
  {
    setNum: {type: String, unique: true },
    name: String,
    year: Number,
    num_parts: Number,
    // Association
    theme_id: {type: Number, ref: 'themes'},
    theme_name: String, // New Field
    img_url: String,
  },
  {
    timestamps:false,
  }
)
const Set =  mongoose.model('Sets', setSchema );
const Theme = mongoose.model('Themes', themeSchema)

async function Initialize()
{
  try {
    let DB = process.env.DB_CONNECTION_STRING;
    await mongoose.connect(DB); // Mongoose connection

    // Check if MongoDB connection is successful
    if (mongoose.connection.readyState === 1) 
    {
      const db = mongoose.connection;
        console.log('Connected to MongoDB database:', db.name);
        console.log("Mongo Connection Successful");
    } 
    else 
    {
      console.error("Error connecting to MongoDB.");
    }
  } 
  catch (err) 
  {
    console.error("Error connecting to database:", err);
  }
};

// Mongo Implementation
function getAllSets() {
  return new Promise(async (resolve, reject) => {
    try {
      // Assign theme_ids within Database to its corresponding Theme Name
      await assignThemeName();
      
      // Gets All sets
      const sets = await Set.find({}).exec();

      console.log(sets);
      resolve(sets);
    } 
    catch (error) 
    {
      reject("Unable to retrieve sets.");
    }
  });
}


// Mongo Implementation
function getSetByNum(set_Num) {
  return new Promise(async (resolve, reject) => {
    try {
      // Get Set by set Number
      const setno = await Set.findOne({ setNum: set_Num }).exec();
      
      console.log(setno);
      resolve(setno);
    } catch {
      reject("Unable to find requested set.");
    }
  });
}

// Mongo Implementation
function getSetsByTheme(theme) {
  return new Promise(async (resolve, reject) => {
    try {
      // Gets sets by Theme Name
      const setTheme = await Set.find({theme_name: theme}).exec()
      resolve(setTheme);
    } catch {
      reject("Unable to find requested sets.");
    }
  });
}

// Mongo Implementation
function addSet(data) {
  return new Promise(async (resolve, reject) => {
    try {
      // Adds Set info to schema
      const newSet = new Set({
        setNum: data.setNum,
        name: data.name,
        year: data.year,
        num_parts: data.num_parts,
        theme_id: data.theme_id,
        img_url: data.img_url,
      });

      // Saves Schema to database
      await newSet.save();
      resolve();
    } catch (err) {
      reject(err.message);
    }
  });
}

// Mongo Implementation
function getAllThemes() {
  return new Promise(async (resolve, reject) => {
    try {
      // Gets all Themes from Theme collection
      const themes = await Theme.find({}).exec();
      resolve(themes);
    } catch (error) {
      reject(error.errors[0].message);
    }
  });
}


function editSet(setno, data) {
  return new Promise(async (resolve, reject) => {
    try {
      // Updates and saves new data for Set collection by set number
      await Set.updateOne(
        { setNum: setno },
        {
          $set: {
            name: data.name,
            year: data.year,
            num_parts: data.num_parts,
            theme_id: data.theme_id,
            img_url: data.img_url,
          },
        }
      ).exec();
      resolve();
    } catch (error) {
      reject(error.errors[0].message);
    }
  });
}

// Mongo Implementation
function deleteSet(setno) 
{
  return new Promise((resolve, reject) => 
  {
    try 
    {
      // Deletes Set from database based off set Number
      Set.deleteOne({setNum: setno}).exec();
      resolve();
    } 
    catch (error) 
    {
      reject(error.errors[0].message);
    }
  });
}

// New function for Assignment 6
// Couldnt for the life of me figure out how to implement the EJS templates
// So i just added a "theme_name" field to the Set collection for easier retrieval
// This function assigns the Set theme name based off the Theme id. 
function assignThemeName()
{
  return new Promise(async (resolve, reject) => 
  {
    try
    {
      // Get All Set and Theme Documents 
      const sets = await Set.find({}).exec();
      const themes = await Theme.find({}).exec();
      
      for(let i = 0; i < sets.length; i++)
      {
        for(let j = 0; j < themes.length; j++)
        {
          // Checks if Set theme Id matches Theme id
          if (sets[i].theme_id == themes[j]._id)
          {
            // Assigns Sets theme name the same as Theme Name
            sets[i].theme_name = themes[j].name;
            // Saves to database
            await sets[i].save();
          }
        }
      }
      resolve(sets, themes);
    }
    catch
    {
      reject("Unable to Assign Theme Name");
    }
    })
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
