var fs = require('fs');
var presets = {};

function presetsAction(player, values, callback) {
  var value = decodeURIComponent(values[0]);
	console.log('loaded presets', value); 
 if (value.startsWith('{'))
    var preset = JSON.parse(value);
  else
    var preset = presets[value];
  
  if (preset) {
    	if (preset.presets) {
console.log('Multiple presets'); 
		for (var i = 0; i < preset.presets.length; i++) {
			player.discovery.applyPreset(preset.presets[i], function (err, result) {
				if (err) {
        				console.error(err, result)
      				}
    			});
		}	
	}
	else {
		player.discovery.applyPreset(preset, function (err, result) {
			if (err) {
        			console.error(err, result)
      			}
    		});
	}
      
  } else {
    var simplePresets = [];
    for (var key in presets) {
      if (presets.hasOwnProperty(key)) {
        simplePresets.push(key);
      }
    }
    callback(simplePresets);
  }
}

function initPresets(api) {
  var presetsFilename = __dirname + '/../../presets.json';
  fs.exists(presetsFilename, function (exists) {
    if (exists) {
      presets = require(presetsFilename);
      console.log('loaded presets', presets);
    } else {
      console.log('no preset file, ignoring...');
    }
    api.registerAction('preset', presetsAction);
  });
}

module.exports = function (api) {
  initPresets(api);
}
