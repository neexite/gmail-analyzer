"use strict";
const { mboxReader } = require('mbox-reader');
const addrs = require("email-addresses");
const { filesize } = require("filesize");
const _ = require('lodash');
const fs = require('fs');


const [, , path] = process.argv
const stream = fs.createReadStream(path);
let counter = 0;
const start = Date.now();
const mails = new Map();
let rs = 0;

const main = async () => {

    for await (const message of mboxReader(stream)) {
        const [from] = message.headers.get('from');
        const address = (addrs.parseAddressList(from) || [])[0];
        const sender = address ? address.address : from;

        if (!mails.has(sender)) {
            mails.set(sender, 0);
        }

        const size = message.readSize - rs; // TODO:
        rs = message.readSize;
        mails.set(sender, mails.get(sender) + size);

        counter++;

        if (counter % 10000 == 0) {
            console.log(`'${counter}' emails processed. ${mails.size} senders`);
        }
    }
};

main()
    .catch(err => console.error(err))
    .finally(() => {
        console.log('%s messages processed in %s seconds', counter, (Date.now() - start) / 1000);
        let senders = [...mails.keys()].reduce((acc, rec) => [...acc, { d: rec, size: mails.get(rec) }], []);
        senders = _.orderBy(senders, d => d.size);

        senders.forEach(d => {
            console.log(`${d.d}\t${filesize(d.size)}\t${d.size}`);
        })
    });