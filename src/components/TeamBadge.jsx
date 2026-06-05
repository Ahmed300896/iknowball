const CODES = {
  'United States':       'USA',
  'Bosnia & Herzegovina':'BIH',
  'South Korea':         'KOR',
  'South Africa':        'RSA',
  'Saudi Arabia':        'KSA',
  'New Zealand':         'NZL',
  'Ivory Coast':         'CIV',
  'Cape Verde':          'CPV',
  'DR Congo':            'COD',
  'Netherlands':         'NED',
  'Switzerland':         'SUI',
  'Czechia':             'CZE',
  'Germany':             'GER',
  'Argentina':           'ARG',
  'Australia':           'AUS',
  'Belgium':             'BEL',
  'Brazil':              'BRA',
  'Canada':              'CAN',
  'Colombia':            'COL',
  'Croatia':             'CRO',
  'Ecuador':             'ECU',
  'Egypt':               'EGY',
  'England':             'ENG',
  'France':              'FRA',
  'Germany':             'GER',
  'Ghana':               'GHA',
  'Haiti':               'HAI',
  'Iran':                'IRN',
  'Iraq':                'IRQ',
  'Japan':               'JPN',
  'Jordan':              'JOR',
  'Mexico':              'MEX',
  'Morocco':             'MAR',
  'Norway':              'NOR',
  'Panama':              'PAN',
  'Paraguay':            'PAR',
  'Portugal':            'POR',
  'Qatar':               'QAT',
  'Scotland':            'SCO',
  'Senegal':             'SEN',
  'Spain':               'ESP',
  'Sweden':              'SWE',
  'Tunisia':             'TUN',
  'Turkiye':             'TUR',
  'Uruguay':             'URU',
  'Uzbekistan':          'UZB',
  'Algeria':             'ALG',
  'Austria':             'AUT',
  'Curacao':             'CUR',
}

function teamCode(name) {
  return CODES[name] ?? name.slice(0, 3).toUpperCase()
}

export default function TeamBadge({ team, size = 30, color }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color ?? '#141b30',
        border: '1px solid #2a3354',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: 'Oswald, sans-serif',
          fontWeight: 700,
          fontSize: Math.round(size * 0.3),
          color: '#ffffff',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {teamCode(team)}
      </span>
    </div>
  )
}
