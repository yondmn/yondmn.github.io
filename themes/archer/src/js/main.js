import init from './init'
import { scroll } from './scroll'
import './initSidebar'
import { initMobile } from './mobile'
import InitSidebarLink from './tag'
import fancybox from './fancybox'

// print custom info
init()

// init mobile
initMobile()

// scroll event
scroll()

// init sidebar link
const metas = new InitSidebarLink()
metas.addTab({
  metaName: 'tags',
  labelsContainer: '.sidebar-tags-name',
  postsContainer: '.sidebar-tags-list',
})

metas.addTab({
  metaName: 'categories',
  labelsContainer: '.sidebar-categories-name',
  postsContainer: '.sidebar-categories-list',
})

// fancybox
fancybox()
