import data from '@data'

export function init() {
  initSearchParams()
}

function initSearchParams() {
  const url = new URL(window.location)

  if (
    url.searchParams.has(data.search_params.white_paper)
  ) {

    // Show white-paper
    const wpEl = document.getElementById('white-paper')
    if (!wpEl.classList.contains('documentation--active')) {
      wpEl.classList.add('documentation--active')
    }

    // Scroll to anchor
    const contentEl = wpEl.querySelector('#documentation__content')
    const headerEl = wpEl.querySelector('#documentation__header')
    const anchorEl = url.hash && wpEl.querySelector(url.hash)
    if (anchorEl) {
      const top = anchorEl.offsetTop - headerEl.offsetHeight
      contentEl.scroll({ top, behavior: 'instant' })
    }

  }
}
