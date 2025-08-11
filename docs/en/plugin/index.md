# Preparation Work

::: tip  
To develop MineAdmin applications, you first need to familiarize yourself with MineAdmin and the Hyperf framework, then complete the following preparations.  
:::

## Obtain AccessToken  

MineAdmin requires an `ACCESS_TOKEN` for downloading, updating, or developing plugin applications.  

Steps to obtain:  

- Log in to the [MineAdmin](https://www.mineadmin.com/login) official website.  
- Navigate to the [_Settings_](https://www.mineadmin.com/member/setting) page under `Personal Center`.  
- Click to view `My AccessToken`.  

::: danger  

---  

**Warning**  

Please keep your AccessToken secure and do not disclose it!!!  

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

If you are only developing applications locally for personal use, developer certification is not required, and you can distribute them to others freely.  

If you intend to publish your applications on the official marketplace, you must complete developer certification before submission, ensuring your work is protected under official copyright.  

Currently, online certification applications are not supported. You will need to contact a **MineAdmin team member** to grant you developer permissions.