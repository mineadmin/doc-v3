import type { DefaultTheme } from 'vitepress'

export const mainProductVersion = 'v3'

export const productVersions = [
  {
    key: 'v3',
    label: '3.x',
    link: '/v3/guide/introduce/mineadmin'
  }
] as const

export const libraries = [
  {
    key: 'ma-form',
    name: 'MaForm',
    packageName: '@mineadmin/form',
    latest: 'latest',
    versions: ['latest']
  },
  {
    key: 'ma-table',
    name: 'MaTable',
    packageName: '@mineadmin/table',
    latest: 'latest',
    versions: ['latest']
  },
  {
    key: 'ma-search',
    name: 'MaSearch',
    packageName: '@mineadmin/search',
    latest: 'latest',
    versions: ['latest']
  },
  {
    key: 'ma-pro-table',
    name: 'MaProTable',
    packageName: '@mineadmin/pro-table',
    latest: 'latest',
    versions: ['latest']
  }
] as const

export interface LibrarySidebarLabels {
  title: string
  overview: string
  currentVersion: string
}

export function createProductVersionNavItems(): DefaultTheme.NavItemWithLink[] {
  return productVersions.map(version => ({
    text: version.label,
    link: version.link
  }))
}

export function createLibraryNavItems(): DefaultTheme.NavItemWithLink[] {
  return libraries.map(library => ({
    text: `${library.name} (${library.packageName})`,
    link: `/libs/${library.key}/${library.latest}/`
  }))
}

export function createLibrarySidebar(labels: LibrarySidebarLabels): DefaultTheme.SidebarItem[] {
  return [
    {
      text: labels.title,
      collapsed: false,
      items: [
        {
          text: labels.overview,
          link: '/libs/'
        },
        ...libraries.map(library => ({
          text: library.name,
          link: `/libs/${library.key}/${library.latest}/`,
          collapsed: false,
          items: library.versions.map(version => ({
            text: version === library.latest ? labels.currentVersion : version,
            link: `/libs/${library.key}/${version}/`
          }))
        }))
      ]
    }
  ]
}
