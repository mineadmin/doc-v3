# Preparation Work

::: tip
To develop MineAdmin applications; first, familiarize yourself with MineAdmin and the Hyperf framework, then proceed with the following preparations.
:::

## Obtain AccessToken

MineAdmin requires `ACCESS_TOKEN` for downloading plugin applications, updating plugin applications, or developing plugin applications.

Steps to obtain:

- Log in to the [MineAdmin](https://www.mineadmin.com/login) official website.
- Go to the `Personal Center` and navigate to the [_Settings_](https://www.mineadmin.com/member/setting) page.
- Click to view `My AccessToken`.

::: danger

---

Note

Please keep your AccessToken secure and do not leak it!!!

---

:::

## Configure Backend .env File

Open the _.env_ file in the backend root directory, locate the **MINE_ACCESS_TOKEN** item, and paste the copied string after the **equals sign**.

```ini [.env]
APP_NAME = MineAdmin

APP_ENV = dev

# Omitted...

MINE_ACCESS_TOKEN = 107299501236086
```

## Apply for Developer Status

If you are only developing applications locally for personal use, you do not need developer certification permissions, and you can distribute them to anyone.

If you plan to publish your application on the official marketplace, you need to undergo developer certification before you can release your application, and it will be protected by official copyright.

Currently, online certification applications are not supported. You need to contact **MineAdmin team members** to grant you developer permissions.