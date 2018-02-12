describe('addTeam()', function() {
    var team = [{name: 'Merry Argyle', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}];
    var multipleTeams = [{name: 'Merry Argyle', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}, 
                         {name: 'Frodo City', gp: 10, w: 3, d: 2, l: 5, gs: 15, a: 14, gd: -1, pts: 13}];
    var missingProps = [{name: 'Merry Argyle', gp: 15, w: 1}];
    var incorrectprops = [{name: 'Merry Argyle', wrong: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}];
    var noArray = {name: 'Merry Argyle', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11};
    
    beforeEach(function() {
        soccer.league.length = 0;
    });
    
    
    it('should add a team object', function() {
        soccer.addTeam(team);
        
        expect(soccer.league.length).toBe(1);
        expect(soccer.league[0]).toEqual(jasmine.any(Object));
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(team[0]));
    });
    
    it('should add multiple team objects', function() {
        soccer.addTeam(multipleTeams);
        
        expect(soccer.league.length).toBe(2);
        expect(soccer.league[0]).toEqual(jasmine.any(Object));
        expect(soccer.league[1]).toEqual(jasmine.any(Object));
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(multipleTeams[0]));
        expect(soccer.league[1]).toEqual(jasmine.objectContaining(multipleTeams[1]));
    });
    
    it('should return league array containing team object', function() {
        expect(soccer.addTeam(team)).toEqual(jasmine.any(Array));
        soccer.league.length = 0;
        expect(soccer.addTeam(team)[0]).toEqual(jasmine.objectContaining(team[0]));
    });
    
    it('should contain default team properties', function() {
        soccer.addTeam(team);
        
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(team[0]));
        expect(soccer.league[0]).not.toEqual(jasmine.objectContaining({
            name: 'Bilbo Town'
        }));
    });
    
    it('should throw Error if team object(s) not passed within an array', function() {
        expect(function(){
            soccer.addTeam(noArray);
        }).toThrow(new Error('Invalid argument. Data must be passed within an array.'));  
    });
    
    it('should throw Error if incorrect number of properties used', function() {
        expect(function(){
            soccer.addTeam(missingProps);
        }).toThrow(new Error('Incorrect team property format passed.'));
    });
    
    it('should throw Error if incorrect property is used', function() {
        expect(function(){
            soccer.addTeam(incorrectprops);
        }).toThrow(new Error('Incorrect team property format passed.'));
    });
    
    it('should throw Error if team name is already in use', function() {
        soccer.addTeam(team);
        
        expect(function() {
            soccer.addTeam(team);   
        }).toThrow(new Error('Team name already exists.'));
    });
    
});