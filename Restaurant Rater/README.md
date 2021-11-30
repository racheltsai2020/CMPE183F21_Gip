
# Restaurant Rater

A decentralized application that can be used to rate restaurants based on the following categories:
 - Food Quality
 - Service Quality
 - Environment Cleanliness

## Step 1. Download the project
`git clone https://github.com/racheltsai2020/CMPE183F21_Gip.git`

## Step 2. Install the following tools
- NPM: https://nodejs.org
- Truffle: https://github.com/trufflesuite/truffle
- Ganache: http://truffleframework.com/ganache/
- Metamask: https://metamask.io/

## Step 3. Start Ganache
Open the Ganache application. This will start a private blockchain on your local device.

## Step 4. Compile & Deploy the Smart Contract
Run this command in the folder of the project.
`$ truffle migrate --reset`

## Step 5. Configure Metamask
- Sign up or log into Metamask
- From your Ganache, get the RPC server address
- Within Metamask in your browser, go to settings -> networks -> add network
- Enter your RPC server address into the RPC URL
- To obtain the Chain ID, enter an arbitrary value. Metamask may give an error which tells you the correct Chain ID that should be used.
- Back to Ganache, choose any wallet and click on the key icon on the right
- Copy the private key
- Back in Metamask, go to My Accounts and select Import Account
- This will prompt you to enter your private key. Enter your key, click enter, and the wallet will connect to Metamask.

## Step 6. Run the Application
`$ npm run dev`  
Visit this URL in your browser: http://localhost:3000

##

We followed this tutorial to help us get started with the project:
https://youtu.be/3681ZYbDSSk

