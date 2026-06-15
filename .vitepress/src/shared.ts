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

export type BackendFrameworkStatus = 'stable' | 'planned'

export const backendFrameworks = [
  {
    key: 'hyperf',
    name: 'Hyperf',
    language: 'PHP',
    latest: '3.2',
    versions: [
      {
        version: '3.2',
        status: 'stable' as BackendFrameworkStatus,
        link: '/backend/frameworks/hyperf/',
        canonicalLink: '/backend/frameworks/hyperf/3.2/',
        compatibleProductVersions: ['v3']
      },
      {
        version: '3.1',
        status: 'stable' as BackendFrameworkStatus,
        link: '/backend/frameworks/hyperf/3.1/',
        canonicalLink: '/backend/frameworks/hyperf/3.1/',
        compatibleProductVersions: ['v3']
      }
    ]
  },
  {
    key: 'laravel',
    name: 'Laravel',
    language: 'PHP',
    latest: '1.0',
    versions: [
      {
        version: '1.0',
        status: 'planned' as BackendFrameworkStatus,
        link: '/backend/frameworks/laravel/1.0/',
        canonicalLink: '/backend/frameworks/laravel/1.0/',
        compatibleProductVersions: ['v3']
      }
    ]
  }
] as const

export interface LibrarySidebarLabels {
  title: string
  overview: string
  currentVersion: string
}

export interface BackendFrameworkStatusLabels {
  stable: string
  planned: string
  latest: string
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

export function createBackendFrameworkSidebarItems(
  labels: BackendFrameworkStatusLabels
): DefaultTheme.SidebarItem[] {
  return backendFrameworks.flatMap(framework =>
    framework.versions.map(version => ({
      text: version.version === framework.latest
        ? `${framework.name} ${labels.latest} / ${version.version} (${framework.language} / ${labels[version.status]})`
        : `${framework.name} ${version.version} (${framework.language} / ${labels[version.status]})`,
      link: version.link,
      collapsed: version.status !== 'stable'
    }))
  )
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
