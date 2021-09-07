import { Snowflake } from 'discord.js'
import { Letter } from './types'

export const Thumbsup = '👍'

export const Letters = new Map<Letter, string>([
  ['A', '🇦'],
  ['B', '🇧'],
  ['C', '🇨'],
  ['D', '🇩'],
  ['E', '🇪'],
  ['F', '🇫'],
  ['G', '🇬'],
  ['H', '🇭'],
  ['I', '🇮'],
  ['J', '🇯'],
  ['K', '🇰'],
  ['L', '🇱'],
  ['M', '🇲'],
  ['N', '🇳'],
  ['O', '🇴'],
  ['P', '🇵'],
  ['Q', '🇶'],
  ['R', '🇷'],
  ['S', '🇸'],
  ['T', '🇹'],
  ['U', '🇺'],
  ['V', '🇻'],
  ['W', '🇼'],
  ['X', '🇽'],
  ['Z', '🇿'],
  ['Y', '🇾'],
])

export const People = new Map<Snowflake, string | string[]>([
  ['676102360321490965', 'hoangtinh:882206402242834443'],
  ['686607728407609453', 'thanhthong:883004317718679662'],
  ['675768315356119061', 'duytrang:883007557558497280'],
  ['608686307497082882', 'hoangdoan:883045258173218876'],
  [
    '636186932669579289',
    ['truongtit:883008666171748383', 'daxua:883731640625557514'],
  ],
  ['679609129228173390', 'hauvon:883042527870062602'],
  ['679015400507441173', 'huychieu:883006691933814824'],
  ['621326534803849218', 'ducbinh:883032757498945608'],
  ['616278195565625364', 'cuphu:883002171547865088'],
  ['616299361114128386', 'hoathitlon:884115340743802950'],
  ['807619620257005609', 'thaitram:884770516089569320'],
  [
    '749682568433238066',
    ['hongha:883361225583509504', 'ngiutui:883680152586977320'],
  ],
])
