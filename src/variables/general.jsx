// ##############################
// // // Tasks for TasksCard - see Dashboard view
// #############################

function toDegreesMinutesAndSeconds(coordinate) {
  var absolute = Math.abs(coordinate);
  var degrees = Math.floor(absolute);
  var minutesNotTruncated = (absolute - degrees) * 60;
  var minutes = Math.floor(minutesNotTruncated);
  var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  return degrees + "° " + minutes + "' " + seconds+ "''";
}

function convertDMS(lat, lng) {
  var latitude = toDegreesMinutesAndSeconds(lat);
  var latitudeCardinal = Math.sign(lat) >= 0 ? "N" : "S";

  var longitude = toDegreesMinutesAndSeconds(lng);
  var longitudeCardinal = Math.sign(lng) >= 0 ? "E" : "W";

  return latitude + " " + latitudeCardinal + ", " + longitude + " " + longitudeCardinal;
}

module.exports = {
  toDegreesMinutesAndSeconds,
  convertDMS
};
