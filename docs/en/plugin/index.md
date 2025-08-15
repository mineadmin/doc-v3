# Preparation Work

::: tip  
To develop MineAdmin applications, first familiarize yourself with the MineAdmin and Hyperf frameworks, then complete the following preparatory steps.  
:::

## Obtain AccessToken  

MineAdmin requires an `ACCESS_TOKEN` for downloading plugin applications, updating plugin applications, or developing plugin applications.  

Steps to obtain:  

- Log in to the [MineAdmin](https://www.mineadmin.com/login) official website.  
- Navigate to the [_Settings_](https://www.mineadmin.com/member/setting) page in the `Personal Center`.  
- Click to view `My AccessToken`.  

::: danger  

---  

**Warning**  

Please safeguard your AccessToken and avoid leakage!!!  

---  

:::  

## Configure the Backend .env File  

Open the _.env_ file in the backend root directory, locate the **MINE_ACCESS_TOKEN** entry, and paste the copied string after the **equals sign**.  

```ini [.env]  
APP_NAME = MineAdmin  

APP_ENV = dev  

# Omitted...  

MINE_ACCESS_TOKEN = 107299501236086  
```  

## Apply for Developer Status  

If you are only developing applications locally for personal use, developer certification is not required, and you may distribute them to others freely.  

If you intend to publish your applications on the official marketplace, you must complete developer certification before submission, ensuring your work is protected under official copyright.  

Currently, online certification applications are not supported. Please contact **MineAdmin team members** to request developer permissions.