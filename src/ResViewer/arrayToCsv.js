export default function arrayToCsv(content) {
  var finalVal = "";

  for (var i = 0; i < content.length; i++) {
    var value = content[i];

    for (var j = 0; j < value.length; j++) {
      var innerValue = value[j] === null ? "" : value[j].toString();
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
      if (j > 0) finalVal += ",";
      finalVal += result;
    }

    finalVal += "\n";
  }

  return finalVal;
}
