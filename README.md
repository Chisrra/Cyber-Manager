# Cyber-Manager

An Internet café also known as a cybercafé manager made with the Fullstack dApp (Azle + Express + NextJS + ICP)

**This project is in Alpha stage, it may not be sutable for production yet!**

## Why make an Azle cybercafé Manager?

- **Increased efficiency and automation**: Automate tasks like billing, user management, and remote management, reducing errors and saving time.
- **Improved customer experience**: Simplify login, payment, and offer flexible usage options with secure environment.
- **Additional benefits**: Gain valuable insights, integrate with other systems, and future-proof your business with automatic updates.

## Run the project Locally

Clone the project

```bash
git clone https://github.com/Chisrra/Cyber-Manager.git
```

Go to the project directory

```bash
cd Cyber-Manager
```

Install the npm dependencies

```bash
npm install
```

Create a .env file:

```bash
# Create .env file
cp frontend/.env-example frontend/.env
```

Start a ICP local replica:

`dfx start --background --clean`

To stop the ICP replica: 

`dfx stop`

Get your canister ids:

```bash
# Create canisters
dfx canister create --all

# Get backend canister id
dfx canister id backend

# Get internet-identity canister id
dfx canister id internet-identity
```

Your .env file should look something like this:

```bash
# Replace BACKEND_CANISTER_ID with the 'dfx canister id backend' output
NEXT_PUBLIC_API_REST_URL=http://BACKEND_CANISTER_ID.localshot:4943
# Replace INTERNET_IDENTITY_CANISTER_ID with the 'dfx canister id internet-identity' output
NEXT_PUBLIC_INTERNET_IDENTITY_URL=http://INTERNET_IDENTITY_CANISTER_ID.localshot:4943
```

Deploy your canisters:

`dfx deploy`

Or deploy your canisters to autoreload on file changes (DO NOT deploy to mainnet with autoreload enabled):

`AZLE_AUTORELOAD=true dfx deploy`

You will receive a result similar to the following (ids could be different four you):

```bash
URLs:
  Frontend canister via browser
    frontend: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai
  Backend canister via Candid interface:
    backend: http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
```

Open your web browser and enter the Frontend URL to view the web application in action.

## Test frontend without deploy to ICP Replica

Comment the next line into `frontend/next.config.mjs` file:

```javascript
// output: "export",
```

Then, navitate to `frontend` folder:

`cd frontend`

Run the following script:

`npm run dev`


# Azle Installation 

Follow the instrucions given in [The Azle Book](https://demergent-labs.github.io/azle/get_started.html#installation) if using Arch Linux install [nvm](https://aur.archlinux.org/packages/nvm) from aur package 


# Troubleshoot

**Please remember that Azle is still in beta so it may have some problems**

Fix nvm/dfx environment issue: add the envs to your shell config (.bashrc for bash or .zshrc for zsh):
```bash
echo 'source /usr/share/nvm/init-nvm.sh' >> ~/.bashrc
echo 'source "$HOME/.local/share/dfx/env"' >> ~/.bashrc
source ~/.bashrc
```

Fix corrupted azle files (most common problem):

`npx azle clean`

Fix some dfx errors:

`dfx generate`

Fix some npm packages errors:

`npm audit fix --force`



