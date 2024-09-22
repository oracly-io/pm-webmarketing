module.exports = {
  search_params: {
    white_paper: 'wp',
    documentation: 'doc',
  },
  blockchain_explorer: 'https://polygonscan.com',
  game: {
    pricefeed: '0xc907e116054ad103354f2d350fd2514433d57f6f',
    erc20: '0x14c3e66b466c9dc6a532612185bdb552af5a2598',
    positioning: 60,
    schedule: 120,
    expiration: 86400,
    version: 1,
    minWager: '1',
    gameid: '0xe4bda4ac66cc854d7bf7b9115cda34cdcb0f7a10219b22457f182104e09cfee1',
    base: 'BTC',
    quote: 'USD',
    name: 'BTC/USD',
    level: 'BRONZE',
    currency: 'DEMO'
  },
  links: {
    pm_app: 'https://app.oracly.io/webtrader',
    discord: 'https://discord.gg/BwJd94qU',
    github: 'https://github.com/oracly-io',
    twitter: 'https://x.com/oraclyprotocol',
    telegram: 'https://t.me/oracly_protocol',
    medium: 'https://oracly.medium.com',
    app_store_link: 'https://mapp.oracly.io',
    google_play_link: 'https://mapp.oracly.io',
  },
  contracts: [
    {
      name: 'OraclyV1',
      address: '0xf41c3bec833bf3b05834b8459ee70816d167cf37',
    },
    {
      name: 'StakingOraclyV1',
      address: '0x55135638b6301a700070bf08c9b0ef67caf875e4',
    },
    {
      name: 'MentoringOraclyV1',
      address: '0xda4a5d10fd2525b83558f66a24c0c012d67d45a5',
    },
    {
      name: 'MetaOraclyV1',
      address: '0x9acff323637f765fa770c3d1cdbc76bfbfdb4fa8',
    },
    {
      name: 'ORCY',
      address: '0x8def651cbf7deaa35835ed6d4a4d4daabb8b898b',
    },
    {
      name: 'DEMO',
      address: '0xde41431172704248b723a36d00044f8132fa444e',
    },
    {
      name: 'VestingGrowth',
      address: '0x39ee332b91dc58d6ca668bf874df539cae158016',
    },
    {
      name: 'VestingTeam',
      address: '0xd8708ea8214da5a170edac19d9a50c0fffd1b5dc',
    },
    {
      name: 'VestingSeed',
      address: '0xdd084b37837eb0da72abd817375045d22bf73e93',
    },
  ]
}
