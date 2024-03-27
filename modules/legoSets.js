const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function Initialize()
{
  const initPromise = new Promise(function(resolve, reject)
  {
    // checks if setData and themeData exist
    if(setData && themeData)
    {
      for (let i = 0; i < setData.length; i++)
      {
        // assigns set data to set
        sets[i] = setData[i];

        // Searches themeData for matching theme ID and assigns theme name to set object
        const found = themeData.find((themeData) => themeData.id == setData[i].theme_id);
        sets[i].theme = found.name;
      }
      // promise resolved
      resolve("All sets initialized!");
    }
    else
    {
      // promise rejected
      reject("Initialization Failed!");
    }
  });

  initPromise.then(function(data)
  {
    console.log(data);
  })
  .catch(function(error)
  {
    console.error(error);
  })
}

function getAllSets()
{
  return new Promise(function(resolve, reject)
  {
    if (sets && sets.length > 0) // checks if sets array is not empty
    {temp = sets; 
    for (let i = 0; i < temp.length; i++) // converts all sets themes to be Uppercase
    {
      temp[i].theme = temp[i].theme.toUpperCase();
    }
      resolve(sets);
  }
    else 
      reject("Cant Get All Sets.");
  });
}

function getSetByNum(setNum)
{
  return new Promise(function(resolve,reject)
  {
    var found = [];
    // checks if sets array is not empty and checks if the setNum parameter is within the sets array
    if((sets && sets.length > 0) && (sets.find((sets) => sets.set_num == setNum))) 
    {
      found = sets.find((sets) => sets.set_num == setNum);
      resolve(found);
    }
    else 
      reject("Unable to find requested set.")
  });
}

function getSetsByTheme(theme)
{
  return new Promise(function(resolve,reject)
  {
    let UpperTheme = theme.toUpperCase(); // converts theme to Uppercase
    let temp = [];
    if(sets && sets.length > 0) // checks if sets was initialized
    {
      temp = sets; 
      for (let i = 0; i < temp.length; i++) // converts all sets themes to be Uppercase
      {
        temp[i].theme = temp[i].theme.toUpperCase();
      }
      // Assigns temp to a new array of objects only if the string passed through matches fully / partially to set themes.
      //temp = temp.filter((temp) => temp.theme.includes(lowerTheme));
      temp = temp.filter((temp) => temp.theme === UpperTheme);

      if(temp.length > 0) // temp will be larger than 0 if matching strings found
      {
        resolve(temp);
      }
      else // If not found, will trigger reject
      {
        reject("No Sets Found");
      }
    }
    else
    {
      reject("No Sets Found");
    }
  });
  
}
//Initialize();
// Initialize().then(() => {
//   console.log('All sets Initialized!');
// });
// let pee = getAllSets();
// let bum = getSetByNum("41590-1");
 //let poo = getSetsByTheme("The Hobbit");
// console.log("All Sets" , pee);
// console.log("Set By Num",bum);
 //console.log("Set By Theme",poo);

//Initialize();
// getAllSets().then(function(data) 
// {
//     console.log("All Sets: " , data);
// })
// .catch(function(error) 
// {
//     console.log(error);
// });

// getSetByNum("41590-1").then(function(data)
// {
//   console.log("Found Set: ", data);
// })
// .catch(function(error)
// {
//   console.log(error);
// })

//  getSetsByTheme("The Hobbit").then(function(data)
// {
//   console.log("Found Sets: ", data);
// })
// .catch(function(error)
// {
//   console.log(error);
// })

//Module Export
module.exports = { Initialize, getAllSets, getSetByNum, getSetsByTheme };
