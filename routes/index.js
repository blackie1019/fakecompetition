let express = require('express')
let router = express.Router()
let extend = require('extend')
let fs = require('fs')
let path = require('path')

const request = require('request')
const querystring = require('querystring')

let allBettypeRule = () => {
  let vm = {
    postProcess: (me, result) => {
      let _result = extend(true, {}, betTypeOdd)
      delete _result.displayName
      _result.cssClassName = me.cssClassName
      result.push(extend(true, {}, _result))
      return result
    },
    // Handicap, O/U
    dDoubleModel: (me, config, data, padding) => {
      let result = []
      let offset = 4,
        realPadding = padding || 0

      pos = (1 + (realPadding * 8))
      for (let i = 0; i < 2; i++) {
        let _result = extend(true, {}, betTypeOdd, me)


        ;((_result) => {
          _result.displayData = []
          _result.displayData.push(data[(pos)])
          _result.displayData.push(data[(pos + offset)])

          delete _result.displayName
          result.push(extend(true, {}, _result))
        })(_result)
        pos += 2
      }

      return result
    },
    TrupleModel: (me, config, data) => {
      let result = []
      let offset = 1
      for (let i = 0; i < config.playWay.length; i++) {
        let _result = extend(true, {}, me)
        _result.displayData = []

        if (config.usePrefix) {
          _result.displayData = ([config.playWay[i].prefix, [data[offset]].join('')].filter(item => {
            return item !== ''
          }))
        }
        offset += 2
        _result.type = config.playWay[i].ActType || 0

        delete _result.displayName
        result.push(extend(true, {}, _result))
      }

      return result
    },
    DoubleModel: (me, config, data) => {
      let result = []
      let offset = 1
      for (let i = 0; i < config.playWay.length - 1; i++) {
        let _result = extend(true, {}, me)
        _result.displayData = []

        if (config.usePrefix) {
          _result.displayData = ([config.playWay[i].prefix, [data[offset]].join('')].filter(item => {
            return item !== ''
          }))
        }
        offset += 2

        delete _result.displayName
        result.push(extend(true, {}, _result))
      }
      return result
    },
    BttsModel: (me, config, data) => {
      let result = []
      let offset = 2,
        start = 0
      for (let i = 0; i < config.playWay.length - 1; i++) {
        let _result = extend(true, {}, me)
        _result.displayData = []

        // if (config.usePrefix) {
        _result.displayData = [data[i][start], data[i][(start + offset)]]
        // }
        // offset += 2

        delete _result.displayName
        result.push(extend(true, {}, _result))
      }
      return result
    }
  }

  return {
    // ["h2093440963", "-0.5", "h2093440964", "+0.5", "o2093440963", "0.97", "o2093440964", "0.95",
    //  "h2093440965", "-0.5/1", "h2093440966", "+0.5/1", "o2093440965", "1.20", "o2093440966", "0.75",
    //  "h2093440967", "-0/0.5", "h2093440968", "+0/0.5", "o2093440967", "0.69", "o2093440968", "1.29",
    //  "h2093440969", "0", "h2093440970", "0", "o2093440969", "0.47", "o2093440970", "1.81"]
    hdp: function (data) {
      let me = {
          displayName: 'HDP',
          cssClassName: 'colg-1st',
          displayData: ['-0/0.5', '1.91'],
          type: 2
        },
        config = {
          playWay: [{
            type: 'Less',
            prefix: '-'
          }, {
            type: 'More',
            prefix: '+'
          }, {
            type: 'empty',
            prefix: ''
          }],
          usePrefix: false
        },
        meWithConfig = extend(true, {}, me, config)

      return {
        staticData: meWithConfig,
        dynamicData: extend(true, {}, me, {
          get: (data, padding) => {
            let result = vm.dDoubleModel(me, config, data, padding)
            vm.postProcess(me, result)
            return result
          }
        })
      }
    },
    onetwoHD: function (data) {
      let me = {
          displayName: '1x2 HD',
          cssClassName: 'colg-2nd',
          displayData: ['O 2/2.5', '1.91'],
          type: 2
        },
        config = {
          playWay: [{
            type: 'Less',
            prefix: '-'
          }, {
            type: 'More',
            prefix: '+'
          }, {
            type: 'empty',
            prefix: ''
          }],
          usePrefix: false
        },
        meWithConfig = extend(true, {}, me, config)

      return {
        staticData: meWithConfig,
        dynamicData: extend(true, {}, me, {
          get: (data, padding) => {
            let result = vm.dDoubleModel(me, config, data, padding)
            vm.postProcess(me, result)
            return result
          }
        })
      }
    },

    // ["o2105352759", "2.33", "o2105352760", "2.70", "o2105352761", "3.55"]
    onetwo: function (data) {
      let me = {
          displayName: '1x2',
          cssClassName: 'colg-1st gap',
          displayData: ['O 2/2.5', '1.91'],
          type: 1
        },
        config = {
          playWay: [{
            type: '',
            prefix: '',
            ActType: 1
          }, {
            type: '',
            prefix: '',
            ActType: 1
          }, {
            type: 'Draw',
            prefix: 'Draw',
            ActType: 2
          }],
          usePrefix: true
        },
        meWithConfig = extend(true, {}, me, config)

      return {
        staticData: meWithConfig,
        dynamicData: extend(true, {}, me, {
          get: (data) => {
            let result = vm.TrupleModel(me, config, data)
            return result
          }
        })
      }
    },
    oneHonetwo: function (data) {
      let me = {
          displayName: '1H 1x2',
          cssClassName: 'colg-2nd gap',
          displayData: ['O 2/2.5', '1.91']
        },
        config = {
          playWay: [{
            type: '',
            prefix: '',
            ActType: 1
          }, {
            type: '',
            prefix: '',
            ActType: 1
          }, {
            type: 'Draw',
            prefix: 'Draw',
            ActType: 2
          }],
          usePrefix: true
        },
        meWithConfig = extend(true, {}, me, config)

      return {
        staticData: meWithConfig,
        dynamicData: extend(true, {}, me, {
          get: (data) => {
            let result = vm.TrupleModel(me, config, data)
            // vm.postProcess(me, result)
            return result
          }
        })
      }
    },

    // ["h2093440963", "-0.5", "h2093440964", "+0.5", "o2093440963", "0.97", "o2093440964", "0.95",
    //  "h2093440965", "-0.5/1", "h2093440966", "+0.5/1", "o2093440965", "1.20", "o2093440966", "0.75",
    //  "h2093440967", "-0/0.5", "h2093440968", "+0/0.5", "o2093440967", "0.69", "o2093440968", "1.29",
    //  "h2093440969", "0", "h2093440970", "0", "o2093440969", "0.47", "o2093440970", "1.81"]
    ou: function (data) {
      let me = {
          displayName: 'HDP',
          cssClassName: 'colg-1st',
          displayData: ['-0/0.5', '1.91'],
          type: 2
        },
        config = {
          playWay: [{
            type: 'Over',
            prefix: 'O'
          }, {
            type: 'Under',
            prefix: 'U'
          }, {
            type: 'empty',
            prefix: ''
          }],
          usePrefix: true
        },
        meWithConfig = extend(true, {}, me, config)

      return {
        staticData: meWithConfig,
        dynamicData: extend(true, {}, me, {
          get: (data, padding) => {
            let result = vm.dDoubleModel(me, config, data, padding)
            vm.postProcess(me, result)
            return result
          }
        })
      }
    },
    oneHou: function (data) {
      let me = {
          displayName: '1H O/U',
          cssClassName: 'colg-2nd',
          displayData: ['O 2/2.5', '1.91'],
          type: 2
        },
        config = {
          playWay: [{
            type: 'Over',
            prefix: 'O'
          }, {
            type: 'Under',
            prefix: 'U'
          }, {
            type: 'empty',
            prefix: ''
          }],
          usePrefix: true
        },
        meWithConfig = extend(true, {}, me, config)

      return {
        staticData: meWithConfig,
        dynamicData: extend(true, {}, me, {
          get: (data, padding) => {
            let result = vm.dDoubleModel(me, config, data, padding)
            vm.postProcess(me, result)
            return result
          }
        })
      }
    },

    // no data
    nextGoal: function (data) {
      let me = {
          displayName: 'Next Goal',
          cssClassName: 'colg-3rd',
          displayData: ['O 2/2.5', '1.91']
        },
        config = {
          playWay: [{
            type: '2nd',
            prefix: '2nd'
          }, {
            type: '2nd',
            prefix: '2nd'
          }, {
            type: 'Draw',
            prefix: 'Draw'
          }],
          usePrefix: true
        },
        meWithConfig = extend(true, {}, me, config)

      return {
        staticData: meWithConfig,
        dynamicData: extend(true, {}, me, {
          get: (data) => {
            let result = vm.BttsModel(me, config, data)
            vm.postProcess(me, result)
            return result
          }
        })
      }
    },
    // [["Yes", "o2105353071", "1.71"], ["No", "o2105353072", "2.15"]]
    btts: function (data) {
      let me = {
          displayName: 'BTTS',
          cssClassName: 'colg-3rd',
          displayData: ['O 2/2.5', '1.91'],
          type: 2
        },
        config = {
          playWay: [{
            type: 'Yes',
            prefix: 'Yes'
          }, {
            type: 'No',
            prefix: 'No'
          }, {
            type: 'empty',
            prefix: ''
          }],
          usePrefix: false
        },
        meWithConfig = extend(true, {}, me, config)

      return {
        staticData: meWithConfig,
        dynamicData: extend(true, {}, me, {
          get: (data) => {
            let result = vm.BttsModel(me, config, data)
            vm.postProcess(me, result)
            return result
          }
        })
      }
    },

    // ["o2105352808", "1.94", "o2105352809", "1.94"]
    // same with STAR
    oe: function (data) {
      let me = {
          displayName: 'Odd / Even',
          cssClassName: 'colg-3rd gap',
          displayData: ['O 2/2.5', '1.91'],
          type: 2
        },
        config = {
          playWay: [{
            type: 'Odd',
            prefix: 'Odd'
          }, {
            type: 'Even',
            prefix: 'Even'
          }, {
            type: 'empty',
            prefix: ''
          }],
          usePrefix: true
        },
        meWithConfig = extend(true, {}, me, config)

      return {
        staticData: meWithConfig,
        dynamicData: extend(true, {}, me, {
          get: (data) => {
            let result = vm.DoubleModel(me, config, data)
            vm.postProcess(me, result)
            return result
          }
        })
      }
    },
    // ["o2105352744", "3.65", "o2105352745", "1.94", "o2105352746", "3.15", "o2105352747", "21"]
    teamGoalou: function (data) {
      let me = {
          displayName: 'Team Goal O/U',
          cssClassName: 'colg-4th',
          colSpanNumber: 2,
          displayData: ['O 2/2.5', '1.91']
        },
        config = {
          playWay: [{
            type: 'Over',
            prefix: 'O'
          }, {
            type: 'Under',
            prefix: 'U'
          }, {
            type: 'empty',
            prefix: ''
          }, {
            type: 'Over',
            prefix: 'O'
          }, {
            type: 'Under',
            prefix: 'E'
          }, {
            type: 'empty',
            prefix: ''
          }],
          usePrefix: true
        },
        meWithConfig = extend(true, {}, me, config)

      return {
        staticData: meWithConfig,
        dynamicData: extend(true, {}, me, {
          get: (data) => {
            let result = vm.DoubleModel(me, config, data)
            vm.postProcess(me, result)
            return result
          }
        })
      }
    }
  }
}

let betTypeOddsTransform = {
  'ah': (d) => {
    return allBettypeRule().hdp()
  },
  'ou': (d) => {
    return allBettypeRule().ou()
  },
  '1x2': (d) => {
    return allBettypeRule().onetwo()
  },
  'oe': (d) => {
    return allBettypeRule().oe()
  },
  'ah1st': (d) => {
    return allBettypeRule().onetwoHD()
  },
  'ou1st': (d) => {
    return allBettypeRule().oneHou()
  },
  '1x21st': (d) => {
    return allBettypeRule().oneHonetwo()
  },

  // no data
  'tg': (d) => {
    return allBettypeRule().teamGoalou()
  },

  // schema undefined
  'oe1st': (d) => {
    return allBettypeRule().oe()
  },
  'cs': (d) => {
    return allBettypeRule().hdp()
  },
  'hf': (d) => {
    return allBettypeRule().hdp()
  },
  'tg1st': (d) => {
    return allBettypeRule().hdp()
  },
  'cs1st': (d) => {
    return allBettypeRule().hdp()
  },
  'tts1st': (d) => {
    return allBettypeRule().hdp()
  },
  'ttslast': (d) => {
    return allBettypeRule().hdp()
  },
  'bts': (d) => {
    return allBettypeRule().btts()
  },
  'eps': (d) => {
    return allBettypeRule().hdp()
  },
  'sco1st': (d) => {
    return allBettypeRule().hdp()
  },
  'scolast': (d) => {
    return allBettypeRule().hdp()
  },

  empty: function (data) {
    let me = {
      displayName: '',
      cssClassName: '',
      colSpanNumber: '',
      playWay: [],
      displayData: []
    }

    return {
      dynamicData: extend(true, {}, me, {
        get: (data) => {
          return extend(true, {
            displayName: 'No Schema'
          }, betTypeOdd)
        }
      })
    }
  },
  'cs': () => {
    return betTypeOddsTransform.empty()
  },
  'hf': () => {
    return betTypeOddsTransform.empty()
  },
  'tg1st': () => {
    return betTypeOddsTransform.empty()
  },
  'cs1st': () => {
    return betTypeOddsTransform.empty()
  },
  'tts1st': () => {
    return betTypeOddsTransform.empty()
  },
  'ttslast': () => {
    return betTypeOddsTransform.empty()
  },
  'eps': () => {
    return betTypeOddsTransform.empty()
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

  for (let i = 0; i < competitionCount; i++) {
    let _singleCompetition = extend(true, {}, competition)
    _singleCompetition.isCollapse = i === 0 ? false : true
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
    _singleEvent.maketlineDatas = _getmarketlineDatas()
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

let golbalTeamNameTimes = 0

function _getTeamName (teamCount) {
  let _teamNameDatas = []

  for (let i = 0; i < teamCount; i++) {
    let _singleTeam = extend(true, {}, teamNames)
    _singleTeam.id = i + 1
    _singleTeam.name = ['Hendra Setiawan', ' / ', 'Team Name Long Long name', golbalTeamNameTimes++].join('')
    _singleTeam.score = i
    _teamNameDatas.push(_singleTeam)
  }

  return _teamNameDatas
}

function _getOddsData () {
  let _oddsData = [],
    currentId = 0,
    fakeSeed = _getOddsNumber()
  for (let i = 0; i < Object.keys(allBettypeRule()).length; i++) {
    let currentBetType = allBettypeRule()[Object.keys(allBettypeRule())[i]]().staticData
    let _singleOddsData = extend(true, {}, oddsData)
    _singleOddsData.id = currentId = i + 1
    _singleOddsData.betTypeTitle.cssClassName = currentBetType.cssClassName
    _singleOddsData.betTypeTitle.displayName = currentBetType.displayName
    _singleOddsData.betTypeTitle.colSpanNumber = currentBetType.colSpanNumber ? currentBetType.colSpanNumber : oddsData.betTypeTitle.colSpanNumber


    ;(function (i) {
      currentBetType.playWay.forEach(playType => {
        let _singleBetTypeOdd = extend(true, {}, betTypeOdd, {
          type: 2,
          cssClassName: currentBetType.cssClassName
        })

        switch (playType.type.toLowerCase()) {
          case 'less':
          case 'more':
            _singleBetTypeOdd.displayData = [
              [playType.prefix, '0/0.5'].join(''), (Math.round((fakeSeed + (i / 100)) * 100) / 100).toString()
            ]
            _singleBetTypeOdd.type = 2
            break
          case 'over':
          case 'under':
            _singleBetTypeOdd.displayData = [
              [playType.prefix, ' 2/2.5'].join(''), (Math.round((fakeSeed + (i / 100)) * 100) / 100).toString()
            ]
            _singleBetTypeOdd.type = 2
            break
          case 'draw':
          case 'odd':
          case 'even':
          case 'yes':
          case 'no':
          case '2nd':
            _singleBetTypeOdd.displayData = [playType.prefix, (Math.round((fakeSeed + (i / 100)) * 100) / 100).toString()]
            _singleBetTypeOdd.type = 2
            break
          case '+': // next goal last
            _singleBetTypeOdd.displayData = [
              [playType.prefix, (Math.round((fakeSeed + (i / 100)) * 100) / 100).toString()].join(''), 'Draw'
            ]
            _singleBetTypeOdd.type = 2
            break
          case '': // only odds number
            _singleBetTypeOdd.displayData = [(Math.round((fakeSeed + (i / 100)) * 100) / 100).toString()]
            _singleBetTypeOdd.type = 1
            break

          case 'empty': // no odds data, only schema
            _singleBetTypeOdd.type = 0
            break
        }

        _singleOddsData.betTypeOdds.push(_singleBetTypeOdd)
      })
    })(i)

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
      // return Math.round((Math.random().toFixed(2) * (5 - 0.2) + 0.2) * 100) / 100
      return Math.round((Math.random().toFixed(2) * (1 - 0.1) + 0.1) * 100) / 100
  }
}

function _parseSTARjson (root) {
  // root.mod.d[0].c[] > competition
  // root.mod.d[0].c[*].e[] > events
  // root.mod.d[0].c[*].e[*].i[0][0] > home name
  // root.mod.d[0].c[*].e[*].i[0][1] > away name
  // root.mod.d[0].c[*].e[*].o > odds data
  // ah|ah1st|ou|ou1st % 8 = marketline (*only handicap / OU has multi-marketline)

  let docRoot = []

  if (root) {
    let isCollapse = false
    let multiMarketLineBetType = ['ah', 'ah1st', 'ou', 'ou1st']
    let actRoot
    if (Array.isArray(root.mod.d)) {
      actRoot = root.mod.d[0].c
    } else {
      actRoot = root.mod.d.c
    }
    actRoot.forEach((competRoot) => {
      let _compets = extend(true, {}, competition)
      let _events = extend(true, {}, event)

      // c.e has multiple sometimes, need to add to different marketline
      let isFirst = true
      competRoot.e.forEach(eventRoot => {
        // check marketline count, by checking ah | ah1st | ou | ou1st's length / 8 > 1
        let marketlineTimes = []
        multiMarketLineBetType.forEach(currName => {
          if (eventRoot.o.hasOwnProperty(currName)) {
            marketlineTimes.push(eventRoot.o[currName].length)
          }
        })
        let doMarketlineTimes = marketlineTimes.sort().pop() / 8
        // let eventRoot = competRoot.e[0]

        for (let marketlineCounter = 0; marketlineCounter < doMarketlineTimes; marketlineCounter++) {
          ;((flag) => {
            _events.isFirst = (flag)
          })(isFirst)
          if (isFirst) {
            isFirst = false
          }

          // competRoot.e.forEach(eventRoot => {
          let _marketlines = extend(true, {}, marketlineData)
          let BetTypeCounter = 1
          let hdpANDouList = []
          // [1:{},2:{}, ...]

          // team info
          for (let i = 0; i < 2; i++) {
            let _teamName = extend(true, {}, teamNames)
            ;((i) => {
              _teamName.id = (i + 1)
              _teamName.name = eventRoot.i[i]
              _teamName.score = (i += 1)
            })(i)
            _marketlines.teamNames.push(extend(true, {}, _teamName))
          }

          // odds info
          let _singleOdds = extend(true, {}, oddsData)
          if (marketlineCounter === 0) {
            Object.keys(eventRoot.o).forEach(oddsName => {
              // bet type counter
              ;((BetTypeCounter) => {
                _singleOdds.id = BetTypeCounter
              })(BetTypeCounter)
              BetTypeCounter++

              if (!betTypeOddsTransform.hasOwnProperty(oddsName)) {
                console.log('Not found bet type: ', oddsName)
              } else {
                let currentOddsType = betTypeOddsTransform[oddsName]().dynamicData
                let tmpBetTypeOdds = currentOddsType.get(eventRoot.o[oddsName])

                _singleOdds.betTypeTitle.cssClassName = currentOddsType.cssClassName
                _singleOdds.betTypeTitle.displayName = currentOddsType.displayName
                _singleOdds.betTypeOdds = (tmpBetTypeOdds)
              }

              _marketlines.oddsDatas.push(extend(true, {}, _singleOdds))
            })
          } else {
            multiMarketLineBetType.forEach(oddsName => {
              if (!betTypeOddsTransform.hasOwnProperty(oddsName)) {
                console.log('Not found bet type: ', oddsName)
              } else {
                let currentOddsType = betTypeOddsTransform[oddsName]().dynamicData
                let tmpBetTypeOdds = currentOddsType.get(eventRoot.o[oddsName], marketlineCounter)
                _singleOdds.betTypeTitle.cssClassName = currentOddsType.cssClassName
                _singleOdds.betTypeTitle.displayName = currentOddsType.displayName
                _singleOdds.betTypeOdds = (tmpBetTypeOdds)

                // bet type counter              

                ;((BetTypeCounter) => {
                  _singleOdds.id = BetTypeCounter
                })(BetTypeCounter)
                BetTypeCounter++
              }

              _marketlines.oddsDatas.push(extend(true, {}, _singleOdds))
            })
          }

          _events.maketlineDatas = extend(true, {}, _marketlines)
          _compets.events.push(extend(true, {}, _events))


          ;((name, flag) => {
            _compets.competitionName = name
            _compets.isCollapse = (flag)
          })(competRoot.n, isCollapse)
        }
      })
      isFirst = true
      isCollapse = true

      docRoot.push(extend(true, {}, _compets))
    })

    return docRoot
  }
}

function _getDataFromUrl (baseDomain, dataUri, pathUri, res) {
  let formData = {
    IsFirstLoad: true,
    reqUrl: pathUri
  }
  let reqHeader = {
    'Referer': [baseDomain, pathUri].join(''),
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  let contentLength = formData.length

  reqHeader['Content-Length'] = contentLength
  request({
    headers: reqHeader,
    uri: [baseDomain, dataUri].join(''),
    body: querystring.stringify(formData),
    method: 'POST'
  }, function (err, resp, body) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (body) {
      try {
        res.json(_parseSTARjson(JSON.parse(body)))
      } catch (error) {
        res.json(error)
      }
    } else {
      res.json('err')
    }
  })
}

router
  .get('/', function (req, res, next) {
    let _competition = []
    let competitionCount = req.query.compet || 1
    let marketlineCount = req.query.marketline || 1
    golbalTeamNameTimes = 0

    res.json(_getCompetition(competitionCount, marketlineCount))
  })
  .get('/local', function (req, res, next) {
    let fakeData = fs.readFile(path.join(__dirname, '../Specs/CurrentSTAR.json'), {
      encoding: 'utf8'
    }, (err, data) => {
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);
      
      res.json(_parseSTARjson(JSON.parse(data)))
    })
  })
  .get('/getreal', function (req, res, next) {
    let baseDomain = 'https://sb.188bet.com'
    let dataUri = '/en-gb/Service/CentralService?GetData'
    let pathUri = '/en-gb/sports/football/matches-by-date/today/full-time-asian-handicap-and-over-under?q=&country=TW&currency=USD&tzoff=-240&allowRacing=false&reg=China&rc=CN'
    _getDataFromUrl(baseDomain, dataUri, pathUri, res)
  })
  .get('/getuat', function (req, res, next) {
    let baseDomain = 'http://cashsbk.ngstar.sb.com'
    let dataUri = '/en-gb/Service/CentralService?GetData'
    let pathUri = '/en-gb/sports/football/competition/full-time-asian-handicap-and-over-under?q=&country=-&currency=USD&tzoff=-240&allowRacing=false&reg=ROW&rc='
    _getDataFromUrl(baseDomain, dataUri, pathUri, res)
  })

module.exports = router
