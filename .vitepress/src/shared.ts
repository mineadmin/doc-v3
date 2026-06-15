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
    status: 'stable' as BackendFrameworkStatus,
    link: '/v3/backend/frameworks/hyperf/'
  },
  {
    key: 'laravel',
    name: 'Laravel',
    language: 'PHP',
    status: 'planned' as BackendFrameworkStatus,
    link: '/v3/backend/frameworks/laravel/'
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
  labels: BackendFrameworkStatusLabels,
  itemsByFramework: Record<string, DefaultTheme.SidebarItem[]> = {}
): DefaultTheme.SidebarItem[] {
  return backendFrameworks.map(framework => {
    const items = itemsByFramework[framework.key]

    return {
      text: `${framework.name} (${framework.language} / ${labels[framework.status]})`,
      link: framework.link,
      collapsed: framework.status !== 'stable',
      ...(items ? { items } : {})
    }
  })
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
