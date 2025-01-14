# Quick Start

Starting from version `3.0`, both the frontend and backend are housed in a single repository, so we recommend installing the backend first. The frontend source code will be downloaded along with the backend's `web` directory to your local machine.

## Download the Code

### Git

Use the Git tool to install this project. Ensure that you have the [Git](https://git-scm.com/) tool installed locally.

First, download the code to your local machine by executing the following command. `YourProject` is the name of the new application directory. If not provided, it defaults to mineadmin.

```sh [Download Code]
git clone https://github.com/mineadmin/MineAdmin.git
```

## Install and Start the System

In the previous section, we covered downloading the project code and setting up the environment. Next, we will explain how to configure the system and start it.

::: warning

Regardless of the method used to download the system code, you need to copy the `.env.example` file from the root directory to `.env` and configure the database and Redis settings in the `.env` file before proceeding to the next step.

:::

## Backend Installation

### Composer

If you are using a local environment, after configuring the `.env` file, you can proceed to [Backend Installation](#backend-installation).

### Docker

If you choose to develop with Docker, there are a few more steps to set up the environment.

```shell
docker-compose up -d
```

#### Docker-compose (Recommended)

MineAdmin comes with a well-prepared `docker-compose.yml` file. Simply execute the following command in the project directory to set up the environment.

#### Docker Build

If you want to build your own container image, we have prepared a Dockerfile for you. You just need to execute the following commands in the project directory to set up the environment.

```shell
# Build the image
docker build . -t mineadmin

# Start a container
docker run -d --name mineadmin -p 9501:9501 -v .:/opt/www mineadmin 
```

### Backend System Installation

Execute the following commands:

::: code-group

```shell[Reinstall Vendor]
composer install -vvv
```

```shell [Database Migration]
php bin/hyperf.php migrate
```

```shell [Data Seeding]
php bin/hyperf.php db:seed
```

:::

## Frontend Installation

We recommend using [nvm](https://github.com/nvm-sh/nvm) for local Node version management.

Navigate to `your_project_path/web` directory and execute:

```shell
# Install frontend dependencies
pnpm i 
# Start local development server
pnpm dev
```