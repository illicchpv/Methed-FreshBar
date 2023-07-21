const API_URL = "https://pvis0api0fresh.glitch.me/" // "https://sunset-mica-decimal.glitch.me/"

const log = console.log
const error = console.error


const getData = async () => {
  const url = `${API_URL}api/goods` // API_URL + 'api/goods'
  try {
    const resp = await fetch(url).then()
    const data = await resp.json()
    return data
  } catch (err) {
    error(err)
  } finally {
    log('finally')
  }
}

const createCard = (item) => {
  const cocktail = document.createElement('article')
  cocktail.classList.add('goods__card')
  cocktail.classList.add('cocktail')
  // 
  cocktail.innerHTML = `
  <img class="cocktail__img" src="${API_URL}${item.image}" alt="коктейл ${item.title}"
    width="256" height="304">

  <div class="cocktail__content">
    <div class="cocktail__text">
      <h3 class="cocktail__title">
        ${item.title}
      </h3>

      <p class="cocktail__price text-red">${item.price}&nbsp;₽</p>
      <p class="cocktail__size">${item.size}мл</p>
    </div>

    <button class="btn cocktail_btn cocktail_btn_make" data-id="${item.id}">Добавить</button>
  </div>
  `;
  return cocktail;
}

const scrollService = {
  scrollPosition: 0,
  desableScroll(){
    this.scrollPosition = window.scrollY;
    log('scrollPosition:', this.scrollPosition)
    document.documentElement.style.scrollBehavior = 'auto'
    document.body.style.cssText = `
    overflow: hidden;
    position: fixed;
    top: -${this.scrollPosition}px;
    left: 0;
    height: 100vh;
    width: 100vw;
    padding-right: ${window.innerWidth-document.body.offsetWidth}px;
` // document.body.offsetWidth - ширина страницы(документа)
  // window.innerWidth - ширина окна браузера
  },
  enableScroll(){
    document.body.style.cssText = ''
    window.scroll({top: this.scrollPosition})
    document.documentElement.style.scrollBehavior = ''
  },
}

const modalController = ({ modal, btnOpen, time = 300 }) => {
  const buttonEl = document.querySelector(btnOpen)
  const modalEl = document.querySelector(modal)
  // modalEl.style.cssText = `
  // display:none;
  // visibility: hidden;
  // opacity: 0;
  // transition: opacity ${time}ms ease-in-out;
  // `;
  modalEl.style.cssText = `
  display:initial;
  visibility: hidden;
  opacity: 0;
  transition: opacity ${time}ms ease-in-out;
  `;
  const closeModal = (e) => {
    const target = e.target
    const code = e.code
    
    if(target === modalEl || code === 'Escape'){
      modalEl.style.opacity = 0
      setTimeout(()=>{ 
        modalEl.style.visibility = 'hidden' 
        scrollService.enableScroll()
      }, time)

      window.removeEventListener('keydown', closeModal)
    }
  }
  const openModal = () => {
    modalEl.style.visibility = 'visible'
    modalEl.style.opacity = 1

    window.addEventListener('keydown', closeModal)
    scrollService.desableScroll()
  }
  buttonEl.addEventListener('click', (e) => {
    openModal()
  })
  modalEl.addEventListener('click', (e) => {
    closeModal(e)
  })

  return {openModal, closeModal}
}
const init = async () => {
  modalController({modal: '.modal_order', btnOpen: '.header__btn-order' })
  modalController({modal: '.modal_make', btnOpen: '.cocktail_btn_make' })
  // const headerBtnOrder = document.querySelector('.header__btn-order')
  // headerBtnOrder.addEventListener('click', (e)=>{

  //   document.querySelector('.modal_order')
  // })

  const goodsListEl = document.querySelector('.goods__list')
  log('goodsListEl:', goodsListEl)
  const data = await getData()
  log('data:', data)

  const cardsCocktail = data.map((item) => {
    const li = document.createElement('li')
    li.classList.add('goods__item')
    //li.textContent = item.title
    li.append(createCard(item))
    return li
  })
  goodsListEl.append(...cardsCocktail)
}

init()