# INVOEQ-BACKEND

This repository contains code for the following firebase services:

- Functions
- Firestore rules
- Storage rules
- Emulator (Function, Firestore, Storage, Auth)

---

## Installation and running

### Prerequisites

- Node.js 20 must be installed
- Java must be installed in order to run Firebase Emulator (`sudo apt install default-jre`)
- [firebase-tools](https://www.npmjs.com/package/firebase-tools) must be installed (`sudo npm i -g firebase-tools`), and authenticated (`firebase login`)

### Installation

1. Clone this repository
2. Run `npm install`

### Running & Debugging

`npm run serve`

This will start all Firebase emulators. The Emulator UI is served at http://127.0.0.1:4000/
