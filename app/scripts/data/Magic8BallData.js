'use strict';
var magic8BallAns = function() {

    function getOrginalAnsList() {
        var orginalList = ['It is certain',
            'It is decidedly so',
            'Without a doubt',
            'Yes definitely',
            'You may rely on it',
            'As I see it, yes',
            'Most likely',
            'Outlook good',
            'Yes',
            'Signs point to yes',
            'Reply hazy try again',
            'Ask again later',
            'Better not tell you now',
            'Cannot predict now',
            'Concentrate and ask again',
            'Don\'t count on it',
            'My reply is no',
            'My sources say no',
            'Outlook not so good',
            'Very doubtful'
        ];
        return orginalList;
    }

    var ansList = getOrginalAnsList();
    return {
        getAns: function() {
            return ansList[(Math.floor(Math.random() * ansList.length))];
        },
        getStartingAns: function(){
            return 'Ask a question';
        }/*,
        addAns:function(str){
          ansList.push(str);
          return ansList;
        },
        getAnsList:function(){
          return ansList;
        },
        removeItem: function(index){
            var i = Number(index);
            if(!isNaN(i) && i >= 0 && i <ansList.length){
                delete ansList[i];
            }
        }*/
    };
};

module.exports = magic8BallAns;