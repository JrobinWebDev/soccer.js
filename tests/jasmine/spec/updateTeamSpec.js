describe('updateTeam()', function() {
    var team = [{name: 'Merry Argyle', gp: 15, w: 1, d: 0, l: 4, gs: 5, a: 4, gd: -6, pts: 11}];
    var updatePts = {pts: 15};
    var updateAll = {gp: 10, w: 4, d: 3, l: 2, gs: 15, a: 7, gd: 8, pts: 34};
    var incorrectPop = {gsp: 20};
    
    beforeEach(function() {
        soccer.sortedLeague.length = 0;
        spyOn(soccer, 'createLeague');
        soccer.addTeam(team);
    });

    
    it('should update one team property', function() {
        soccer.updateTeam('Merry Argyle', updatePts);
        
        expect(soccer.sortedLeague[0].pts).toBe(15);
    });
    
    it('should update all team properties', function() {
        soccer.updateTeam('Merry Argyle', updateAll);
        
        expect(soccer.sortedLeague[0]).toEqual(jasmine.objectContaining(updateAll));
    });
    
    it ('should invoke createLeague()', function() {
        soccer.updateTeam('Merry Argyle', updatePts);
        
        expect(soccer.createLeague).toHaveBeenCalled();
    });
    
    it('should throw Error if team name does not exist', function() {
        expect(function(){
            soccer.updateTeam('Frodo City', updatePts);
        }).toThrow(new Error('Team name does not exist.'));
    });
    
    it('should throw Error if team name is not case sensitive', function() {
        expect(function(){
            soccer.updateTeam('mErrY aRGYle');
        }).toThrow(new Error('Team name does not exist.'));
    });
    
    it('should throw Error if incorrect team property used', function() {
        expect(function(){
            soccer.updateTeam('Merry Argyle', incorrectPop);
        }).toThrow(new Error('Incorrect team property passed.'));
    });
    
});