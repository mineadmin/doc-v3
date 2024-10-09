import {DefaultTheme} from "vitepress";

const nav:DefaultTheme.NavItem[] = [
    { text: 'Guide', link: '/en/guide' },
    { text: 'Frontend', link: '/en/front' },
    { text: 'Backend', link: '/en/backend' },
    { text: 'Frequently Asked Questions', link: '/en/faq' },
    {
        text: 'Old Version Documentation',
        items: [
            { text: '1.x ~ 2.x Development Documentation', link: 'https://doc.mineadmin/v1-2/index.html' },
            { text: '0.x Development Documentation', link: '/v0/' }
        ]
    }
]

export default nav