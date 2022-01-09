"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractFromAddress = exports.getProvider = exports.getAddress = void 0;
console.log('start');
const types_1 = require("./types/");
const Factories = __importStar(require("./types"));
const providers_1 = require("@ethersproject/providers");
const matic_json_1 = __importDefault(require("../export/abi/matic.json"));
const ethers_1 = require("ethers");
const fs_1 = __importDefault(require("fs"));
const ipfsClient = __importStar(require("ipfs-http-client"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bignumber_1 = require("@ethersproject/bignumber");
const csv = __importStar(require("fast-csv"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.listen(() => {
    console.log('server started');
});
const configEnv = process.env;
const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, configEnv.TOKEN_KEY);
        req.user = decoded;
    }
    catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};
const ipfs = ipfsClient.create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
const stakingAbis = {
    137: matic_json_1.default,
};
const networks = {
    137: "polygon",
};
const getAddress = (chainId, map, name) => {
    const chain = map[chainId];
    if (!chain) {
        console.log(`Unsupported chain '${chainId}' for contract ${name}`);
        return "";
    }
    const contract = chain.contracts[name];
    if (!contract) {
        console.log(`No ${name} deployed at network ${chain.name} (${chainId})`);
        return "";
    }
    const address = contract.address;
    console.log(`${name} resolved to address ${address} at network ${chain.name} (${chainId})`);
    return address;
};
exports.getAddress = getAddress;
const getProvider = () => {
    let chainID = parseInt(process.env.CHAIN_ID);
    if (chainID == 137) {
        return new providers_1.JsonRpcProvider(process.env.POLYGON_URL, chainID);
    }
    return (0, providers_1.getDefaultProvider)(networks[chainID], {
        etherscan: process.env.ETHERSCAN_KEY,
        infura: process.env.INFURA_ID,
    });
};
exports.getProvider = getProvider;
function getContract(connector, abis, name) {
    const wallet = new ethers_1.Wallet(process.env.PRIVATE_KEY, (0, exports.getProvider)());
    // try to resolve address
    const address = (0, exports.getAddress)(parseInt(process.env.CHAIN_ID), abis, name);
    if (address) {
        // call the factory connector
        return connector(address, wallet);
    }
    else {
        return undefined;
    }
}
function getContractFromAddress(connector, address) {
    const wallet = new ethers_1.Wallet(process.env.PRIVATE_KEY, (0, exports.getProvider)());
    // call the factory connector
    return connector(address, wallet);
}
exports.getContractFromAddress = getContractFromAddress;
function mint(eliteAddresses, oracleAddresses) {
    return __awaiter(this, void 0, void 0, function* () {
        let ElitFactory = getContractFromAddress(types_1.TotemEliteNFT__factory.connect, "0xEa983F7c3f7681C4f509b860DFC14376eED292f0");
        let NormalFactory = getContractFromAddress(types_1.TotemNormalNFT__factory.connect, "0xA61151F49A554C5dA1608005453589e9406736f4");
        let EliteWalletAddresses = [].concat(eliteAddresses);
        let EliteWalletAddressesHoldingWallet = [].concat(eliteAddresses);
        let EliteIPFSLinks = [];
        let sampleLink = `{"name":"Totem Oracle Membership","description":"Entry into the strongest Totem Warriors group ","image":"https://ipfs.io/ipfs/QmdHtVAaQLscVSnjgyyxqvE8qMLnoThvKZEtTGH7qV6gmH","external_url":"https://totemfi.com/","unique_address":"%s"}`;
        let sampleEliteLink = `{"name":"Totem Elite Membership","description":"Entry into the strongest Totem Warriors group ","image":"https://ipfs.io/ipfs/QmcUsh44y9xz7MeyGgZsTN6BLZjNiN332sVYPH3y2ja6PZ","external_url":"https://totemfi.com/","unique_address":"%s"}`;
        let NormalAddresses = [].concat(oracleAddresses);
        let NormalAddressesHoldingWallet = [].concat(oracleAddresses);
        let NormalIPFSLinks = [];
        const ipfsLnk = `https://ipfs.io/ipfs/%s`;
        // var stream = fs.createWriteStream("res.txt", {flags:'a+'});
        for (let i = 0; i < EliteWalletAddresses.length; i++) {
            try {
                const val = EliteWalletAddresses[i];
                let link = sampleEliteLink.replace("%s", EliteWalletAddressesHoldingWallet[i]);
                fs_1.default.writeFileSync(val, link);
                const file = fs_1.default.readFileSync(val);
                console.log("ipfs add");
                const filesAdded = yield ipfs.add({ path: val, content: file });
                const ipfsLink = ipfsLnk.replace("%s", filesAdded.cid.toString());
                EliteIPFSLinks.push(ipfsLink);
                fs_1.default.unlinkSync(val);
            }
            catch (error) {
                console.error(error);
            }
        }
        for (let i = 0; i < NormalAddresses.length; i++) {
            try {
                const val = NormalAddresses[i];
                let link = sampleLink.replace("%s", NormalAddressesHoldingWallet[i]);
                fs_1.default.writeFileSync(val, link);
                const file = fs_1.default.readFileSync(val);
                console.log("ipfs add");
                const filesAdded = yield ipfs.add({ path: val, content: file });
                const ipfsLink = ipfsLnk.replace("%s", filesAdded.cid.toString());
                NormalIPFSLinks.push(ipfsLink);
                fs_1.default.unlinkSync(val);
            }
            catch (error) {
                console.error(error);
            }
        }
        try {
            console.log("done stream");
            for (let i = 0; i < EliteWalletAddresses.length; i++) {
                yield (yield ElitFactory.mintToCaller(EliteWalletAddresses[i], EliteIPFSLinks[i], { gasPrice: bignumber_1.BigNumber.from("40000000000"), gasLimit: bignumber_1.BigNumber.from("400000") })).wait(1);
                console.log(`mint elite ${EliteWalletAddresses[i]}`);
            }
            for (let i = 0; i < NormalAddresses.length; i++) {
                yield (yield NormalFactory.mintToCaller(NormalAddresses[i], NormalIPFSLinks[i], { gasPrice: bignumber_1.BigNumber.from("40000000000"), gasLimit: bignumber_1.BigNumber.from("400000") })).wait(1);
                console.log(`mint normal ${NormalAddresses[i]}`);
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
function mintCommunity(addresse, count = 1, type, imageUrl, description, ids, factoryContract, contractAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = Factories.GoldenCommunityNFT__factory;
        if (contract === undefined || contract === null) {
            console.error("contract  is wrong");
            console.error(contract);
            return;
        }
        if (description.length < 2) {
            console.error("descripton length is wrong");
            return;
        }
        if (imageUrl.length < 2) {
            console.error("imageUrl length is wrong");
            return;
        }
        if (type.length < 2) {
            console.error("type length is wrong");
            return;
        }
        if (count < 1) {
            console.error("count  is wrong");
            return;
        }
        if (addresse.length < 8) {
            console.error("addresses  is wrong");
            return;
        }
        let contractFactory = getContractFromAddress(types_1.GoldenCommunityNFT__factory.connect, contractAddress);
        let sampleLink = `{"name":"TOTM Community ${type} NFT","description":"${description}","image":"${imageUrl}","external_url":"https://totemfi.com/","unique_address":"%s"}`;
        const ipfsLnk = `https://ipfs.io/ipfs/%s`;
        try {
            console.log("done stream");
            for (let i = 0; i < ids.length; i++) {
                let res = yield (yield contractFactory.mint(addresse, ids[i])).wait(1);
                console.log(res);
                console.log(`mint normal ${ids[i]}`);
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function findValidAccounts() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let provider = (0, exports.getProvider)();
            let rowList = [];
            let validAddrs = "Timestamp,Email Address,Please enter your Telegram handle,address\n";
            let file = fs_1.default.openSync("res.csv", "a+");
            fs_1.default.createReadStream("/Users/amirnouri/Documents/totemfi/deca.csv")
                .pipe(csv.parse({ headers: true }))
                .on('error', error => console.error(error))
                .on('data', (row) => __awaiter(this, void 0, void 0, function* () {
                try {
                    rowList.push(row);
                }
                catch (error) {
                    console.error(error);
                }
            }))
                .on('end', (rowCount) => __awaiter(this, void 0, void 0, function* () {
                for (let i = 188; i < rowList.length; i++) {
                    try {
                        let address = rowList[i]["address"];
                        if (address.startsWith("0x") == false) {
                            continue;
                        }
                        let balance = yield provider.getBalance(address);
                        let txcount = yield provider.getTransactionCount(address);
                        if (txcount > 0 && balance.gt(0)) {
                            fs_1.default.writeSync(file, Buffer.from(`${Object.values(rowList[i]).join(',')}\n`));
                            // fs.writeFileSync("test.csv", `${Object.values(rowList[i]).join(',')}\n`)
                            validAddrs = validAddrs + (`${Object.values(rowList[i]).join(',')}\n`);
                        }
                    }
                    catch (error) {
                        yield sleep(2000);
                        i = i - 1;
                    }
                }
                resolve(validAddrs);
                console.log(`Parsed ${rowCount} rows`);
            }));
        });
    });
}
function mintDefactorNFT() {
    return __awaiter(this, void 0, void 0, function* () {
        let rows = [];
        yield new Promise((resolve, reject) => {
            fs_1.default.createReadStream("defactor.csv")
                .pipe(csv.parse({ headers: true }))
                .on('error', error => {
                reject();
                console.error(error);
            })
                .on('data', (row) => __awaiter(this, void 0, void 0, function* () {
                try {
                    rows.push(row);
                }
                catch (error) {
                    console.error(error);
                }
            }))
                .on('end', (rowCount) => __awaiter(this, void 0, void 0, function* () {
                resolve(null);
                console.log(`Parsed ${rowCount} rows`);
            }));
        });
        let contractFactory = getContractFromAddress(types_1.DefactorPassNFT__factory.connect, "0x4d9e944d1b66e0093c13e80a4fd40ebaeb06bd68");
        for (let i = 0; i < rows.length; i++) {
            try {
                console.log("done stream");
                console.log(`addr :${rows[i]["address"]}`);
                if (rows[i]["address"].startsWith("0x")) {
                    if ((yield contractFactory.balanceOf(rows[i]["address"])).gt(0) == false) {
                        let res = yield (yield contractFactory.mintToCaller(rows[i]["address"], "TheFactory", {
                            gasLimit: 4000000,
                            gasPrice: bignumber_1.BigNumber.from(40000000000)
                        })).wait(1);
                        console.log(res);
                    }
                }
            }
            catch (error) {
                yield sleep(1000);
                i = i - 1;
            }
        }
    });
}
function minDefactorNFTOne(addrs) {
    return __awaiter(this, void 0, void 0, function* () {
        let contractFactory = getContractFromAddress(types_1.DefactorPassNFT__factory.connect, "0x4d9e944d1b66e0093c13e80a4fd40ebaeb06bd68");
        for (let i = 0; i < addrs.length; i++) {
            try {
                let res = yield (yield contractFactory.mintToCaller(addrs[i], "TheFactory", {
                    gasLimit: 4000000,
                    gasPrice: bignumber_1.BigNumber.from(40000000000)
                })).wait(1);
                console.log(res);
            }
            catch (error) {
                console.error(error);
            }
        }
    });
}
function mintNFT(address, count = 1, contractAddress, description) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = Factories.GoldenCommunityNFT__factory;
        if (contract === undefined || contract === null) {
            console.error("contract  is wrong");
            console.error(contract);
            return;
        }
        if (count < 1) {
            console.error("count  is wrong");
            return;
        }
        let contractFactory = getContractFromAddress(types_1.GhostFoxNFT__factory.connect, contractAddress);
        try {
            console.log("done stream");
            for (let i = 0; i < count; i++) {
                let res = yield (yield contractFactory.mintToCaller(address, description)).wait(1);
                console.log(res);
                console.log(`mint normal ${i}`);
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
mintNFT("0xa849AD637713050a68bb857ab317ED6BCF092f16", 253, "0x2A72fBf46bCa052Ad96Cb9534Cc8A2934456C8d2", "Ghost Fox TotemFi cid:bafybeihmsse53hbmof5ns4ls5gsca3lgddwj4t7awcvwj3x5qqwqbpw4ye").then(r => {
    console.log("don");
}).catch(err => {
    console.error(err);
});
// var ids = Array.from({ length: 10 }, (_, i) => i + 100)
// mintCommunity("0xc6D62E9E57a9CA625d73fA29B41Aa13C421cB4Fd", 1, "OWL", "https://ipfs.io/ipfs/QmWsxpMjL8bvWhvXEebPzTtkXRVZc8MMUGGZwexxLhrGYh/GoldenTileOfEagle.jpg", config.get("communityNFT.owl.description"), ids, "GoldenCommunityNFT__factory", "0x118dA0d35b1c69307d292c0fC4029DFef7D83e49").then((res) => {
//   console.log("end")
// })
// minDefactorNFTOne([
//   "0x3c93EE25724eA5a48fD668262D41542B32554563"]).then(res => {
//     console.log("done")
//   })
// mintDefactorNFT().then(res => {
//   console.log("done")
// })`
//# sourceMappingURL=index.js.map