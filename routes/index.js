var express = require('express')
var router = express.Router()
var extend = require('extend')

let allBettypeRule = {
  hdp: function (obj) {
    return {
      displayName: 'HDP',
      cssClassName: 'colg-1st',
      playWay: [{type: 'Less', prefix: '-'}, {type: 'More', prefix: '+'}, {type: 'empty', prefix: ''}],
      displayData: ['-0/0.5', '1.91'],
      type: 2
    }
  },

  ou: function (obj) {
    return {
      displayName: 'O/U',
      cssClassName: 'colg-1st',
      playWay: [{type: 'Over', prefix: 'O'}, {type: 'Under', prefix: 'U'}, {type: 'empty', prefix: ''}],
      displayData: ['O 2/2.5', '1.91'],
      type: 2
    }
  },

  onetwo: function (obj) {
    return {
      displayName: '1x2',
      cssClassName: 'colg-1st gap',
      playWay: [{type: '', prefix: ''}, {type: '', prefix: ''}, {type: 'Draw', prefix: 'Draw'}],
      displayData: ['O 2/2.5', '1.91']
    }
  },

  onetwoHD: function (obj) {
    return {
      displayName: '1x2 HD',
      cssClassName: 'colg-2nd',
      playWay: [{type: 'less', prefix: '-'}, {type: 'more', prefix: '+'}, {type: 'empty', prefix: ''}],
      displayData: ['O 2/2.5', '1.91']
    }
  },

  oneHou: function (obj) {
    return {
      displayName: '1H O/U',
      cssClassName: 'colg-2nd',
      playWay: [{type: 'Over', prefix: 'O'}, {type: 'Under', prefix: 'U'}, {type: 'empty', prefix: ''}],
      displayData: ['O 2/2.5', '1.91']
    }
  },

  oneHonetwo: function (obj) {
    return {
      displayName: '1H 1x2',
      cssClassName: 'colg-2nd gap',
      playWay: [{type: '', prefix: ''}, {type: '', prefix: ''}, {type: 'Draw', prefix: 'Draw'}],
      displayData: ['O 2/2.5', '1.91']
    }
  },

  nextGoal: function (obj) {
    return {
      displayName: 'Next Goal',
      cssClassName: 'colg-3rd',
      playWay: [{type: '2nd', prefix: '2nd'}, {type: '2nd', prefix: '2nd'}, {type: '+', prefix: '+'}],
      displayData: ['O 2/2.5', '1.91']
    }
  },

  btts: function (obj) {
    return {
      displayName: 'BTTS',
      cssClassName: 'colg-3rd',
      playWay: [{type: 'Yes', prefix: 'Yes'}, {type: 'No', prefix: 'No'}, {type: 'empty', prefix: ''}],
      displayData: ['O 2/2.5', '1.91']
    }
  },

  oe: function (obj) {
    return {
      displayName: 'Odd / Even',
      cssClassName: 'colg-3rd gap',
      playWay: [{type: 'Odd', prefix: 'Odd'}, {type: 'Even', prefix: 'Even'}, {type: 'empty', prefix: ''}],
      displayData: ['O 2/2.5', '1.91']
    }
  },

  teamGoalou: function (obj) {
    return {
      displayName: 'Team Goal O/U',
      cssClassName: 'colg-4th',
      colSpanNumber: 2,
      playWay: [{type: 'Over', prefix: 'O'}, {type: 'Under', prefix: 'U'}, {type: 'empty', prefix: ''}, {type: 'Over', prefix: 'O'}, {type: 'Under', prefix: 'E'}, {type: 'empty', prefix: ''}],
      displayData: ['O 2/2.5', '1.91']
    }
  }
}

let betTypeOdd = {
  cssClassName: '',
  displayData: [],
  type: 0
}
let oddsData = {
  id: 0,
  betTypeTitle: {
    cssClassName: '',
    displayName: '',
    colSpanNumber: 1
  },
  betTypeOdds: []
}
let teamNames = {
  id: 0,
  name: '',
  score: '0'
}
let marketlineData = {
  teamNames: [],
  oddsDatas: []
}
let event = {
  isFirst: false,
  maketlineDatas: marketlineData
}
let competition = {
  competitionName: '',
  isCollapse: false,
  events: [] // push event
}


function _getCompetition (competitionCount, marketlineCount) {
  let _competitions = []
  let _singleCompetition = extend(true, {}, competition)

  for (let i = 0; i < competitionCount; i++) {
    _singleCompetition.isCollapse = false
    _singleCompetition.competitionName = ['COMPETITION NAME ', i].join('')
    _singleCompetition.events = _getEvents(marketlineCount)

    _competitions.push(_singleCompetition)
  }

  return _competitions
}

function _getEvents (marketlineCount) {
  let _events = []

  for (let i = 0; i < marketlineCount; i++) {
    let _singleEvent = extend(true, {}, event)
    _singleEvent.isFirst = i === 0 ? true : false
    _singleEvent.marketlineDatas = _getmarketlineDatas()
    _events.push(_singleEvent)
  }

  return _events
}

function _getmarketlineDatas () {
  let _marketlines = extend(true, {}, marketlineData)

  _marketlines.teamNames = _getTeamName(2)
  _marketlines.oddsDatas = _getOddsData()

  return _marketlines
}

function _getTeamName (teamCount) {
  let _teamNameDatas = []
  for (let i = 0; i < teamCount; i++) {
    let _singleTeam = extend(true, {}, teamNames)
    _singleTeam.id = i + 1
    _singleTeam.name = ['Hendra Setiawan', ' / ', 'Team Name Long Long name', i].join('')
    _singleTeam.score = i
    _teamNameDatas.push(_singleTeam)
  }

  return _teamNameDatas
}

function _getOddsData () {
  let _oddsData = [],
    currentId = 0
  for (let i = 0; i < Object.keys(allBettypeRule).length; i++) {
    let currentBetType = allBettypeRule[Object.keys(allBettypeRule)[i]]()
    let _singleOddsData = extend(true, {}, oddsData)
    _singleOddsData.id = currentId = i + 1
    _singleOddsData.betTypeTitle.cssClassName = currentBetType.cssClassName
    _singleOddsData.betTypeTitle.displayName = currentBetType.displayName
    _singleOddsData.betTypeTitle.colSpanNumber = currentBetType.colSpanNumber ? currentBetType.colSpanNumber : oddsData.betTypeTitle.colSpanNumber

    currentBetType.playWay.forEach(playType => {
      let _singleBetTypeOdd = extend(true, {}, betTypeOdd, {type: 2, cssClassName: currentBetType.cssClassName})

      switch (playType.type.toLowerCase()) {
        case 'less':
        case 'more':
          _singleBetTypeOdd.displayData = [[playType.prefix, '0/0.5'].join(''), _getOddsNumber()]
          _singleBetTypeOdd.type = 2
          break
        case 'over':
        case 'under':
          _singleBetTypeOdd.displayData = [[playType.prefix, ' 2/2.5'].join(''), _getOddsNumber()]
          _singleBetTypeOdd.type = 2
          break
        case 'draw':
        case 'odd':
        case 'even':
        case 'yes':
        case 'no':
        case '2nd':
          _singleBetTypeOdd.displayData = [playType.prefix, _getOddsNumber()]
          _singleBetTypeOdd.type = 2
          break
        case '+': // next goal last
          _singleBetTypeOdd.displayData = [[playType.prefix, _getOddsNumber()].join(''), 'Draw']
          _singleBetTypeOdd.type = 2
          break
        case '': // only odds number
          _singleBetTypeOdd.displayData = [ _getOddsNumber()]
          _singleBetTypeOdd.type = 1
          break

        case 'empty': // no odds data, only schema
          _singleBetTypeOdd.type = 0
          break
      }

      _singleOddsData.betTypeOdds.push(_singleBetTypeOdd)
    })

    _oddsData.push(extend(true, {}, _singleOddsData))
  }

  let _lastSingleOddsData = extend(true, {}, oddsData)
  _lastSingleOddsData.id = currentId + 1
  _lastSingleOddsData.betTypeTitle.cssClassName = 'colg-4th gap blank'
  _lastSingleOddsData.betTypeTitle.colSpanNumber = 0
  delete _lastSingleOddsData.betTypeTitle.displayName

  _oddsData.push(extend(true, {}, _lastSingleOddsData))

  return _oddsData
}

function _getOddsNumber (typeName) {
  switch (typeName) { // HK, decimal, indo, Malay
    default:
      return Math.round((Math.random() * (5 - 0.2) + 0.2) * 100) / 100
  }
}

router.get('/', function (req, res, next) {
  let _competition = []
  let competitionCount = req.query.compet || 1
  let marketlineCount = req.query.marketline || 1

  res.json(_getCompetition(competitionCount, marketlineCount))
})

module.exports = router
