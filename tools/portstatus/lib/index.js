'use strict'
var request = require('request');
var fs = require('fs');

module.exports = function(argv, callback) {
    if (argv._.length !== 3) {
        return callback("usage: <app> <path to startup.json> <uri for marathon>");
    }

    var app = argv._[0];
    var startupfile = argv._[1];
    var marathonurl = argv._[2];

    // read starup.json to get port map
    var startupjson;
    try {
        var content = fs.readFileSync(startupfile);
        startupjson = JSON.parse(content);
        var portmap = startupjson['portMap'];
    } catch(err) {
        console.log(err);
        process.exit(1);
    }

    // retrieve details about application
    request(marathonurl + '/v2/apps/' + app, function (error, response, body) {
        if(error) {
            console.log(error);
            process.exit(1);
        } else if(response.statusCode != 200) {
            console.log("Request failed.  Status code: " + response.statusCode);
            process.exit(1);
        } else {
            try {
                var appdetails = JSON.parse(body);
                var portmappings = appdetails['app']['container']['docker']['portMappings'];
                var tasks = appdetails['app']['tasks'];
                var runtimePortInfo = [];
                for(var i = 0; i < portmap.length; i++) {
                    for(var service in portmap[i]) {
                        var servicePort = portmap[i][service];

                        var serviceRuntimeInfo = {};
                        serviceRuntimeInfo['service'] = service;
                        serviceRuntimeInfo['servicePort'] = servicePort;

                        serviceRuntimeInfo['hostInfo'] = [];
                        for(var j = 0; j < portmappings.length; j++) {
                            if(portmappings[j]['containerPort'] == servicePort) {
                                // the index of the port within port mappings corresponds to the index
                                // of related information in other parts of the task details returned
                                // by marathon

                                for(var k = 0; k < tasks.length; k++) {
                                    var hostInfo = {}
                                    hostInfo['ipAddress'] = tasks[k]['host'];
                                    hostInfo['hostPort'] = tasks[k]['ports'][j];
                                    hostInfo['marathonServicePort'] = portmappings[j]['servicePort'];
                                    serviceRuntimeInfo['hostInfo'][serviceRuntimeInfo['hostInfo'].length] = hostInfo;
                                }
                            }
                        }

                        runtimePortInfo[runtimePortInfo.length] = serviceRuntimeInfo;
                    }
                }

                console.log(JSON.stringify(runtimePortInfo, null, 2));
            } catch(err) {
                console.log(err);
                process.exit(1);
            }
        }
    });
};
