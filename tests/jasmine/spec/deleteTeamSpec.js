describe('deleteTeam()', function() {
    var teams = [{name: 'Frodo City', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}, 
                 {name: 'Merry Argyle', gp: 10, w: 4, d: 0, l: 3, gs: 7, a: 4, gd: 6, pts: 5}];
    
    beforeEach(function() {
        soccer.league.length = 0;
        spyOn(soccer, 'renderLeague');
        spyOn(soccer, 'sort');
        soccer.addTeam(teams);
    });

    
    it('should delete a team', function() {
        soccer.deleteTeam('Frodo City');
        
        expect(soccer.league.length).toBe(1);
        expect(soccer.league[0]).toEqual(jasmine.objectContaining(teams[1]));
        soccer.deleteTeam('Merry Argyle');
        expect(soccer.league.length).toBe(0);
    });
    
    it('should return league array', function() {
        expect(soccer.deleteTeam('Merry Argyle')).toEqual(jasmine.any(Array));
    });
    
    it('should throw Error if team name does not exist', function() {
        expect(function(){
            soccer.updateTeam('Frodo Rovers');
        }).toThrow(new Error('Team name does not exist.'));
    });
    
    it('should throw Error if team name is not case sensitive', function() {
        expect(function(){
            soccer.updateTeam('fRoDo RoVerRs');
        }).toThrow(new Error('Team name does not exist.'));
    });
    
});