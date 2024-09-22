import { debounce, get, throttle } from 'lodash'

import data from '@data'
import logger from '@lib/logger'
import { updateSearchParam, removeSearchParam } from '@utils'
import { removeUrlHash } from '@utils'

export function init() {
  initOpen()
  initClose()
  initMenuOpenClose()
  initMenu()
  initToTop()
  initSearchParams()
}

function initMenu() {
  const documentationEls = document.getElementsByClassName('documentation')

  function getTitleId(scrollTop, offsets) {
    const [id] = Object.entries(offsets).find(([, { offsetTop, height }]) =>
      (scrollTop >= offsetTop) && (scrollTop < (offsetTop + height))
    ) || []
    return id
  }

  for (const documentationEl of documentationEls) {
    const menuEl = documentationEl.querySelector('#documentation__menu')
    const contentEl = documentationEl.querySelector('#documentation__content')
    const headerEl = documentationEl.querySelector('#documentation__header')
    const menuDepth = documentationEl.getAttribute('data-menu-depth')

    const headingsSelector = Array.from(Array(+menuDepth)).map((_, i) => `h${i+1}`).join(', ')
    const headings = contentEl.querySelectorAll(headingsSelector)
    let offsets = calcHeadingsOffsets(headings, contentEl.scrollHeight)
    window.addEventListener('resize', () =>
      (offsets = calcHeadingsOffsets(headings, contentEl.scrollHeight)),
      true
    )

    const firsTtitleId = `#${get(headings, '0.id')}`
    highlightMenuTitle(menuEl, firsTtitleId)
    contentEl.addEventListener('scroll', debounce(function() {
      const scrollTop = this.scrollTop+headerEl.offsetHeight+1
      const titleid = getTitleId(scrollTop, offsets) || firsTtitleId
      highlightMenuTitle(menuEl, titleid)
    }), 100)
  }
}

function initToTop() {
  const documentationEls = document.getElementsByClassName('documentation')

  for (const documentationEl of documentationEls) {
    const contentEl = documentationEl.querySelector('#documentation__content')
    const paperToTopEl = documentationEl.querySelector('#documentation__to-top')

    contentEl.addEventListener('scroll', throttle(function(e) {
      const showOffset = 3 * this.clientHeight
      if (this.scrollTop > showOffset) paperToTopEl.classList.add('documentation__to-top--active')
      else paperToTopEl.classList.remove('documentation__to-top--active')
    }), 100)

    paperToTopEl.addEventListener('click', function() {
      contentEl.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }
}

function initMenuOpenClose() {
  const activeMenuClassName = 'documentation__menu--active'
  const documentationEls = document.getElementsByClassName('documentation')

  for (const documentationEl of documentationEls) {
    const menuEl = documentationEl.querySelector('#documentation__menu')
    const menuToggleEl = documentationEl.querySelector('#documentation__menu-toggle')

    // eslint-disable-next-line no-inner-declarations
    function handleClickOutsideForMenu(e) {
      const ignoredClasses = [
        'documentation__menu-toggle',
        'documentation__menu-toggle-content',
        'documentation__menu-content',
        'documentation__menu-sub-menu',
        'documentation__menu-item',
      ]
      if (ignoredClasses.some((className) => e.target.classList.contains(className))) return
      menuEl.classList.remove(activeMenuClassName)
      document.removeEventListener('click', handleClickOutsideForMenu)
    }

    menuToggleEl.addEventListener('click', (e) => {
      e.stopPropagation()
      if (menuEl.classList.contains(activeMenuClassName)) {
        menuEl.classList.remove(activeMenuClassName)
        document.removeEventListener('click', handleClickOutsideForMenu)
      } else {
        menuEl.classList.add(activeMenuClassName)
        document.addEventListener('click', handleClickOutsideForMenu)
      }
    })
  }

}

function initOpen() {
  const activeClassName = 'documentation--active'
  const buttonEls = document.getElementsByClassName('documentation-button')

  for (const buttonEl of buttonEls) {
    const targetid = buttonEl.getAttribute('data-target-id')
    const searchParam = buttonEl.getAttribute('data-search-param')

    const targetEl = document.getElementById(targetid)

    buttonEl.addEventListener('click', (e) => {
      e.preventDefault()
      targetEl && targetEl.classList.add(activeClassName)
      updateSearchParam(searchParam)
    })
  }
}

function initClose() {
  const activeClassName = 'documentation--active'
  const documentationEls = document.getElementsByClassName('documentation')

  for (const documentationEl of documentationEls) {
    const closeEl = documentationEl.querySelector('#documentation-close')
    const searchParam = closeEl && closeEl.getAttribute('data-search-param')

    closeEl && closeEl.addEventListener('click', () => {
      documentationEl.classList.remove(activeClassName)
      searchParam && removeSearchParam(searchParam)
      removeUrlHash()
    })
  }
}

function initSearchParams() {
  const url = new URL(window.location)

  if (
    url.searchParams.has(data.search_params.documentation)
  ) {

    // Show documentation
    const documentationEl = document.getElementById('documentation')
    if (!documentationEl.classList.contains('documentation--active')) {
      documentationEl.classList.add('documentation--active')
    }

    // Scroll to anchor
    const contentEl = documentationEl.querySelector('#documentation__content')
    const headerEl = documentationEl.querySelector('#documentation__header')
    const anchorEl = url.hash && documentationEl.querySelector(url.hash)
    if (anchorEl) {
      const top = anchorEl.offsetTop - headerEl.offsetHeight
      contentEl.scroll({ top, behavior: 'instant' })
    }

  }
}

function highlightMenuTitle(rootEl, id) {
  const activeTitleEls = rootEl.querySelectorAll('.documentation__menu-item--active')
  for (const activeTitleEl of activeTitleEls) {
    activeTitleEl.classList.remove('documentation__menu-item--active')
  }

  let titleEl = rootEl.querySelector(`[href='${id}']`)
  while (id && titleEl && titleEl) {
    titleEl.classList.add('documentation__menu-item--active')
    titleEl = titleEl.parentElement
    if (titleEl.tagName === 'UL') titleEl = titleEl.previousElementSibling
    if (titleEl.classList.contains('documentation__menu-content')) titleEl = null
  }
}

function calcHeadingsOffsets(headings, scrollHeight) {
  const offsets = {}
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i]
    const nextHeading = headings[i+1]
    const offset = heading.offsetTop
    const nextOffset = nextHeading ? nextHeading.offsetTop : scrollHeight
    const id = `#${heading.id}`
    if (offsets[id]) {
      logger.error(`Dublicated element id ${id} in documentation menu. Navigation behavior could be wrong. Give title a unique id in the remote markdown file to fix this issue.`)
    } else {
      offsets[id] = { offsetTop: offset, height: nextOffset - offset }
    }
  }
  return offsets
}
