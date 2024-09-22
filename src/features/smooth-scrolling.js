import { updateUrlHash } from '@utils'

export function init() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()

      const selector = this.getAttribute('href')
      updateUrlHash(selector)
      document.querySelector(selector).scrollIntoView({
          behavior: 'smooth'
      })
    })
  })
}