const moment = require("moment-timezone");

//function to convert UTC date stored in MongoDB database to India Time Zone
exports.formatDate = (time) => {
  try {
    // console.log("time",time);
    if (!time) throw new Error();
    // Convert UTC to Indian time zone
    const indianTimeZone = moment(time).tz("Asia/Kolkata"); //tz - it defines the timezone for which you wish to convert
    // Format Indian time as desired (e.g., "ddd, DD-MMM-YYYY hh:mm:ss A")
    const formattedIndianTime = indianTimeZone.format(
      "dddd, DD-MMM-YYYY hh:mm:ss A"
    );
    //ddd-name of day MM- numreic (May-{05}), MMM- Words (05-{May})

    return formattedIndianTime;
    // console.log('UTC Time:', time);
    // console.log('Indian Time:', formattedIndianTime);
  } catch (err) {
    console.log("Error converting date 😔", err);
  }
};
