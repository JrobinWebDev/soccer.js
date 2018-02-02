var league = {
    tempLeague: [],
    sortedLeague: [],
    positionedManually: false,
    tableData: {}
};

// used for sorting comparisons
var cache = {
    team: null,
    points: 0,
    goalDiff: 0,
    goalsScored: 0
}


/*-------------HELPER FUNCTIONS------------*/


function sort(re_sort) {
    var sorted = league.sortedLeague;
    var temp = league.tempLeague;
    var zeroTeams = temp.filter(function(team) {
        return !team.points;
    });
    
    // if re_sort is true we need to re-sort the table
    if (re_sort) {
        // push all teams from sorted to temp array and empty the sorted array
        sorted.forEach(function(team) {
            temp.push(team)
        });
        sorted.length = 0;
    }
    
    // teams with 0 points represents an edge case so we check here
    if (zeroTeams.length) {
        sortWithZeroPoints(zeroTeams);
        return;
    }
    
    // base case
    if (temp.length === 0) {
        return;
    // recursive case
    } else {
        for (var i = 0; i < temp.length; i ++) {
            if (temp[i].points > cache.points) {
                // update the cache with team data
                updateCache(temp[i]);  
            } else if (temp[i].points === cache.points) {
                // check goal difference
                goalDifferenceCheck(temp[i]);
            }
        }
        
        // match the right team(s) and push to sorted league
        temp.forEach(function(team, index) {
            if (team.name === cache.team.name) {
                sorted.push(team);
                // remove team 
                temp.splice(index, 1);
            }
        });
        
        // reset cache
        cacheReset();

        // recurse until all teams are checked
        sort();
        
        // add positions to teams
        addPositions(league.sortedLeague);
    }
}


function updateCache(team) {
    cache.team = team;
    cache.points = team.points;
    cache.goalDiff = team.goalDiff;
    cache.goalsScored = team.goalsScored;
}


function goalDifferenceCheck(team) {
    if (team.goalDiff > cache.goalDiff) {
        updateCache(team);
    } else if (team.goalDiff === cache.goalDiff) {
        // unlikely edge case - but still possible so check the goals scored
        goalsScoredCheck(team);
    }
}


function goalsScoredCheck(team) {
    if (team.goalsScored > cache.goalsScored) {
        updateCache(team);
    } else if (team.goalsScored === cache.goalsScored) {
        // sort the teams alphabetically - extreme edge case during the season but useful for the start when no games have been played
        sortAlphabetically(team, cache.team);
    } 
}


function sortAlphabetically(team, cacheTeam) {
    if (team.name.toLowerCase() < cacheTeam.name.toLowerCase()) {
        updateCache(team);
    }
}


function cacheReset() {
    cache.team = null;
    cache.points = 0;
    cache.goalDiff = 0;
    cache.goalsScored = 0;
}


function lastupdated() {
    var date = new Date();
    // format the date
    var dString = date.toGMTString();
    // remove 'GMT' from end of date
    var sliceGmt = dString.slice(0, 25);
    
    // set new date onto the league object
    return 'Last updated ' + sliceGmt;
}


function addPositions(sorted) {
    // add league position to each team object
    sorted.forEach(function(team, index) {
       team['position'] = index + 1;
    });
}


function internalSortAndRender() {
    // re-sort the table
    if (league.positionedManually) {
        createLeague(league.tableData);    
    } else {
        sort(true);
        // re-render the table to show sorted updates
        createLeague(league.tableData);
    }
}


function sortWithZeroPoints(zeroTeams) {
    // push all team names to temp array then sort
    var sortedZeroTeams = zeroTeams.map(function(team) {
        return team.name.toLowerCase();
    }).sort();
    
    // now sort the team objects
    sortedZeroTeams.forEach(function(teamName, index) {
        zeroTeams.forEach(function(team) {
            if (teamName === team.name.toLowerCase()) {
                sortedZeroTeams[index] = team;
            }
        });
    });
    
    // remove sorted zero point teams from tempLeague array
    sortedZeroTeams.forEach(function(zeroTeam) {
        league.tempLeague.forEach(function(team, index) {
            if (zeroTeam.name === team.name) {
                league.tempLeague.splice(index, 1);
            }
        });
    });
    
    // sort the remaining tempLeague teams as normal
    sort();
    
    // concat both the sorted zero points teams and the sorted teams with points
    league.sortedLeague = league.sortedLeague.concat(sortedZeroTeams);
}


function createTableHead(tableEl, headLength) {
    var headData;
    // cell data for header
    var headDataAbbr = ['#', 'Team', 'GP', 'W', 'D', 'L', 'F', 'A', 'GD', 'Pts'];
    var headDataLng = ['#', 'Team', 'Played', 'Won', 'Drawn', 'Lost', 'For', 'Against', 'GD', 'Points'];
    
    // determine the type of header data we need to use
    if (headLength === 'short') {
        headData = headDataAbbr;
    } else {
        headData = headDataLng;
    }
    
    // append table head to table
    var tableHead = document.createElement('thead');
    tableEl.appendChild(tableHead);
    // create the header row
    var headRow = document.createElement('tr');
    tableHead.appendChild(headRow);
    
    // create header cells
    headData.forEach(function(headName) {
        var headCell = document.createElement('th');
        // create abbreviation tag and set inner text
        var abbrEl = document.createElement('abbr');
        abbrEl.innerText = headName;
        headCell.appendChild(abbrEl);
        // append cells to the head row
        headRow.appendChild(headCell);
    });
    
    // create table body and table row data for each team and append to table
    createTableData(tableEl);
}


function createTableData(tableEl) {
    var sorted = league.sortedLeague;
    
    // create table body and append to table
    var tableBody = document.createElement('tbody');
    tableEl.appendChild(tableBody);
    
    // iterate over each team object create a table row with relevant team data 
    sorted.forEach(function(team) {
        var teamRow = document.createElement('tr');
        tableBody.appendChild(teamRow);
        
        var dataArr = [];
        for (var prop in team) {
            dataArr.push(team[prop]);
        }
        // place team position at front of team data array
        var teamPos = dataArr[9];
        dataArr.splice(9, 1);
        dataArr.unshift(teamPos);
        
        // iterate over team data array and create standard table cells for team data and append to team row
        dataArr.forEach(function(teamData) {
            var standardCell = document.createElement('td');
            var dataSpan = document.createElement('span');
            // add team data to span
            dataSpan.innerText = teamData;
            // append data span to standard cell and append cell to team row
            standardCell.appendChild(dataSpan);
            teamRow.appendChild(standardCell);
        });
    });
}

function createTableFooter(leagueTable) {
    var footer = document.createElement('tfoot');
    leagueTable.appendChild(footer);
    // create footer row
    var footerRow = document.createElement('tr');
    footer.appendChild(footerRow);
    // create standard cell for footer row
    var footerCell = document.createElement('td');
    
    // add colspan attribute to ensure footer cell stretches entire table
    footerCell.setAttribute('colspan', '10');
    footerRow.appendChild(footerCell);
    
    // create span for footer row cell
    var footerTime = document.createElement('time');
    
    // add most recent update time
        footerTime.innerText = lastupdated();
    // append span to footer cell
    footerCell.appendChild(footerTime);
}


/*------------API FUNCTIONS------------*/


function createLeague(data) {
    var container = document.querySelector('#leagueTable');
    var leagueTable = document.createElement('table');
    var leagueCaption = document.createElement('caption');
    // first sort the teams
    sort();
    
    // remove old league if there is one
    var containerChildNodes = [].slice.apply(container.childNodes);
    containerChildNodes.forEach(function(node) {
        if (node.nodeName === 'TABLE') {
            // remove the table element
            node.parentNode.removeChild(node);
        }
    });
    
    // store table data
    league.tableData['leagueName'] = data.leagueName;
    league.tableData['colTitle'] = data.colTitle;
    league.tableData['footer'] = data.footer;
    
    // set caption text
    leagueCaption.innerText = data.leagueName;
    // append table element and table caption to container div
    container.appendChild(leagueTable);
    leagueTable.appendChild(leagueCaption)
    
    // create the tablehead
    createTableHead(leagueTable, data.colTitle);
    
    // check if we need to create the tableFooter
    if (data.footer) {
        createTableFooter(leagueTable);   
    }
}


function addTeam(team) {
    var sorted = league.sortedLeague;
    var temp = league.tempLeague;
    
    // check if table has been rendered - if so, we add team and sort if possible
    if (document.querySelector('#leagueTable table')) {
        temp.push(team);
        internalSortAndRender();
    }
    
    // push team to temporary array for sorting
    temp.push(team);
    console.log(league.tempLeague);
    
    // check whether we are adding teams to an existing league
    if (sorted.length) {
        league.tempLeague = league.tempLeague.concat(sorted);
        league.sortedLeague.length = 0;
    }
}

function positionOverride(positions) {
    var sorted = league.sortedLeague;
    league.positionedManually = true;
    
    var pos1 = positions[0] -1; 
    var pos2 = positions[1] -1; 
    
    // swap team positions
    var tempArr = new Array(sorted.length);
    for (var i = 0; i < sorted.length; i ++) {
        if (i === pos1) {
            tempArr[pos2] = sorted[i];
            // change the teams position property
            sorted[i].position = positions[1];
        } else if (i === pos2) {
            tempArr[pos1] = sorted[i];  
            // change the teams position property
            sorted[i].position = positions[0];
        } else {
            tempArr[i] = sorted[i];
        }
    }
    
    league.sortedLeague = tempArr;
    // re-render the table
    internalSortAndRender();
}


function addTableZones(zonePosition) {
    var zoneArgArray = false;
    // check whether array or number
    if(Array.isArray(zonePosition)) {
        zoneArgArray = true;
    }
    // grab the number of teams in the table
    var numOfTeamsNode = document.querySelectorAll('#leagueTable table tbody tr');
    // convert node like array into array we can work with
    var numOfTeamsArr = [].slice.apply(numOfTeamsNode);
    
    if (!zoneArgArray) {
        // apply zone line to number specified
        var team = zonePosition -1;
        var teamForZone = numOfTeamsArr[team];
        // apply bottom border class on the team row
        teamForZone.classList.add('zone');
    } else {
        // array case
        zonePosition.forEach(function(zone) {
            numOfTeamsArr.forEach(function(teamRow, index) {
                if(zone === index + 1) {
                    teamRow.classList.add('zone');
                }    
            });
        });
    }
}


function updateTeam(name, data) {
    // find team and update with relevant data
    var teamToUpdate = league.sortedLeague.filter(function(sortedTeam) {
        return sortedTeam.name === name;
    })[0];
    
    var dataPropNames = Object.getOwnPropertyNames(data);
    var teamToUpdatePropNames = Object.getOwnPropertyNames(teamToUpdate);
    
    teamToUpdatePropNames.forEach(function(teamProp) {
        dataPropNames.forEach(function(dataProp) {
            if (dataProp === teamProp) {
                teamToUpdate[dataProp] = data[dataProp];
            }
        });
    });
    // re-render the table and sort if we can
    internalSortAndRender();
}


function deleteTeam(name) {
    var deleteIndex;
    var nameEdited = name.toLowerCase();
    
    league.sortedLeague.forEach(function(sortedTeam, index) {
        if (sortedTeam.name.toLowerCase() === nameEdited) {
            deleteIndex = index;
        };
    });
    
    // delete from the league
    league.sortedLeague.splice(deleteIndex, 1);
    // re-render the table
    createLeague(league.leagueName, league.colLength);
}








/*----------------------------------------------------*/

function mockData() {
    addTeam({
        name: 'liverpool',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 15,
        points: 29
    })
    
        addTeam({
        name: 'tottenham',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 19
    })
    
        addTeam({
        name: 'chelsea',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 27
    })
    
        addTeam({
        name: 'arsenal',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 25
    })
    
        addTeam({
        name: 'burnley',
        GP: 15,
        W: 3,
        D: 0,
        L: 4,
        goalsScored: 12,
        A: 4,
        goalDiff: 5,
        points: 7
    })
    
        addTeam({
        name: 'swansea',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 1,
        A: 4,
        goalDiff: 5,
        points: 10
    })
    
        addTeam({
        name: 'brighton',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 11
    })
    
        addTeam({
        name: 'stoke',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 5
    })
    
        addTeam({
        name: 'derby',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 10
    })
    
        addTeam({
        name: 'west ham',
        GP: 15,
        W: 1,
        D: 0,
        L: 4,
        goalsScored: 5,
        A: 4,
        goalDiff: 5,
        points: 17
    })
        
    createLeague({
        leagueName: 'MOCK LEAGUE',
        colTitle: 'short',
        footer: true
    });
    
}