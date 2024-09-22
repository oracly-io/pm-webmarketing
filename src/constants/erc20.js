export const PARI = 'PARI'
export const USDC = 'USDC'
export const USDT = 'USDT'
export const WETH = 'WETH'
export const WBTC = 'WBTC'
export const UNKNOWN = 'UNKNOWN'

export const PARI_ADDRESS = '0x387920cbc6e3a3e054a791c74c8160bbc016fdf4'
export const USDC_ADDRESS = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
export const USDT_ADDRESS = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
export const WETH_ADDRESS = '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'
export const WBTC_ADDRESS = '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6'

export const ERC20 = {
  PARI: PARI_ADDRESS,
  USDC: USDC_ADDRESS,
  USDT: USDT_ADDRESS,
  WETH: WETH_ADDRESS,
  WBTC: WBTC_ADDRESS,

  [PARI_ADDRESS]: PARI,
  [USDC_ADDRESS]: USDC,
  [USDT_ADDRESS]: USDT,
  [WETH_ADDRESS]: WETH,
  [WBTC_ADDRESS]: WBTC,

  SYMBOL: {
    [PARI]: PARI,
    [USDC]: USDC,
    [USDT]: USDT,
    [WETH]: WETH,
    [WBTC]: WBTC,
  },
  ADDRESS: {
    [PARI]: PARI_ADDRESS,
    [USDC]: USDC_ADDRESS,
    [USDT]: USDT_ADDRESS,
    [WETH]: WETH_ADDRESS,
    [WBTC]: WBTC_ADDRESS,
  },
  DECIMALS: {
    [PARI]: 18,
    [USDC]: 6,
    [USDT]: 6,
    [WETH]: 18,
    [WBTC]: 18,
  },
  SYMBOLS: [
    USDT,
    USDC,
    PARI,
    WETH,
    WBTC,
  ]
}
