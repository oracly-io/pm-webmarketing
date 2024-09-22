export function init() {
  initMobileMenu()
}

function initMobileMenu() {
  const mobileMenuItemEls = document.querySelectorAll('.menumobile__item')
  const menumobileToggleEl = document.getElementById('menumobile__toggle')
  const menumobileOuterBG = document.getElementById('menumobile__outer-bg')

  const handleClick = () => (menumobileToggleEl.checked = false)

  for (const menuItemEl of mobileMenuItemEls) {
    if (menuItemEl.classList.contains('menumobile__item--list')) continue
    menuItemEl.addEventListener('click', handleClick)
  }

  menumobileOuterBG.addEventListener('click', handleClick)

  const poppers = document.querySelectorAll('.popper')
  for (const popper of poppers) {
    popper.addEventListener('click', function () {
      const prevTimeoutid = this.getAttribute('data-timeoutid')
      if (prevTimeoutid) clearTimeout(prevTimeoutid)

      const value = this.getAttribute('data-value')
      if (value) navigator.clipboard.writeText(value)

      this.classList.add('popper--active')

      const timeoutid = setTimeout(() => {
        this.classList.remove('popper--active')
        this.removeAttribute('data-timeoutid')
      }, 1000)
      this.setAttribute('data-timeoutid', timeoutid)
    })
  }

  const menuListItems = document.querySelectorAll('.menu__item--list')
  for (const item of menuListItems) {
    item.addEventListener('click', function (e) {

      const activeClassName = 'menu__item--list--active'

      const onClickOutside = (e) => {
        if (!this.nextElementSibling?.contains(e.target) || this.contains(e.target)) {
          this.classList.remove(activeClassName)
          window.removeEventListener('click', onClickOutside)
        }
      }

      if (!this.classList.contains(activeClassName)) {
        e.stopPropagation()
        this.classList.add(activeClassName)
        window.addEventListener('click', onClickOutside)
      }

    })
  }

  const mobileMenuListItems = document.querySelectorAll('.menumobile__item--list')
  for (const item of mobileMenuListItems) {
    item.addEventListener('click', function () {

      const activeClassName = 'menumobile__item--list--active'

      if (this.classList.contains(activeClassName)) {
        this.classList.remove(activeClassName)
      } else {
        this.classList.add(activeClassName)
      }

    })
  }

}